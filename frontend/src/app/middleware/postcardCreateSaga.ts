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
import type { ImageRecord } from '@cardphoto/domain/types'
import type {
  EnvelopeSessionRecord,
  RecipientState,
  SenderState,
} from '@envelope/domain/types'
import type { AddressFields } from '@shared/config/constants'
import type { DispatchDate } from '@entities/date'
import type { AromaItem } from '@entities/aroma/domain/types'
import type { Card } from '@entities/card/domain/types'
import type { PostcardHydrated } from '@entities/postcard'
import {
  POSTCARD_DISPATCH_DATE_FALLBACK,
  postcardRefsFromCard,
  type PostcardRefs,
} from '@entities/postcard'
import { selectExcludedDispatchBranchSet } from '@date/infrastructure/selectors'
import {
  buildDispatchBranchKey,
  dispatchBranchKeyFromPostcard,
  parseDispatchBranchKey,
} from '@date/domain/dispatchBranchKey'
import { selectPieProgress } from '@entities/cardEditor/infrastructure/selectors'

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
  } as unknown as Card
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
function buildCartDuplicateKey(card: Card): string {
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
  const cardtextBranch = cardtext?.appliedData ?? cardtext?.assetData

  return JSON.stringify({
    photoId: appliedPhotoId,
    date: card.date ?? null,
    cardtext: {
      id: cardtextBranch?.id ?? null,
      status: cardtextBranch?.status ?? null,
      value: cardtextBranch?.value ?? null,
      style: cardtextBranch?.style ?? null,
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

function* resolveAppliedCardphotoId(
  fallbackId: string,
): Generator<unknown, string, ImageRecord | null> {
  const applyRecord = yield call(
    [storeAdapters.applyImage, 'getById'],
    'current_apply_image',
  )
  const idFromApply = applyRecord?.image?.id
  return typeof idFromApply === 'string' && idFromApply.length > 0
    ? idFromApply
    : fallbackId
}

function hasRequiredPostcardRefs(
  refs: PostcardRefs,
  envelope: EnvelopeSessionRecord,
): boolean {
  const hasCardphoto = refs.cardphoto.trim().length > 0
  const hasCardtext = refs.cardtext.trim().length > 0
  const hasRecipient = refs.recipient.trim().length > 0
  const hasAroma = refs.aroma.trim().length > 0
  const senderRequired = envelope.sender?.enabled === true
  const hasSender = (refs.sender ?? '').trim().length > 0
  return (
    hasCardphoto &&
    hasCardtext &&
    hasRecipient &&
    hasAroma &&
    (!senderRequired || hasSender)
  )
}

export function* createPostcardsFromEditor(): SagaIterator {
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
  const appliedCardphotoId: string = yield* resolveAppliedCardphotoId(appliedPhoto.id)

  const dates: Array<DispatchDate | null> =
    isMultiDateMode && mergedDates.length > 1 ? mergedDates : mergedDates.slice(0, 1)
  if (dates.length === 0) return

  const recipientEntries: AddressBookEntry[] = yield select(
    (s: { addressBook?: { recipientEntries?: AddressBookEntry[] } }) =>
      s.addressBook?.recipientEntries ?? [],
  )
  const appliedRecipientIds = envelope.recipient?.applied ?? []
  const recipientVariants: EnvelopeSessionRecord[] =
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

  const existingRows: PostcardHydrated[] = yield call([postcardsAdapter, 'getAll'])
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
        date != null &&
        excludedDispatchBranches.has(buildDispatchBranchKey(date, envelopeVariant))
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
      const cartKey = buildCartDuplicateKey(candidateCard)
      if (existingCartDedupeKeys.has(cartKey)) continue

      maxLocalId += 1
      const postcardLocalId = maxLocalId
      const finalCard: Card = {
        ...candidateCard,
        id: `${appliedPhoto.id}__${postcardLocalId}`,
      }
      const refs: PostcardRefs = {
        ...postcardRefsFromCard(finalCard),
        cardphoto: appliedCardphotoId,
      }
      if (!hasRequiredPostcardRefs(refs, envelopeVariant)) continue
      const postcard: PostcardHydrated = {
        id: `${appliedPhoto.id}__${postcardLocalId}`,
        localId: postcardLocalId,
        price: '',
        date: date ?? POSTCARD_DISPATCH_DATE_FALLBACK,
        createdAt: now,
        updatedAt: now,
        status: 'cart',
        postcard: refs,
        card: finalCard,
      }
      const { id: _postcardRowId, ...postcardForIdb } = postcard
      yield call(
        [postcardsAdapter, 'addRecordWithId'],
        postcard.id,
        postcardForIdb as Omit<PostcardHydrated, 'id'>,
      )
      existingCartDedupeKeys.add(buildCartDuplicateKey(postcard.card))
      yield put(addItem(postcard))
      didAddToCart = true
    }
  }

  if (didAddToCart) {
    yield put(clearDate())
  }

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

  const allRows: PostcardHydrated[] = yield call([postcardsAdapter, 'getAll'])
  const existing = allRows.find(
    (row) =>
      row.status === 'cart' &&
      dispatchBranchKeyFromPostcard(row) === branchKey,
  )
  if (existing) {
    yield call([postcardsAdapter, 'deleteById'], existing.id)
    yield put(removeItem(existing.localId))
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
  const appliedCardphotoId: string = yield* resolveAppliedCardphotoId(appliedPhoto.id)

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
  const postcardLocalId = maxLocalId
  const now = Date.now()
  const finalCard: Card = {
    ...candidateCard,
    id: `${appliedPhoto.id}__${postcardLocalId}`,
  }
  const refs: PostcardRefs = {
    ...postcardRefsFromCard(finalCard),
    cardphoto: appliedCardphotoId,
  }
  if (!hasRequiredPostcardRefs(refs, envelopeVariant)) {
    yield call(refreshRightSidebarBadgesFromPostcards)
    return
  }
  const postcard: PostcardHydrated = {
    id: `${appliedPhoto.id}__${postcardLocalId}`,
    localId: postcardLocalId,
    price: '',
    date,
    createdAt: now,
    updatedAt: now,
    status: 'cart',
    postcard: refs,
    card: finalCard,
  }
  const { id: _postcardRowId, ...postcardForIdb } = postcard
  yield call(
    [postcardsAdapter, 'addRecordWithId'],
    postcard.id,
    postcardForIdb as Omit<PostcardHydrated, 'id'>,
  )
  yield put(addItem(postcard))
  yield call(refreshRightSidebarBadgesFromPostcards)
}

export function* refreshRightSidebarBadgesFromPostcards(): SagaIterator {
  const allRows: PostcardHydrated[] = yield call([postcardsAdapter, 'getAll'])
  const cartCount = allRows.filter((row) => row.status === 'cart').length
  yield put(
    updateToolbarSection({
      section: 'rightSidebar',
      value: {
        cart: { options: { badge: cartCount > 0 ? cartCount : null } },
      },
    }),
  )
}
