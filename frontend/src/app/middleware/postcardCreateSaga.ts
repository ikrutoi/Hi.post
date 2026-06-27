import type { SagaIterator } from 'redux-saga'
import { PayloadAction } from '@reduxjs/toolkit'
import { call, put, select } from 'redux-saga/effects'
import { postcardLocalDataChanged } from '@features/sync/store/postcardSync.actions'
import { clearCardPieWorkspaceAfterCartAdd } from './editorPieHandlers'
import { buildNotebookCartTabCommands } from '@date/calendar/application/orchestration/notebookOrchestration.rules'
import { updateLastViewedCalendarDate } from '@date/calendar/infrastructure/state'
import { postcardsAdapter, storeAdapters } from '@db/adapters/storeAdapters'
import { addItem } from '@cart/infrastructure/state'
import {
  setRecipientsPendingIds,
  syncEnvelopeFormsFromAppliedRequested,
} from '@envelope/infrastructure/state'
import { recipientAdapter } from '@db/adapters/storeAdapters'
import { selectRecipientState } from '@envelope/recipient/infrastructure/selectors'
import {
  removeAppliedAt,
  setRecipientApplied,
  setRecipientAppliedIds,
  setRecipientAppliedWithData,
  setRecipientView,
  setRecipientViewId,
  setRecipientsViewIds,
} from '@envelope/recipient/infrastructure/state'
import type { RecipientState } from '@envelope/domain/types'
import type { AddressFields } from '@shared/config/constants'
import { updateToolbarSection } from '@toolbar/infrastructure/state'
import { selectCardphotoState } from '@cardphoto/infrastructure/selectors'
import { selectCardtextState } from '@cardtext/infrastructure/selectors'
import { selectEnvelopeSessionRecord } from '@envelope/infrastructure/selectors'
import {
  selectExcludedDispatchBranchSet,
  selectExcludedDispatchBranches,
  selectIsMultiDateMode,
  selectMergedDispatchDates,
  selectRecipientBranchSlotKeys,
  selectSelectedDate,
  selectSelectedDates,
} from '@date/infrastructure/selectors'
import {
  clearDate,
  excludeDispatchBranch,
  pickDispatchDate,
  setSelectedDates,
  toggleCartForDispatchBranch,
} from '@date/infrastructure/state'
import { selectSelectedAroma } from '@aroma/infrastructure/selectors'
import type { AddressBookEntry } from '@envelope/addressBook/domain/types'
import type { CardphotoState, ImageMeta } from '@cardphoto/domain/types'
import type { CardtextState } from '@cardtext/domain/types'
import type { ImageRecord } from '@cardphoto/domain/types'
import type {
  EnvelopeSessionRecord,
  RecipientState,
  SenderState,
} from '@envelope/domain/types'
import type { AddressFields } from '@shared/config/constants'
import type { DispatchDate } from '@entities/date'
import {
  normalizeAromaItem,
  type AromaItem,
} from '@entities/aroma/domain/types'
import type { Card } from '@entities/card/domain/types'
import type { PostcardHydrated } from '@entities/postcard'
import {
  POSTCARD_DISPATCH_DATE_FALLBACK,
  postcardRefsFromCard,
  type PostcardRefs,
} from '@entities/postcard'
import {
  buildDispatchBranchKey,
  dispatchDateKeyFromDispatchDate,
  parseDispatchBranchKey,
} from '@date/domain/dispatchBranchKey'
import { selectIsCardReady } from '@entities/card/infrastructure/selectors'
import { getCurrentDate } from '@shared/utils/date'
import { isDispatchDateDisabledForOrder } from '@entities/date/utils'
import { cardListPreviewUrlFromCard } from '@entities/card/domain/helpers'
import { setCalendarPreviewCached } from '@entities/card/infrastructure/state'
import { resolveCardphotoPreviewUrlByMetaId } from './cardphotoHelpers'

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

function* resolveCartCardThumbnailUrl(
  imageMetaId: string,
  appliedPhoto: ImageMeta,
): SagaIterator<string> {
  const fallback = appliedPhoto.thumbnail?.url || appliedPhoto.url || ''
  const resolved: string | null = yield call(
    resolveCardphotoPreviewUrlByMetaId,
    imageMetaId,
    fallback,
  )
  return resolved ?? fallback
}

function* cacheCartListPreviewForCard(card: Card): SagaIterator {
  const previewUrl = cardListPreviewUrlFromCard(card)
  if (!previewUrl?.trim()) return
  yield put(
    setCalendarPreviewCached({ cardId: card.id, blobUrl: previewUrl.trim() }),
  )
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
  const selectedAromaRaw: AromaItem | null = yield select(selectSelectedAroma)
  const aromaForRefs: AromaItem = normalizeAromaItem(selectedAromaRaw)

  const appliedPhoto = cardphoto.appliedData
  if (!appliedPhoto) return
  const appliedCardphotoId: string = yield* resolveAppliedCardphotoId(appliedPhoto.id)
  const thumbnailUrl: string = yield* resolveCartCardThumbnailUrl(
    appliedCardphotoId,
    appliedPhoto,
  )

  const dates: Array<DispatchDate | null> =
    isMultiDateMode && mergedDates.length > 1 ? mergedDates : mergedDates.slice(0, 1)
  if (dates.length === 0) return

  const recipientEntries: AddressBookEntry[] = yield select(
    (s: { addressBook?: { recipientEntries?: AddressBookEntry[] } }) =>
      s.addressBook?.recipientEntries ?? [],
  )
  const appliedRecipientIds = envelope.recipient?.applied ?? []
  const recipientVariants: EnvelopeSessionRecord[] =
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
      .filter((row) => row.status === 'cart' || row.status === 'cartBlocked')
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
        id: `${appliedCardphotoId}__candidate`,
        thumbnailUrl,
        cardphoto,
        cardtext,
        envelope: envelopeVariant,
        aroma: aromaForRefs,
        date,
      })
      const cartKey = buildCartDuplicateKey(candidateCard)
      if (existingCartDedupeKeys.has(cartKey)) continue

      maxLocalId += 1
      const postcardLocalId = maxLocalId
      const finalCard: Card = {
        ...candidateCard,
        id: `${appliedCardphotoId}__${postcardLocalId}`,
      }
      const refs: PostcardRefs = {
        ...postcardRefsFromCard(finalCard),
        cardphoto: appliedCardphotoId,
        aroma: String(aromaForRefs.index),
      }
      if (!hasRequiredPostcardRefs(refs, envelopeVariant)) continue
      const postcard: PostcardHydrated = {
        id: `${appliedCardphotoId}__${postcardLocalId}`,
        localId: postcardLocalId,
        price: '',
        date: date ?? POSTCARD_DISPATCH_DATE_FALLBACK,
        createdAt: now,
        updatedAt: now,
        status: isDispatchDateDisabledForOrder(
          date ?? POSTCARD_DISPATCH_DATE_FALLBACK,
          getCurrentDate(),
        )
          ? 'cartBlocked'
          : 'cart',
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
      yield* cacheCartListPreviewForCard(finalCard)
      didAddToCart = true
    }
  }

  if (didAddToCart) {
    yield put(clearDate())
    yield put(postcardLocalDataChanged())
  }

  yield call(refreshRightSidebarBadgesFromPostcards)
}

function sameDispatchDate(a: DispatchDate, b: DispatchDate): boolean {
  return a.year === b.year && a.month === b.month && a.day === b.day
}

/** После `excludeDispatchBranch`: если на дате не осталось веток — снять дату с выбора (как onDelete в плане). */
function* pruneDispatchDatesAfterBranchExcluded(
  branchKey: string,
): SagaIterator {
  const parsed = parseDispatchBranchKey(branchKey)
  if (!parsed) return

  const excluded: string[] = yield select(selectExcludedDispatchBranches)
  const excludedSet = new Set(excluded)
  const slotKeys: string[] = yield select(selectRecipientBranchSlotKeys)
  const dateKey = dispatchDateKeyFromDispatchDate(parsed.date)
  const anyLeftThisDate = slotKeys.some(
    (sk) => !excludedSet.has(`${dateKey}|${sk}`),
  )
  if (anyLeftThisDate) return

  const isMulti: boolean = yield select(selectIsMultiDateMode)
  if (isMulti) {
    const selectedDates: DispatchDate[] = yield select(selectSelectedDates)
    yield put(
      setSelectedDates(
        selectedDates.filter((x) => !sameDispatchDate(x, parsed.date)),
      ),
    )
  } else {
    const selectedDate: DispatchDate | null = yield select(selectSelectedDate)
    if (selectedDate && sameDispatchDate(selectedDate, parsed.date)) {
      yield put(pickDispatchDate(parsed.date))
    }
  }
}

/** Если у получателя не осталось строк плана на выбранных датах — снять с конверта (как после addCart). */
function* pruneRecipientSlotIfNoPlanBranchesLeft(
  recipientSlotKey: string,
): SagaIterator {
  const excluded: string[] = yield select(selectExcludedDispatchBranches)
  const excludedSet = new Set(excluded)
  const isMulti: boolean = yield select(selectIsMultiDateMode)
  let dates: DispatchDate[]
  if (isMulti) {
    dates = yield select(selectSelectedDates)
  } else {
    const selectedDate: DispatchDate | null = yield select(selectSelectedDate)
    dates = selectedDate ? [selectedDate] : []
  }
  const anyLeft = dates.some((d) => {
    const dk = dispatchDateKeyFromDispatchDate(d)
    return !excludedSet.has(`${dk}|${recipientSlotKey}`)
  })
  if (anyLeft) return
  yield* removeRecipientFromEnvelopeAppliedForCart(recipientSlotKey)
}

export function* handleExcludeDispatchBranch(
  action: PayloadAction<{ branchKey: string }>,
): SagaIterator {
  const { branchKey } = action.payload
  yield* pruneDispatchDatesAfterBranchExcluded(branchKey)
  const parsed = parseDispatchBranchKey(branchKey)
  if (!parsed) return
  yield* pruneRecipientSlotIfNoPlanBranchesLeft(parsed.recipientSlotKey)
}

/** Убрать строку Card pie / плана после добавления в корзину. */
function* removeCardPiePlanBranchAfterCart(branchKey: string): SagaIterator {
  yield put(excludeDispatchBranch({ branchKey }))
}

function* maybeClearCardPieWorkspaceAfterSingleAdd(
  clearEditorAfterAdd: boolean | undefined,
): SagaIterator {
  if (!clearEditorAfterAdd) return
  yield* clearCardPieWorkspaceAfterCartAdd()
}

/** После «в корзину» из Card pie: закладка Cart + центральная секция «Дата» (как клик по cart в sidebar). */
function* focusCartNotebookOnDateSection(date: DispatchDate): SagaIterator {
  for (const command of buildNotebookCartTabCommands()) {
    yield put(command)
  }
  yield put(
    updateLastViewedCalendarDate({
      year: date.year,
      month: date.month,
    }),
  )
}

function hasAddressData(data: Record<string, string>): boolean {
  return Object.values(data).some((v) => (v ?? '').trim() !== '')
}

function* loadRecipientAddressForAppliedId(
  recipient: RecipientState,
  id: string,
): SagaIterator<AddressFields | null> {
  if (
    recipient.appliedData != null &&
    hasAddressData(recipient.appliedData) &&
    (recipient.applied ?? []).includes(id)
  ) {
    return recipient.appliedData
  }
  const record: { id: string; address?: Record<string, string> } | null =
    yield call([recipientAdapter, 'getById'], id)
  if (record?.address != null && hasAddressData(record.address)) {
    return record.address as AddressFields
  }
  return null
}

/** Снять получателя ветки с конверта (он уже в корзине на открытке). */
function* removeRecipientFromEnvelopeAppliedForCart(
  recipientSlotKey: string,
): SagaIterator {
  if (recipientSlotKey === 'session') {
    yield put(setRecipientApplied(false))
  } else {
    const recipient: RecipientState = yield select(selectRecipientState)
    const applied = recipient.applied ?? []
    const index = applied.indexOf(recipientSlotKey)
    if (index < 0) return
    yield put(removeAppliedAt(index))

    const afterRemove: RecipientState = yield select(selectRecipientState)
    const nextApplied = afterRemove.applied ?? []
    if (nextApplied.length === 0) {
      yield put(setRecipientApplied(false))
    } else if (nextApplied.length === 1) {
      const id = nextApplied[0]
      const address: AddressFields | null = yield call(
        loadRecipientAddressForAppliedId,
        afterRemove,
        id,
      )
      if (address) {
        yield put(setRecipientAppliedWithData({ ids: nextApplied, data: [address] }))
      } else {
        yield put(setRecipientAppliedIds(nextApplied))
      }
    } else {
      yield put(setRecipientAppliedIds(nextApplied))
    }
  }

  const recipientNow: RecipientState = yield select(selectRecipientState)
  const ids = recipientNow.applied ?? []
  yield put(setRecipientsViewIds(ids))
  yield put(setRecipientsPendingIds(ids))
  if (ids.length === 1) {
    yield put(setRecipientViewId(ids[0]))
    yield put(setRecipientView('recipientView'))
  } else {
    yield put(setRecipientViewId(null))
    yield put(setRecipientView('recipientsView'))
  }
  yield put(syncEnvelopeFormsFromAppliedRequested())
}

export function* handleToggleCartForDispatchBranch(
  action: PayloadAction<{
    branchKey: string
    clearEditorAfterAdd?: boolean
  }>,
): SagaIterator {
  const { branchKey, clearEditorAfterAdd } = action.payload
  const parsed = parseDispatchBranchKey(branchKey)
  if (!parsed) return

  const isReadyForCart: boolean = yield select(selectIsCardReady)
  if (!isReadyForCart) return

  const allRows: PostcardHydrated[] = yield call([postcardsAdapter, 'getAll'])
  /**
   * Card pie «в корзину» — только добавление новой строки в IDB + `addItem`.
   * Уже лежащая в корзине открытка по той же ветке даты/получателя не трогается;
   * дубликат того же содержимого отсекается через `buildCartDuplicateKey` ниже.
   */

  const cardphoto: CardphotoState = yield select(selectCardphotoState)
  const cardtext: CardtextState = yield select(selectCardtextState)
  const envelope: EnvelopeSessionRecord = yield select(
    selectEnvelopeSessionRecord,
  )
  const selectedAromaRaw: AromaItem | null = yield select(selectSelectedAroma)
  const aromaForRefs: AromaItem = normalizeAromaItem(selectedAromaRaw)

  const appliedPhoto = cardphoto.appliedData
  if (!appliedPhoto) return
  const appliedCardphotoId: string = yield* resolveAppliedCardphotoId(appliedPhoto.id)
  const thumbnailUrl: string = yield* resolveCartCardThumbnailUrl(
    appliedCardphotoId,
    appliedPhoto,
  )

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
    id: `${appliedCardphotoId}__candidate`,
    thumbnailUrl,
    cardphoto,
    cardtext,
    envelope: envelopeVariant,
    aroma: aromaForRefs,
    date,
  })

  const existingCartDedupeKeys = new Set(
    allRows
      .filter((row) => row.status === 'cart' || row.status === 'cartBlocked')
      .map((row) => buildCartDuplicateKey(row.card)),
  )
  const cartKey = buildCartDuplicateKey(candidateCard)
  if (existingCartDedupeKeys.has(cartKey)) {
    yield* removeCardPiePlanBranchAfterCart(branchKey)
    yield* maybeClearCardPieWorkspaceAfterSingleAdd(clearEditorAfterAdd)
    yield* focusCartNotebookOnDateSection(date)
    yield call(refreshRightSidebarBadgesFromPostcards)
    return
  }

  let maxLocalId: number = yield call([postcardsAdapter, 'getMaxLocalId'])
  maxLocalId += 1
  const postcardLocalId = maxLocalId
  const now = Date.now()
  const finalCard: Card = {
    ...candidateCard,
    id: `${appliedCardphotoId}__${postcardLocalId}`,
  }
  const refs: PostcardRefs = {
    ...postcardRefsFromCard(finalCard),
    cardphoto: appliedCardphotoId,
    aroma: String(aromaForRefs.index),
  }
  if (!hasRequiredPostcardRefs(refs, envelopeVariant)) {
    yield call(refreshRightSidebarBadgesFromPostcards)
    return
  }
  const postcard: PostcardHydrated = {
    id: `${appliedCardphotoId}__${postcardLocalId}`,
    localId: postcardLocalId,
    price: '',
    date,
    createdAt: now,
    updatedAt: now,
    status: isDispatchDateDisabledForOrder(date, getCurrentDate())
      ? 'cartBlocked'
      : 'cart',
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
  yield* cacheCartListPreviewForCard(finalCard)
  yield* removeCardPiePlanBranchAfterCart(branchKey)
  yield* maybeClearCardPieWorkspaceAfterSingleAdd(clearEditorAfterAdd)
  yield* focusCartNotebookOnDateSection(date)
  yield call(refreshRightSidebarBadgesFromPostcards)
  yield put(postcardLocalDataChanged())
}

export function* handleAddEditorPiePlanToCart(
  action: PayloadAction<{
    branchKeys?: string[]
    clearEditorAfterAdd?: boolean
  }>,
): SagaIterator {
  const isReadyForCart: boolean = yield select(selectIsCardReady)
  if (!isReadyForCart) return

  const branchKeys = (action.payload.branchKeys ?? []).filter(
    (key): key is string => Boolean(key),
  )
  const clearEditorAfterAdd = action.payload.clearEditorAfterAdd === true

  if (branchKeys.length === 0) {
    yield call(createPostcardsFromEditor)
    yield* clearCardPieWorkspaceAfterCartAdd()
    return
  }

  for (let i = 0; i < branchKeys.length; i++) {
    yield call(handleToggleCartForDispatchBranch, {
      type: toggleCartForDispatchBranch.type,
      payload: {
        branchKey: branchKeys[i]!,
        clearEditorAfterAdd:
          branchKeys.length === 1 ? clearEditorAfterAdd : false,
      },
    })
  }

  if (branchKeys.length > 1) {
    yield* clearCardPieWorkspaceAfterCartAdd()
  }
}

export function* refreshRightSidebarBadgesFromPostcards(): SagaIterator {
  const allRows: PostcardHydrated[] = yield call([postcardsAdapter, 'getAll'])
  const currentDate = getCurrentDate()
  const activeCartCount = allRows.filter(
    (row) =>
      (row.status === 'cart' || row.status === 'cartBlocked') &&
      !isDispatchDateDisabledForOrder(row.date, currentDate),
  ).length
  const blockedCartCount = allRows.filter(
    (row) =>
      (row.status === 'cart' || row.status === 'cartBlocked') &&
      isDispatchDateDisabledForOrder(row.date, currentDate),
  ).length
  const cartBadgeValue =
    blockedCartCount > 0
      ? `${activeCartCount}/${blockedCartCount}`
      : activeCartCount > 0
        ? String(activeCartCount)
        : null
  yield put(
    updateToolbarSection({
      section: 'rightSidebar',
      value: {
        cart: { options: { badge: cartBadgeValue } },
      },
    }),
  )
}
