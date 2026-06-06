import { all, call, delay, put, select, takeLatest } from 'redux-saga/effects'
import { nanoid } from 'nanoid'
import { postcardsAdapter, storeAdapters } from '@db/adapters/storeAdapters'
import { selectCardphotoSessionRecord } from '@cardphoto/infrastructure/selectors'
import {
  commitWorkingConfig,
  hydrateEditor,
  initCardphoto,
  restoreSession,
  applyFinal,
  clearApply,
} from '@cardphoto/infrastructure/state'
import {
  updateRecipientField,
  clearRecipient,
  setRecipientApplied,
  setRecipientAppliedIds,
  setRecipientAppliedWithData,
  setRecipientAppliedData,
} from '@envelope/recipient/infrastructure/state'
import {
  updateSenderField,
  setEnabled,
  clearSender,
  setSenderApplied,
  setSenderAppliedIds,
  setSenderAppliedWithData,
  setSenderAppliedData,
} from '@envelope/sender/infrastructure/state'
import { selectSizeCard } from '@layout/infrastructure/selectors'
import { setSizeCard } from '@layout/infrastructure/state'
import {
  restoreRecipient,
  setRecipientView,
  setRecipientViewDraft,
} from '@envelope/recipient/infrastructure/state'
import { restoreSender } from '@envelope/sender/infrastructure/state'
import { setActiveSection } from '@entities/sectionEditorMenu/infrastructure/state'
import { syncCardtextToolbarVisuals } from './cardtextHandlers'
import { syncSectionMenuVisuals } from './sectionEditorMenuHandlers'
import {
  selectCardtextPlainText,
  selectCardtextStyle,
  selectCardtextEditorSessionSnapshot,
} from '@cardtext/infrastructure/selectors'
import {
  selectEnvelopeSessionRecord,
  selectIsEnvelopeReady,
  selectRecipientsList,
} from '@envelope/infrastructure/selectors'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import {
  prepareForRedux,
  hydrateMeta,
  hydrateSessionImageMeta,
  findIdbImageMetaById,
  fuelAssetRegistry,
  type IdbImageMetaSources,
} from './cardphotoHelpers'
import { processEnvelopeVisuals } from './envelopeProcessSaga'
import { restoreEditorSession } from '@entities/sectionEditorMenu/infrastructure/state'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import { selectAromaState } from '@aroma/infrastructure/selectors'
import { setAroma, clear as clearAroma } from '@aroma/infrastructure/state'
import { selectDateState } from '@date/infrastructure/selectors'
import {
  setDate,
  pickDispatchDate,
  clearDate,
  setSelectedDates,
  setMultiDateMode,
  setFirstDayOfWeek,
  hydrateDateFromSession,
  excludeDispatchBranch,
} from '@date/infrastructure/state'
import {
  syncCardphotoStatus,
  syncCardtextStatus,
  syncEnvelopeStatus,
} from './cardEditorSaga'
import {
  restorePreviewStripOrder,
  addCardtextTemplateId,
  removeCardtextTemplateId,
  addAddressTemplateRef,
  removeAddressTemplateRef,
} from '@features/previewStrip/infrastructure/state'
import type { PreviewStripOrderState } from '@features/previewStrip/infrastructure/state'
import {
  setRecipientsPendingIds,
  setRecipientsList,
  toggleRecipientSelection,
  clearRecipientsPending,
  closeAddressList,
  addressSaveSuccess,
} from '@envelope/infrastructure/state'
import {
  setRecipientViewId,
  setRecipientsViewIds,
} from '@envelope/recipient/infrastructure/state'
import { setSenderViewId } from '@envelope/sender/infrastructure/state'
import { selectRecipientViewId } from '@envelope/recipient/infrastructure/selectors'
import { selectSenderViewId } from '@envelope/sender/infrastructure/selectors'
import { selectSenderState } from '@envelope/sender/infrastructure/selectors'
import { selectRecipientState } from '@envelope/recipient/infrastructure/selectors'
import { senderAdapter, recipientAdapter } from '@db/adapters/storeAdapters'
import { cartListBillableLocalIds } from '@cart/application/logic/cartListBillableLocalIds'
import {
  addItem,
  setCartListCheckedLocalIds,
  setCartListStatusSegment,
  setItems,
  toggleCartListEntryChecked,
  removeItem,
  removeCartPostcard,
  clearCart,
} from '@cart/infrastructure/state'
import {
  selectCartListCheckedLocalIds,
  selectCartListStatusSegment,
} from '@cart/infrastructure/selectors'
import {
  refreshPostcardsCardphotoUrls,
  postcardCardphotoNeedsPersist,
} from './postcardCardphotoHydrate'
import type { RecipientState, SenderState } from '@envelope/domain/types'
import type { SessionData } from '@entities/db/domain/types'
import type { PostcardHydrated } from '@entities/postcard'
import { cardListPreviewUrlFromCard } from '@entities/card/domain/helpers'
import { setAssets } from '@entities/assetRegistry/infrastructure/state'
import type { ImageAsset } from '@entities/assetRegistry/domain/types'
import type { CardtextStyle } from '@cardtext/domain/types'
import type { EnvelopeSessionRecord } from '@envelope/domain/types'
import type {
  ImageRecord,
  CardphotoSessionRecord,
  ImageMeta,
  WorkingConfig,
} from '@cardphoto/domain/types'
import { CURRENT_EDITOR_IMAGE_ID } from '@cardphoto/domain/editorImageId'
import {
  setValue,
  setTextStyle,
  setAlign,
  clearText,
  setDraftData,
  setCardtextPresetData,
  setCardtextAppliedData,
  setStatus as setCardtextStatus,
  restoreCardtextEditorSession,
  restoreCardtextSession,
} from '@cardtext/infrastructure/state'
import type { SectionEditorMenuKey } from '@toolbar/domain/types'
import type { SizeCard } from '@layout/domain/types'
import type { AromaState } from '@entities/aroma/domain/types'
import type { DateState } from '@entities/date/domain/types'
import { rebuildConfigFromMeta } from './cardphotoProcessSaga'
import { syncCardphotoAddToolbarState } from './cardphotoToolbarSaga'
import { CardSection } from '@shared/config/constants'
import { shouldSyncUserOriginalOnRebuild } from '@cardphoto/application/helpers'
import { syncCardphotoToolbarUiFlagsAfterSessionHydrate } from '@cardphoto/application/helpers/syncCardphotoToolbarUiFlagsAfterSessionHydrate'
import { refreshRightSidebarBadgesFromPostcards } from './postcardCreateSaga'

export function* persistGlobalSession() {
  const cardphoto: CardphotoSessionRecord | null = yield select(
    selectCardphotoSessionRecord,
  )

  const cardtextEditor: SessionData['cardtextEditor'] = yield select(
    selectCardtextEditorSessionSnapshot,
  )

  const envelope: EnvelopeSessionRecord | null = yield select(
    selectEnvelopeSessionRecord,
  )

  const envelopeRecipients: import('@envelope/domain/types').RecipientState[] =
    yield select(selectRecipientsList)

  const aroma: AromaState = yield select(selectAromaState)

  const date: DateState = yield select(selectDateState)

  const activeSection: CardSection =
    (yield select(selectActiveSection)) || 'cardphoto'

  const sizeCard: SizeCard = yield select(selectSizeCard)

  const previewStripOrder: PreviewStripOrderState | undefined = yield select(
    (state: { previewStripOrder: PreviewStripOrderState }) =>
      state.previewStripOrder,
  )

  const recipientsPendingIds: string[] = yield select(
    (state: { envelopeSelection?: { recipientsPendingIds?: string[] } }) =>
      state.envelopeSelection?.recipientsPendingIds ?? [],
  )
  const recipientViewId: string | null = yield select(selectRecipientViewId)
  const senderViewId: string | null = yield select(selectSenderViewId)

  const cartListCheckedLocalIds: number[] = yield select(
    selectCartListCheckedLocalIds,
  )
  const cartListStatusSegment = yield select(selectCartListStatusSegment)

  // const newSessionData: SessionData = {
  //   id: 'current_session',
  //   assets: {
  //     cardtextId,
  //     cardphotoId,
  //     aromaId: yield select(selectAromaId),
  //   },
  //   ui: {
  //     activeSection: yield select(selectActiveSection),
  //     sizeCard: yield select(selectSizeCard),
  //   },
  //   timestamp: Date.now(),
  // }

  const sessionData: SessionData = {
    id: 'current_session',
    cardphoto,
    cardtextEditor: cardtextEditor ?? null,
    envelope,
    aroma,
    date,
    activeSection,
    sizeCard,
    previewStripOrder: previewStripOrder ?? null,
    envelopeSelection:
      recipientsPendingIds.length > 0 ||
      recipientViewId != null ||
      senderViewId != null
        ? {
            recipientsPendingIds,
            recipientTemplateId: recipientViewId,
            senderTemplateId: senderViewId,
          }
        : null,
    cartListCheckedLocalIds,
    cartListStatusSegment,
    timestamp: Date.now(),
  }

  yield call([storeAdapters.session, 'put'], sessionData)
}

const SESSION_WATCH_ACTIONS = [
  setTextStyle.type,
  setActiveSection.type,
  updateRecipientField.type,
  updateSenderField.type,
  setEnabled.type,
  setSenderApplied.type,
  setSenderAppliedIds.type,
  setSenderAppliedWithData.type,
  setSenderAppliedData.type,
  setRecipientApplied.type,
  setRecipientAppliedIds.type,
  setRecipientAppliedWithData.type,
  setRecipientAppliedData.type,
  addressSaveSuccess.type,
  clearRecipient.type,
  clearSender.type,
  restoreSender.type,
  restoreRecipient.type,
  // cardtextSlice.actions.setFontFamily.type,
  commitWorkingConfig.type,
  initCardphoto.type,
  applyFinal.type,
  clearApply.type,
  hydrateEditor.type,
  setAroma.type,
  clearAroma.type,
  setDate.type,
  pickDispatchDate.type,
  clearDate.type,
  setSelectedDates.type,
  setMultiDateMode.type,
  hydrateDateFromSession.type,
  excludeDispatchBranch.type,
  setFirstDayOfWeek.type,
  setValue.type,
  setTextStyle.type,
  setAlign.type,
  clearText.type,
  setDraftData.type,
  setCardtextPresetData.type,
  setCardtextAppliedData.type,
  setCardtextStatus.type,
  addCardtextTemplateId.type,
  removeCardtextTemplateId.type,
  addAddressTemplateRef.type,
  removeAddressTemplateRef.type,
  setRecipientsPendingIds.type,
  setRecipientViewId.type,
  setSenderViewId.type,
  setRecipientsList.type,
  setRecipientsViewIds.type,
  setRecipientView.type,
  setRecipientViewDraft.type,
  toggleRecipientSelection.type,
  clearRecipientsPending.type,
  toggleCartListEntryChecked.type,
  setCartListCheckedLocalIds.type,
  setCartListStatusSegment.type,
  addItem.type,
  removeItem.type,
  removeCartPostcard.type,
  clearCart.type,
]

function hasAddressData(data: Record<string, string>): boolean {
  return Object.values(data).some((v) => (v ?? '').trim() !== '')
}

/** Id в текущем списке формы получателей (currentData), не applied. */
function getRecipientFormViewIds(recipient: RecipientState): string[] {
  const ids =
    recipient.currentRecipientsList === 'second'
      ? (recipient.recipientsViewIdsSecondList ?? [])
      : (recipient.recipientsViewIdsFirstList ?? [])
  return ids.filter((id): id is string => id != null && id !== '')
}

function hasRecipientFormViewIds(recipient: RecipientState): boolean {
  return getRecipientFormViewIds(recipient).length > 0
}

function* loadRecipientViewDraftForId(
  recipient: RecipientState,
  id: string,
): Generator<unknown, RecipientState['viewDraft'] | null, unknown> {
  if (
    recipient.recipientViewId === id &&
    recipient.viewDraft != null &&
    hasAddressData(recipient.viewDraft)
  ) {
    return recipient.viewDraft
  }

  if (
    recipient.appliedData != null &&
    hasAddressData(recipient.appliedData) &&
    (recipient.applied ?? []).includes(id)
  ) {
    return recipient.appliedData
  }

  const envelopeList: RecipientState[] =
    ((yield select(selectRecipientsList)) as RecipientState[]) ?? []
  const fromEnvelope = envelopeList.find((r) => r.recipientViewId === id)
  if (
    fromEnvelope?.viewDraft != null &&
    hasAddressData(fromEnvelope.viewDraft)
  ) {
    return fromEnvelope.viewDraft
  }

  const record = (yield call([recipientAdapter, 'getById'], id)) as {
    id: string
    address?: Record<string, string>
  } | null
  if (record?.address != null && hasAddressData(record.address)) {
    return record.address as RecipientState['viewDraft']
  }

  return null
}

function* rehydrateEnvelopeSlicesFromTemplates() {
  const sender: SenderState = yield select(selectSenderState)
  const recipient: RecipientState = yield select(selectRecipientState)

  if (sender.senderViewId != null && !hasAddressData(sender.viewDraft)) {
    const record: { id: string; address?: Record<string, string> } | null =
      yield call([senderAdapter, 'getById'], sender.senderViewId)
    if (record?.address) {
      const address = record.address as SenderState['viewDraft']
      const isComplete = Object.values(address).every(
        (v) => (v ?? '').trim() !== '',
      )
      yield put(
        restoreSender({
          viewDraft: address,
          formIsComplete: isComplete,
          senderViewId: sender.senderViewId,
          currentView: 'senderView',
          applied: sender.applied ?? [],
          appliedData: sender.appliedData ?? null,
          enabled: true,
        }),
      )
    }
  }

  if (
    recipient.recipientViewId != null &&
    !hasAddressData(recipient.viewDraft)
  ) {
    const record: { id: string; address?: Record<string, string> } | null =
      yield call([recipientAdapter, 'getById'], recipient.recipientViewId)
    if (record?.address) {
      const address = record.address as RecipientState['viewDraft']
      const isComplete = Object.values(address).every(
        (v) => (v ?? '').trim() !== '',
      )
      yield put(
        restoreRecipient({
          viewDraft: address,
          formIsComplete: isComplete,
          recipientViewId: recipient.recipientViewId,
          currentView: recipient.currentView,
          recipientsViewIdsFirstList: recipient.recipientsViewIdsFirstList ?? [],
          recipientsViewIdsSecondList:
            recipient.recipientsViewIdsSecondList ?? [],
          currentRecipientsList: recipient.currentRecipientsList ?? 'first',
          applied: recipient.applied ?? [],
          appliedData: recipient.appliedData ?? null,
        }),
      )
    }
  }

  const recipients: RecipientState[] = yield select(selectRecipientsList)
  if (
    Array.isArray(recipients) &&
    recipients.length > 0 &&
    (recipient.recipientsViewIdsFirstList?.length ?? 0) === 0
  ) {
    yield put(
      setRecipientsViewIds(
        recipients
          .map((r) => r.recipientViewId)
          .filter((id): id is string => id != null),
      ),
    )
  }

  const recipientNow: RecipientState = yield select(selectRecipientState)
  const appliedIds = recipientNow.applied ?? []
  const envelopeList: RecipientState[] =
    (yield select(selectRecipientsList)) ?? []

  if (appliedIds.length > 0) {
    const byId = new Map(
      envelopeList
        .filter((r) => r.recipientViewId != null)
        .map((r) => [r.recipientViewId as string, r]),
    )
    const nextOrdered: RecipientState[] = []
    let changed = false

    for (const id of appliedIds) {
      let row = byId.get(id)
      if (!row) {
        const record: { id: string; address?: Record<string, string> } | null =
          yield call([recipientAdapter, 'getById'], id)
        if (record?.address) {
          const address = record.address as RecipientState['viewDraft']
          row = {
            currentView: 'recipientView',
            formDraft: address,
            viewDraft: address,
            formIsComplete: Object.values(address).every(
              (v) => (v ?? '').trim() !== '',
            ),
            formIsEmpty: true,
            sortOptions: { sortedBy: 'name', direction: 'asc' },
            recipientsViewSortDirection: 'asc',
            recipientViewId: id,
            recipientsViewIdsFirstList: [],
            recipientsViewIdsSecondList: [],
            currentRecipientsList: 'first',
            applied: [id],
            appliedData: address,
          }
          changed = true
        }
      }
      if (row) nextOrdered.push(row)
    }

    const prevKey = envelopeList.map((r) => r.recipientViewId).join('\u0000')
    const nextKey = nextOrdered.map((r) => r.recipientViewId).join('\u0000')
    if (nextOrdered.length > 0 && (changed || prevKey !== nextKey)) {
      yield put(setRecipientsList(nextOrdered))
      if (!hasRecipientFormViewIds(recipientNow)) {
        yield put(
          setRecipientsViewIds(
            nextOrdered
              .map((r) => r.recipientViewId)
              .filter((id): id is string => id != null),
          ),
        )
      }
    }
  }
}

/**
 * После reload: восстановить UI формы из currentData (списки id + currentView).
 * Если списка нет, но есть applied — открыть карточку или список по applied.
 */
function* syncRecipientFormViewAfterSessionRestore() {
  const recipient: RecipientState = yield select(selectRecipientState)
  const formIds = getRecipientFormViewIds(recipient)
  const appliedIds = (recipient.applied ?? []).filter(
    (id): id is string => id != null && id !== '',
  )

  if (formIds.length > 0) {
    const pendingIds: string[] = yield select(
      (state: {
        envelopeSelection?: { recipientsPendingIds?: string[] }
      }) => state.envelopeSelection?.recipientsPendingIds ?? [],
    )
    const pendingMatchesForm =
      pendingIds.length === formIds.length &&
      formIds.every((id, i) => pendingIds[i] === id)
    if (!pendingMatchesForm) {
      yield put(setRecipientsPendingIds(formIds))
    }

    const view = recipient.currentView ?? 'recipientsView'

    if (view === 'recipientView') {
      const id = recipient.recipientViewId ?? formIds[0]
      if (id) {
        const address: RecipientState['viewDraft'] | null = yield call(
          loadRecipientViewDraftForId,
          recipient,
          id,
        )
        if (address) {
          yield put(setRecipientViewDraft(address))
        }
        if (recipient.recipientViewId !== id) {
          yield put(setRecipientViewId(id))
        }
      }
      return
    }

    if (view === 'recipientsView' && formIds.length > 1) {
      if (recipient.recipientViewId != null) {
        yield put(setRecipientViewId(null))
      }
    }
    return
  }

  if (appliedIds.length === 0) return

  yield put(setRecipientsViewIds(appliedIds))
  yield put(setRecipientsPendingIds(appliedIds))

  if (appliedIds.length === 1) {
    const id = appliedIds[0]
    const address: RecipientState['viewDraft'] | null = yield call(
      loadRecipientViewDraftForId,
      recipient,
      id,
    )
    if (address) {
      yield put(setRecipientViewDraft(address))
    }
    yield put(setRecipientViewId(id))
    yield put(setRecipientView('recipientView'))
    return
  }

  yield put(setRecipientViewId(null))
  yield put(setRecipientView('recipientsView'))
}

function cartPostcardPreviewAssets(
  postcards: PostcardHydrated[],
): ImageAsset[] {
  const assets: ImageAsset[] = []
  const seen = new Set<string>()
  for (const p of postcards) {
    const meta = p.card.cardphoto?.appliedData
    const id = meta?.id
    if (!id || seen.has(id)) continue
    const preview = cardListPreviewUrlFromCard(p.card)
    if (!preview) continue
    seen.add(id)
    assets.push({
      id,
      url: meta?.url?.trim() || preview,
      thumbUrl: preview,
    })
  }
  return assets
}

export function* hydrateAppSession() {
  try {
    const rawPostcards: PostcardHydrated[] = yield call(postcardsAdapter.getAll)
    const postcards: PostcardHydrated[] = yield call(
      refreshPostcardsCardphotoUrls,
      rawPostcards,
    )
    for (let i = 0; i < postcards.length; i++) {
      const next = postcards[i]
      const prev = rawPostcards[i]
      if (
        prev &&
        next &&
        prev.id === next.id &&
        postcardCardphotoNeedsPersist(prev, next)
      ) {
        yield call(postcardsAdapter.put, next)
      }
    }
    yield put(setItems(postcards))

    const cartAssets = cartPostcardPreviewAssets(postcards)
    if (cartAssets.length > 0) {
      yield put(setAssets(cartAssets))
    }

    yield call(refreshRightSidebarBadgesFromPostcards)

    const session: SessionData | null = yield call(
      [storeAdapters.session, 'getById'],
      'current_session',
    )

    if (!session) return

    if (session.cartListStatusSegment) {
      yield put(setCartListStatusSegment(session.cartListStatusSegment))
    }

    const savedCheckedIds = session.cartListCheckedLocalIds ?? []
    if (savedCheckedIds.length > 0) {
      const validIds = new Set(postcards.map((p) => p.localId))
      const pruned = savedCheckedIds.filter((id) => validIds.has(id))
      if (pruned.length > 0) {
        yield put(setCartListCheckedLocalIds(pruned))
        const billableIds = cartListBillableLocalIds(postcards)
        const allChecked =
          billableIds.length > 0 &&
          billableIds.every((id) => pruned.includes(id))
        yield put(
          updateToolbarIcon({
            section: 'cartList',
            key: 'checkBox',
            value: allChecked ? 'active' : 'enabled',
          }),
        )
      }
    }

    if (session.cardphoto) {
      const {
        assetConfig,
        appliedData,
        assetData,
        userOriginalData,
      } = session.cardphoto
      const applied = appliedData
      const metaIdFromConfig =
        assetConfig.image.metaId &&
        assetConfig.image.metaId !== 'current_apply_image'
          ? assetConfig.image.metaId
          : ''
      const resolvedActiveMetaId =
        assetData?.id || appliedData?.id || metaIdFromConfig || ''

      const [stockRec, userRec, rawProcess, applyRec]: [
        { image: ImageMeta } | null,
        { image: ImageMeta } | null,
        ImageMeta | null,
        { image: ImageMeta } | null,
      ] = yield all([
        call([storeAdapters.stockImages, 'getById'], 'current_stock_image'),
        call([storeAdapters.userImages, 'getById'], CURRENT_EDITOR_IMAGE_ID),
        resolvedActiveMetaId
          ? call([storeAdapters.cardphotoImages, 'getById'], resolvedActiveMetaId)
          : null,
        call([storeAdapters.applyImage, 'getById'], 'current_apply_image'),
      ])

      const stockImageMeta = stockRec?.image ?? null
      const userImageMeta = userRec?.image ?? null
      const applyImageMeta = applyRec?.image ?? null

      const idbById: IdbImageMetaSources = {
        cropOrProcessed: rawProcess,
        apply: applyImageMeta,
        user: userImageMeta,
        stock: stockImageMeta,
      }

      const stockMeta = hydrateMeta(stockImageMeta)
      const assetIdb = findIdbImageMetaById(assetData?.id, idbById)
      const assetResolved =
        assetIdb != null
          ? hydrateMeta(assetIdb)
          : hydrateSessionImageMeta(assetData, rawProcess)

      const appliedIdb = findIdbImageMetaById(applied?.id, idbById)
      const appliedResolved =
        appliedIdb != null
          ? hydrateMeta(appliedIdb)
          : hydrateSessionImageMeta(applied, applyImageMeta)

      const appliedSameAsProcessedAsset =
        !!applied?.id &&
        !!assetResolved?.id &&
        applied.id === assetResolved.id &&
        assetResolved.status === 'processed'

      const finalApplied =
        appliedResolved ??
        (appliedSameAsProcessedAsset ? assetResolved : null)

      const userIdb = findIdbImageMetaById(userOriginalData?.id, idbById)
      const userResolved =
        userIdb != null
          ? hydrateMeta(userIdb)
          : hydrateSessionImageMeta(userOriginalData, userImageMeta)

      const processedMeta = hydrateMeta(rawProcess)

      const activeImage =
        assetResolved ??
        appliedResolved ??
        userResolved ??
        stockMeta ??
        null

      if (!activeImage) return
      const syncUserOriginal = shouldSyncUserOriginalOnRebuild(
        activeImage,
        applied ?? applyRec?.image ?? null,
      )

      // const sizeCard: SizeCard = yield select(selectSizeCard)

      let finalConfig: WorkingConfig

      const calculatedConfig: WorkingConfig = yield call(
        rebuildConfigFromMeta,
        activeImage,
        syncUserOriginal,
        assetConfig.card.orientation,
      )

      if (syncUserOriginal) {
        finalConfig = {
          ...calculatedConfig,
          image: {
            ...calculatedConfig.image,
            left: assetConfig.image.left,
            top: assetConfig.image.top,
            rotation: assetConfig.image.rotation,
          },
          crop: assetConfig.crop,
        }
      } else {
        finalConfig = calculatedConfig
      }

      const allCrops: ImageMeta[] = yield call([
        storeAdapters.cardphotoImages,
        'getAll',
      ])

      yield call(
        fuelAssetRegistry,
        {
          stock: stockMeta,
          user: userResolved,
          processed: processedMeta,
          applied: finalApplied,
        },
        allCrops,
      )

      yield put(
        hydrateEditor({
          config: finalConfig,
          isComplete: !!finalApplied,
          appliedData: finalApplied,
          assetData: assetResolved ?? activeImage,
          userOriginalData: userResolved,
        }),
      )

      yield call(
        syncCardphotoToolbarUiFlagsAfterSessionHydrate,
        userResolved,
        assetResolved ?? activeImage,
        allCrops,
      )
      yield call(syncCardphotoAddToolbarState)

      yield call(syncCardphotoStatus)
    } else {
      const [rawApplyRec, rawUserRec, allCrops, sizeCard]: [
        { image: ImageMeta } | null,
        { image: ImageMeta } | null,
        ImageMeta[],
        SizeCard,
      ] = yield all([
        call([storeAdapters.applyImage, 'getById'], 'current_apply_image'),
        call([storeAdapters.userImages, 'getById'], CURRENT_EDITOR_IMAGE_ID),
        call([storeAdapters.cardphotoImages, 'getAll']),
        select(selectSizeCard),
      ])

      const applyImg = hydrateMeta(rawApplyRec?.image || null)
      const userImg = hydrateMeta(rawUserRec?.image || null)
      const lastCrop = hydrateMeta(allCrops[allCrops.length - 1] || null)

      type Bootstrap = 'apply' | 'user' | 'processed'
      let bootstrap: Bootstrap | null = null
      if (applyImg) bootstrap = 'apply'
      else if (userImg) bootstrap = 'user'
      else if (lastCrop) bootstrap = 'processed'

      if (!bootstrap) return

      const activeImage =
        bootstrap === 'apply'
          ? applyImg
          : bootstrap === 'user'
            ? userImg
            : lastCrop
      if (!activeImage) return

      const syncUserOriginal = bootstrap === 'user'

      const config: WorkingConfig = yield call(
        rebuildConfigFromMeta,
        activeImage,
        syncUserOriginal,
        sizeCard.orientation,
      )

      yield call(
        fuelAssetRegistry,
        {
          stock: null,
          user: userImg,
          processed: lastCrop,
          applied: applyImg,
        },
        allCrops,
      )

      yield put(
        hydrateEditor({
          config,
          isComplete: !!applyImg,
          appliedData: applyImg,
          assetData: activeImage,
          userOriginalData: userImg ?? null,
        }),
      )
    }

    if (session.cardtextEditor != null) {
      yield put(restoreCardtextEditorSession(session.cardtextEditor))
    } else if (session.cardtext) {
      yield put(restoreCardtextSession(session.cardtext))
      if (session.cardtextPresetData !== undefined) {
        yield put(setCardtextPresetData(session.cardtextPresetData))
      }
      const restoredInCreateMode =
        session.cardtext.status === 'draft' &&
        (session.cardtext.id ?? null) == null
      if (restoredInCreateMode) {
        yield put(setDraftData(null))
      } else {
        yield put(setDraftData(session.cardtextCreateDraft ?? null))
      }
    }

    if (session.previewStripOrder) {
      yield put(restorePreviewStripOrder(session.previewStripOrder))
    }

    if (session.envelope) {
      const { sender, recipient } = session.envelope

      if (sender) {
        yield put(restoreSender(sender))
      }

      if (recipient) {
        yield put(restoreRecipient(recipient))
      }

      if (session.envelopeRecipients?.length) {
        yield put(setRecipientsList(session.envelopeRecipients))
        const savedRecipient = session.envelope?.recipient
        if (
          !savedRecipient ||
          !hasRecipientFormViewIds(savedRecipient)
        ) {
          yield put(
            setRecipientsViewIds(
              session.envelopeRecipients
                .map((r) => r.recipientViewId)
                .filter((id): id is string => id != null),
            ),
          )
        }
      }

      yield call(processEnvelopeVisuals)
    }

    const listIds =
      session.envelopeSelection?.recipientsPendingIds ??
      (session.envelopeSelection as { selectedRecipientIds?: string[] })
        ?.selectedRecipientIds
    if (listIds?.length) {
      yield put(setRecipientsPendingIds(listIds))
    }
    if (session.envelopeSelection?.recipientTemplateId != null) {
      yield put(
        setRecipientViewId(session.envelopeSelection.recipientTemplateId),
      )
    }
    if (session.envelopeSelection?.senderTemplateId != null) {
      yield put(setSenderViewId(session.envelopeSelection.senderTemplateId))
    }
    if (session.envelopeSelection) {
      yield call(processEnvelopeVisuals)
    }

    yield call(rehydrateEnvelopeSlicesFromTemplates)
    yield call(syncRecipientFormViewAfterSessionRestore)
    yield call(syncEnvelopeStatus)

    // При перезагрузке панели списков (Получатель / Отправитель) всегда скрыты
    yield put(closeAddressList())

    // Restore aroma and date after reload (so mini sections + CardPie update).
    if (session.aroma && session.aroma.selectedAroma) {
      yield put(setAroma(session.aroma.selectedAroma))
    }
    if (session.date) {
      yield put(
        hydrateDateFromSession({
          selectedDate: session.date.selectedDate ?? null,
          selectedDates: session.date.selectedDates ?? [],
          isMultiDateMode: session.date.isMultiDateMode ?? false,
          multiGroupId: session.date.multiGroupId ?? null,
          isComplete: session.date.isComplete ?? false,
          firstDayOfWeek: session.date.firstDayOfWeek ?? 'Sun',
          cachedSingleDate: session.date.cachedSingleDate ?? null,
          cachedMultiDates: session.date.cachedMultiDates ?? [],
          excludedDispatchBranches:
            session.date.excludedDispatchBranches ?? [],
        }),
      )
    }

    if (session.sizeCard) {
      yield put(setSizeCard(session.sizeCard))
    }

    if (session.activeSection) {
      yield put(restoreEditorSession(session.activeSection))
      yield call(syncSectionMenuVisuals, session.activeSection)

      if (session.activeSection === 'cardtext') {
        yield call(syncCardtextToolbarVisuals)
      }
    }

    if (session.cardtextEditor != null || session.cardtext) {
      yield call(syncCardtextStatus)
    }
  } catch (e) {
    console.error('Session hydration failed', e)
  } finally {
    const currentActive: SectionEditorMenuKey | null = yield select(
      selectActiveSection,
    )
    if (currentActive == null) {
      yield put(setActiveSection('cardphoto'))
    }
  }
}

export function* watchSessionChanges() {
  yield takeLatest(SESSION_WATCH_ACTIONS, function* () {
    yield delay(900)
    yield call(persistGlobalSession)
  })
}
