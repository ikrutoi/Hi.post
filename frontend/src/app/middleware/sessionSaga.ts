import { all, call, delay, put, select, takeLatest } from 'redux-saga/effects'
import { nanoid } from 'nanoid'
import { storeAdapters } from '@db/adapters/storeAdapters'
import { selectCardphotoSessionRecord } from '@cardphoto/infrastructure/selectors'
import {
  commitWorkingConfig,
  hydrateEditor,
  initCardphoto,
  setActiveSource,
  restoreSession,
  applyFinal,
  clearApply,
} from '@cardphoto/infrastructure/state'
import {
  updateRecipientField,
  clearRecipient,
} from '@envelope/recipient/infrastructure/state'
import {
  updateSenderField,
  setEnabled,
  clearSender,
} from '@envelope/sender/infrastructure/state'
import { selectSizeCard } from '@layout/infrastructure/selectors'
import { setSizeCard } from '@layout/infrastructure/state'
import {
  restoreRecipient,
  setRecipientMode,
} from '@envelope/recipient/infrastructure/state'
import { restoreSender } from '@envelope/sender/infrastructure/state'
import { setActiveSection } from '@entities/sectionEditorMenu/infrastructure/state'
import { syncCardtextToolbarVisuals } from './cardtextHandlers'
import { syncSectionMenuVisuals } from './sectionEditorMenuHandlers'
import {
  selectCardtextPlainText,
  selectCardtextSessionData,
  selectCardtextStyle,
  selectCardtextShowViewMode,
} from '@cardtext/infrastructure/selectors'
import {
  selectEnvelopeSessionRecord,
  selectIsEnvelopeReady,
  selectRecipientMode,
  selectRecipientsList,
} from '@envelope/infrastructure/selectors'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import {
  prepareForRedux,
  hydrateMeta,
  fuelAssetRegistry,
} from './cardphotoHelpers'
import { processEnvelopeVisuals } from './envelopeProcessSaga'
import { restoreEditorSession } from '@entities/sectionEditorMenu/infrastructure/state'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import { selectAromaState } from '@aroma/infrastructure/selectors'
import { setAroma, clear as clearAroma } from '@aroma/infrastructure/state'
import { selectDateState } from '@date/infrastructure/selectors'
import { setDate } from '@date/infrastructure/state'
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
import type { RecipientState, SenderState } from '@envelope/domain/types'
import type { SessionData } from '@entities/db/domain/types'
import type {
  CardtextTemplateContent,
  CardtextStyle,
} from '@cardtext/domain/types'
import type { EnvelopeSessionRecord } from '@envelope/domain/types'
import type {
  ImageRecord,
  CardphotoBase,
  CardphotoSessionRecord,
  ImageMeta,
  WorkingConfig,
  ActiveImageSource,
} from '@cardphoto/domain/types'
import { CURRENT_EDITOR_IMAGE_ID } from '@cardphoto/domain/editorImageId'
import {
  setValue,
  setTextStyle,
  setAlign,
  clearText,
  setComplete,
  setApplied,
  setAppliedData,
  restoreCardtextSession,
  setCardtextCurrentView,
} from '@cardtext/infrastructure/state'
import type { SectionEditorMenuKey } from '@toolbar/domain/types'
import type { SizeCard } from '@layout/domain/types'
import type { AromaState } from '@entities/aroma/domain/types'
import type { DateState } from '@entities/date/domain/types'
import { rebuildConfigFromMeta } from './cardphotoProcessSaga'
import { CardSection } from '@shared/config/constants'

function deriveSourceFromMeta(
  asset: ImageMeta | null,
  applied: ImageMeta | null,
): ActiveImageSource | null {
  if (asset?.id && applied?.id && asset.id === applied.id) return 'apply'
  if (asset?.status === 'processed') return 'processed'
  if (asset?.source === 'user') return 'user'
  if (asset?.source === 'stock') return 'stock'
  return null
}

export function* persistGlobalSession() {
  const cardphoto: CardphotoSessionRecord | null = yield select(
    selectCardphotoSessionRecord,
  )

  const cardtext: SessionData['cardtext'] = yield select(
    selectCardtextSessionData,
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
  const recipientMode: 'recipient' | 'recipients' = yield select(
    selectRecipientMode,
  )
  const recipientViewId: string | null = yield select(selectRecipientViewId)
  const senderViewId: string | null = yield select(selectSenderViewId)

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

  const cardtextShowViewMode: boolean = yield select(selectCardtextShowViewMode)

  const sessionData: SessionData = {
    id: 'current_session',
    cardphoto,
    cardtext,
    cardtextShowViewMode: cardtextShowViewMode || undefined,
    envelope,
    aroma,
    date,
    activeSection,
    sizeCard,
    previewStripOrder: previewStripOrder ?? null,
    envelopeSelection:
      recipientsPendingIds.length > 0 ||
      recipientMode !== 'recipient' ||
      recipientViewId != null ||
      senderViewId != null
        ? {
            recipientsPendingIds,
            recipientMode,
            recipientTemplateId: recipientViewId,
            senderTemplateId: senderViewId,
          }
        : null,
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
  clearRecipient.type,
  clearSender.type,
  // cardtextSlice.actions.setFontFamily.type,
  commitWorkingConfig.type,
  initCardphoto.type,
  setActiveSource.type,
  applyFinal.type,
  clearApply.type,
  hydrateEditor.type,
  setAroma.type,
  clearAroma.type,
  setDate.type,
  setValue.type,
  setTextStyle.type,
  setAlign.type,
  clearText.type,
  setCardtextCurrentView.type,
  setComplete.type,
  setApplied.type,
  setAppliedData.type,
  addCardtextTemplateId.type,
  removeCardtextTemplateId.type,
  addAddressTemplateRef.type,
  removeAddressTemplateRef.type,
  setRecipientsPendingIds.type,
  setRecipientMode.type,
  setRecipientViewId.type,
  setSenderViewId.type,
  setRecipientsList.type,
  setRecipientsViewIds.type,
  toggleRecipientSelection.type,
  clearRecipientsPending.type,
]

function hasAddressData(data: Record<string, string>): boolean {
  return Object.values(data).some((v) => (v ?? '').trim() !== '')
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
          currentView: 'recipientView',
          recipientsViewIdsFirstList: recipient.recipientsViewIdsFirstList ?? [],
          recipientsViewIdsSecondList:
            recipient.recipientsViewIdsSecondList ?? [],
          currentRecipientsList: recipient.currentRecipientsList ?? 'first',
          applied: recipient.applied ?? [],
          appliedData: recipient.appliedData ?? null,
          mode: recipient.mode,
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
}

export function* hydrateAppSession() {
  try {
    const session: SessionData | null = yield call(
      [storeAdapters.session, 'getById'],
      'current_session',
    )

    if (!session) return

    if (session.cardphoto) {
      const {
        assetConfigLight,
        appliedDataLight,
        assetDataLight,
        userOriginalData,
      } = session.cardphoto
      const applied = appliedDataLight
      const resolvedActiveMetaId =
        assetDataLight?.id || assetConfigLight.image.metaId || ''

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

      const base: CardphotoBase = {
        stock: { image: hydrateMeta(stockRec?.image || null) },
        user: {
          image: hydrateMeta(userOriginalData ?? userRec?.image ?? null),
        },
        processed: { image: hydrateMeta(rawProcess) },
        // Session is the source of truth for applied state.
        // Fallback to DB record only when session field is absent.
        apply: { image: hydrateMeta(applied ?? (applyRec?.image || null)) },
      }

      const activeImage =
        assetDataLight ??
        applied ??
        base.user.image ??
        base.processed.image ??
        base.stock.image ??
        null

      if (!activeImage) return
      const source = deriveSourceFromMeta(activeImage, applied) ?? 'stock'

      // const sizeCard: SizeCard = yield select(selectSizeCard)

      let finalConfig: WorkingConfig

      const calculatedConfig: WorkingConfig = yield call(
        rebuildConfigFromMeta,
        activeImage,
        source,
        assetConfigLight.card.orientation,
      )

      if (source === 'user') {
        finalConfig = {
          ...calculatedConfig,
          image: {
            ...calculatedConfig.image,
            left: assetConfigLight.image.left,
            top: assetConfigLight.image.top,
            rotation: assetConfigLight.image.rotation,
          },
          crop: assetConfigLight.crop,
        }
      } else {
        finalConfig = calculatedConfig
      }

      const allCrops: ImageMeta[] = yield call([
        storeAdapters.cardphotoImages,
        'getAll',
      ])

      yield call(fuelAssetRegistry, base, allCrops)

      yield put(
        hydrateEditor({
          config: calculatedConfig,
          isComplete: !!applied,
          appliedData: applied,
          assetData: assetDataLight ?? activeImage,
          userOriginalData: userOriginalData ?? base.user.image ?? null,
        }),
      )

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

      const base: CardphotoBase = {
        apply: { image: applyImg },
        user: { image: userImg },
        processed: { image: lastCrop },
        stock: { image: null },
      }

      let autoSource: ActiveImageSource | null = null
      if (applyImg) autoSource = 'apply'
      else if (userImg) autoSource = 'user'
      else if (lastCrop) autoSource = 'processed'

      if (!autoSource) return

      const activeImage = base[autoSource].image
      if (!activeImage) return

      const config: WorkingConfig = yield call(
        rebuildConfigFromMeta,
        activeImage,
        autoSource,
        activeImage.orientation,
      )

      yield call(fuelAssetRegistry, base, allCrops)

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

    if (session.cardtext) {
      yield put(restoreCardtextSession(session.cardtext))
      if (session.cardtextShowViewMode) {
        yield put(setCardtextCurrentView('cardtextView'))
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
        yield put(setRecipientMode(recipient.mode))
      }

      if (session.envelopeRecipients?.length) {
        yield put(setRecipientsList(session.envelopeRecipients))
        yield put(
          setRecipientsViewIds(
            session.envelopeRecipients
              .map((r) => r.recipientViewId)
              .filter((id): id is string => id != null),
          ),
        )
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
    if (session.envelopeSelection?.recipientMode) {
      yield put(setRecipientMode(session.envelopeSelection.recipientMode))
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
    yield call(syncEnvelopeStatus)

    // При перезагрузке панели списков (Получатель / Отправитель) всегда скрыты
    yield put(closeAddressList())

    // Restore aroma and date after reload (so mini sections + CardPie update).
    if (session.aroma && session.aroma.selectedAroma) {
      yield put(setAroma(session.aroma.selectedAroma))
    }
    if (session.date && session.date.selectedDate) {
      yield put(setDate(session.date.selectedDate))
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

    if (session.cardtext) {
      yield call(syncCardtextStatus)
    }
  } catch (e) {
    console.error('Session hydration failed', e)
  }
}

export function* watchSessionChanges() {
  yield takeLatest(SESSION_WATCH_ACTIONS, function* () {
    yield delay(900)
    yield call(persistGlobalSession)
  })
}
