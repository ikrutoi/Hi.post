import type { SagaIterator } from 'redux-saga'
import { PayloadAction } from '@reduxjs/toolkit'
import { call, put, select } from 'redux-saga/effects'
import { postcardsAdapter, storeAdapters } from '@db/adapters/storeAdapters'
import { addItem, removeItem } from '@cart/infrastructure/state'
import { updateToolbarSection } from '@toolbar/infrastructure/state'
import { selectCardphotoState } from '@cardphoto/infrastructure/selectors'
import { selectCardtextState } from '@cardtext/infrastructure/selectors'
import { selectEnvelopeSessionRecord } from '@envelope/infrastructure/selectors'
import {
  selectMergedDispatchDates,
  selectIsMultiDateMode,
} from '@date/infrastructure/selectors'
import { clearDate } from '@date/infrastructure/state'
import { selectSelectedAroma } from '@aroma/infrastructure/selectors'
import type { AddressBookEntry } from '@envelope/addressBook/domain/types'
import type { CardphotoState } from '@cardphoto/domain/types'
import type { CardtextState } from '@cardtext/domain/types'
import type {
  EnvelopeSessionRecord,
  RecipientState,
  SenderState,
} from '@envelope/domain/types'
import type { AddressFields } from '@shared/config/constants'
import type { DispatchDate } from '@entities/date'
import type { AromaItem } from '@entities/aroma/domain/types'
import type { CardStatus, Postcard } from '@entities/postcard'
import { POSTCARD_DISPATCH_DATE_FALLBACK } from '@entities/postcard'
import type { SessionData } from '@entities/db/domain/types'
import { selectExcludedDispatchBranchSet } from '@date/infrastructure/selectors'
import {
  buildDispatchBranchKey,
  dispatchBranchKeyFromPostcard,
  parseDispatchBranchKey,
} from '@date/domain/dispatchBranchKey'
import { selectPieProgress } from '@entities/cardEditor/infrastructure/selectors'

type CreateTarget = 'favorite' | 'cart'

function* setSessionFavoritePostcardLocalId(
  favoritePostcardLocalId: number | null,
): SagaIterator {
  const currentSession: SessionData | null = yield call(
    [storeAdapters.session, 'getById'],
    'current_session',
  )
  if (!currentSession) return
  yield call([storeAdapters.session, 'put'], {
    ...currentSession,
    favoritePostcardLocalId,
  })
}

function buildBaseCard(opts: {
  id: string
  thumbnailUrl: string
  cardphoto: CardphotoState
  cardtext: CardtextState
  envelope: EnvelopeSessionRecord
  aroma: AromaItem
  date: DispatchDate | null
}) {
  const { id, thumbnailUrl, cardphoto, cardtext, envelope, aroma, date } = opts
  // Favorite snapshot is intentionally date-less; Date is required in Card type.
  return {
    id,
    thumbnailUrl,
    cardphoto,
    cardtext,
    envelope,
    aroma,
    date,
  } as unknown as Postcard['card']
}

function normalizeAddressForDedupe(
  a: AddressFields | null | undefined,
): Record<string, string> {
  if (a == null) {
    return { name: '', street: '', city: '', zip: '', country: '' }
  }
  return {
    name: String(a.name ?? '').trim(),
    street: String(a.street ?? '').trim(),
    city: String(a.city ?? '').trim(),
    zip: String(a.zip ?? '').trim(),
    country: String(a.country ?? '').trim(),
  }
}

/**
 * Дубликат строки корзины без preview/blob URL — после reload старый fingerprint с URL не совпадал с IDB.
 */
function buildCartDuplicateKey(card: Postcard['card']): string {
  const cardphoto = card.cardphoto as Partial<CardphotoState> | undefined
  const appliedPhotoId =
    (cardphoto?.appliedData as { id?: string } | undefined)?.id ?? null

  const cardtext = card.cardtext as Partial<CardtextState> | undefined
  const envelope = card.envelope as Partial<EnvelopeSessionRecord> | undefined
  const recipient = envelope?.recipient as Partial<RecipientState> | undefined
  const sender = envelope?.sender as Partial<SenderState> | undefined
  const aroma = card.aroma as Partial<AromaItem> | undefined

  const recipientAppliedIds = [...(recipient?.applied ?? [])].sort().join('|')
  const senderAppliedIds = [...(sender?.applied ?? [])].sort().join('|')

  return JSON.stringify({
    photoId: appliedPhotoId,
    date: card.date ?? null,
    cardtext: {
      id: cardtext?.id ?? null,
      status: cardtext?.status ?? null,
      value: cardtext?.value ?? null,
      style: cardtext?.style ?? null,
    },
    recipient: {
      mode: recipient?.mode ?? null,
      recipientViewId: recipient?.recipientViewId ?? null,
      appliedIds: recipientAppliedIds,
      addr: normalizeAddressForDedupe(recipient?.appliedData ?? undefined),
    },
    sender: {
      enabled: sender?.enabled ?? false,
      senderViewId: sender?.senderViewId ?? null,
      appliedIds: senderAppliedIds,
      addr: normalizeAddressForDedupe(sender?.appliedData ?? undefined),
    },
    aromaIndex: aroma?.index ?? null,
  })
}

function buildPostcardFingerprint(input: {
  status: CardStatus
  card: Postcard['card']
}): string {
  const { status, card } = input
  const cardphoto = card.cardphoto as Partial<CardphotoState> | undefined
  const cardtext = card.cardtext as Partial<CardtextState> | undefined
  const envelope = card.envelope as Partial<EnvelopeSessionRecord> | undefined
  const aroma = card.aroma as Partial<AromaItem> | undefined

  const appliedData = cardphoto?.appliedData as
    | {
        id?: string
        previewUrl?: string
        thumbnail?: { url?: string } | null
      }
    | null
    | undefined

  return JSON.stringify({
    status,
    // Keep only stable domain-significant payload (reload-safe).
    card: {
      thumbnailUrl: card.thumbnailUrl ?? '',
      date: card.date ?? null,
      cardphoto: {
        appliedId: appliedData?.id ?? null,
        appliedPreviewUrl: appliedData?.previewUrl ?? null,
        appliedThumbUrl: appliedData?.thumbnail?.url ?? null,
      },
      cardtext: {
        id: cardtext?.id ?? null,
        status: cardtext?.status ?? null,
        value: cardtext?.value ?? null,
        style: cardtext?.style ?? null,
      },
      envelope: {
        sender: envelope?.sender ?? null,
        recipient: envelope?.recipient ?? null,
      },
      aroma: {
        index: aroma?.index ?? null,
      },
    },
  })
}

export function* createPostcardsFromEditor(target: CreateTarget): SagaIterator {
  const cardphoto: CardphotoState = yield select(selectCardphotoState)
  const cardtext: CardtextState = yield select(selectCardtextState)
  const envelope: EnvelopeSessionRecord = yield select(
    selectEnvelopeSessionRecord,
  )
  const mergedDates: DispatchDate[] = yield select(selectMergedDispatchDates)
  const isMultiDateMode: boolean = yield select(selectIsMultiDateMode)
  const aroma: AromaItem = yield select(selectSelectedAroma)

  const appliedPhoto = cardphoto.appliedData
  if (!appliedPhoto) return

  const status: CardStatus = target === 'favorite' ? 'favorite' : 'cart'
  const dates: Array<DispatchDate | null> =
    target === 'favorite'
      ? [null]
      : isMultiDateMode && mergedDates.length > 1
        ? mergedDates
        : mergedDates.slice(0, 1)
  if (dates.length === 0) return

  const recipientEntries: AddressBookEntry[] = yield select(
    (s: { addressBook?: { recipientEntries?: AddressBookEntry[] } }) =>
      s.addressBook?.recipientEntries ?? [],
  )
  const appliedRecipientIds = envelope.recipient?.applied ?? []
  const recipientVariants: EnvelopeSessionRecord[] =
    target === 'cart' &&
    envelope.recipient?.mode === 'recipients' &&
    appliedRecipientIds.length > 0
      ? appliedRecipientIds.map((recipientId) => {
          const matchedAddress =
            recipientEntries.find((entry) => entry.id === recipientId)?.address ??
            null
          return {
            ...envelope,
            recipient: {
              ...envelope.recipient,
              applied: [recipientId],
              appliedData: matchedAddress,
            },
          }
        })
      : [envelope]

  const excludedDispatchBranches: Set<string> = yield select(
    selectExcludedDispatchBranchSet,
  )

  const existingRows: Postcard[] = yield call([postcardsAdapter, 'getAll'])
  const existingFingerprints = new Set(
    existingRows.map((row) =>
      buildPostcardFingerprint({
        status: row.status,
        card: row.card,
      }),
    ),
  )
  const existingCartDedupeKeys = new Set(
    existingRows
      .filter((row) => row.status === 'cart')
      .map((row) => buildCartDuplicateKey(row.card)),
  )

  let maxLocalId: number = yield call([postcardsAdapter, 'getMaxLocalId'])
  const now = Date.now()
  let didAddToCart = false

  for (const date of dates) {
    for (const envelopeVariant of recipientVariants) {
      if (
        status === 'cart' &&
        date != null &&
        excludedDispatchBranches.has(
          buildDispatchBranchKey(date, envelopeVariant),
        )
      ) {
        continue
      }
      const candidateCard = buildBaseCard({
        id: `${appliedPhoto.id}__candidate`,
        thumbnailUrl: appliedPhoto.thumbnail?.url ?? '',
        cardphoto,
        cardtext,
        envelope: envelopeVariant,
        aroma,
        date,
      })
      if (status === 'cart') {
        const cartKey = buildCartDuplicateKey(candidateCard)
        if (existingCartDedupeKeys.has(cartKey)) continue
      } else {
        const fingerprint = buildPostcardFingerprint({
          status,
          card: candidateCard,
        })
        if (existingFingerprints.has(fingerprint)) {
          const existingFavorite = existingRows.find(
            (row) =>
              row.status === 'favorite' &&
              buildPostcardFingerprint({ status: row.status, card: row.card }) ===
                fingerprint,
          )
          if (existingFavorite) {
            yield call(setSessionFavoritePostcardLocalId, existingFavorite.id)
          }
          continue
        }
      }

      maxLocalId += 1
      const postcardId = maxLocalId
      const postcard: Postcard = {
        id: postcardId,
        price: '',
        date: date ?? POSTCARD_DISPATCH_DATE_FALLBACK,
        createdAt: now,
        updatedAt: now,
        status,
        card: {
          ...candidateCard,
          id: `${appliedPhoto.id}__${postcardId}`,
        },
      }
      const { id: _postcardRowId, ...postcardForIdb } = postcard
      yield call(
        [postcardsAdapter, 'addRecordWithId'],
        postcardId,
        postcardForIdb as Omit<Postcard, 'id'>,
      )
      if (status === 'cart') {
        existingCartDedupeKeys.add(buildCartDuplicateKey(postcard.card))
        yield put(addItem(postcard))
        didAddToCart = true
      } else {
        existingFingerprints.add(
          buildPostcardFingerprint({ status, card: postcard.card }),
        )
        yield call(setSessionFavoritePostcardLocalId, postcardId)
      }
    }
  }

  if (target === 'cart' && didAddToCart) {
    yield put(clearDate())
  }

  yield call(refreshRightSidebarBadgesFromPostcards)
}

export function* removeFavoritePostcardsFromEditor(): SagaIterator {
  const currentSession: SessionData | null = yield call(
    [storeAdapters.session, 'getById'],
    'current_session',
  )
  const favoriteId = currentSession?.favoritePostcardLocalId ?? null
  if (favoriteId != null) {
    // In canonical postcards store keyPath is `id`; for these rows it matches postcard.id.
    yield call([postcardsAdapter, 'deleteById'], favoriteId)
  }
  yield call(setSessionFavoritePostcardLocalId, null)

  yield call(refreshRightSidebarBadgesFromPostcards)
}

export function* handleToggleCartForDispatchBranch(
  action: PayloadAction<{ branchKey: string }>,
): SagaIterator {
  const { branchKey } = action.payload
  const parsed = parseDispatchBranchKey(branchKey)
  if (!parsed) return

  const { isAllComplete } = yield select(selectPieProgress)
  if (!isAllComplete) return

  const allRows: Postcard[] = yield call([postcardsAdapter, 'getAll'])
  const existing = allRows.find(
    (row) =>
      row.status === 'cart' &&
      dispatchBranchKeyFromPostcard(row) === branchKey,
  )
  if (existing) {
    yield call([postcardsAdapter, 'deleteById'], existing.id)
    yield put(removeItem(existing.id))
    yield call(refreshRightSidebarBadgesFromPostcards)
    return
  }

  const cardphoto: CardphotoState = yield select(selectCardphotoState)
  const cardtext: CardtextState = yield select(selectCardtextState)
  const envelope: EnvelopeSessionRecord = yield select(
    selectEnvelopeSessionRecord,
  )
  const aroma: AromaItem = yield select(selectSelectedAroma)

  const appliedPhoto = cardphoto.appliedData
  if (!appliedPhoto) return

  const excludedDispatchBranches: Set<string> = yield select(
    selectExcludedDispatchBranchSet,
  )
  if (excludedDispatchBranches.has(branchKey)) return

  const recipientEntries: AddressBookEntry[] = yield select(
    (s: { addressBook?: { recipientEntries?: AddressBookEntry[] } }) =>
      s.addressBook?.recipientEntries ?? [],
  )

  const { date, recipientSlotKey } = parsed
  const appliedRecipientIds = envelope.recipient?.applied ?? []
  const useRecipientVariants =
    envelope.recipient?.mode === 'recipients' &&
    appliedRecipientIds.length > 0 &&
    appliedRecipientIds.includes(recipientSlotKey)

  const envelopeVariant: EnvelopeSessionRecord = useRecipientVariants
    ? {
        ...envelope,
        recipient: {
          ...envelope.recipient,
          applied: [recipientSlotKey],
          appliedData:
            recipientEntries.find((e) => e.id === recipientSlotKey)?.address ??
            null,
        },
      }
    : envelope

  const candidateCard = buildBaseCard({
    id: `${appliedPhoto.id}__candidate`,
    thumbnailUrl: appliedPhoto.thumbnail?.url ?? '',
    cardphoto,
    cardtext,
    envelope: envelopeVariant,
    aroma,
    date,
  })

  const existingCartDedupeKeys = new Set(
    allRows
      .filter((row) => row.status === 'cart')
      .map((row) => buildCartDuplicateKey(row.card)),
  )
  const cartKey = buildCartDuplicateKey(candidateCard)
  if (existingCartDedupeKeys.has(cartKey)) {
    yield call(refreshRightSidebarBadgesFromPostcards)
    return
  }

  let maxLocalId: number = yield call([postcardsAdapter, 'getMaxLocalId'])
  maxLocalId += 1
  const postcardId = maxLocalId
  const now = Date.now()
  const postcard: Postcard = {
    id: postcardId,
    price: '',
    date,
    createdAt: now,
    updatedAt: now,
    status: 'cart',
    card: {
      ...candidateCard,
      id: `${appliedPhoto.id}__${postcardId}`,
    },
  }
  const { id: _postcardRowId, ...postcardForIdb } = postcard
  yield call(
    [postcardsAdapter, 'addRecordWithId'],
    postcardId,
    postcardForIdb as Omit<Postcard, 'id'>,
  )
  yield put(addItem(postcard))
  yield call(refreshRightSidebarBadgesFromPostcards)
}

export function* refreshRightSidebarBadgesFromPostcards(): SagaIterator {
  const allRows: Postcard[] = yield call([postcardsAdapter, 'getAll'])
  const cartCount = allRows.filter((row) => row.status === 'cart').length
  const favoriteCount = allRows.filter((row) => row.status === 'favorite').length
  yield put(
    updateToolbarSection({
      section: 'rightSidebar',
      value: {
        cart: { options: { badge: cartCount > 0 ? cartCount : null } },
        favorite: { options: { badge: favoriteCount > 0 ? favoriteCount : null } },
      },
    }),
  )
}
