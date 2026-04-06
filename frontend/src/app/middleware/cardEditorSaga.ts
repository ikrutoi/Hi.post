import type { SagaIterator } from 'redux-saga'
import { takeEvery, put, select, call, fork } from 'redux-saga/effects'
import {
  setSectionComplete,
  clearSection,
} from '@entities/cardEditor/infrastructure/state'
import {
  setDate,
  setSelectedDates,
  setMultiDateMode,
  clearDate,
  hydrateDateFromSession,
} from '@date/infrastructure/state'
import { setAroma, clear as clearAroma } from '@aroma/infrastructure/state'
import {
  updateRecipientField,
  setRecipientApplied,
  setRecipientAppliedWithData,
  removeAppliedAt,
  setRecipientAppliedData,
  restoreRecipient,
  clearRecipient,
} from '@envelope/recipient/infrastructure/state'
import {
  updateSenderField,
  setEnabled,
  setSenderApplied,
  setSenderAppliedIds,
  setSenderAppliedWithData,
  setSenderAppliedData,
  restoreSender,
  clearSender,
} from '@envelope/sender/infrastructure/state'
import { selectIsEnvelopeReady } from '@envelope/infrastructure/selectors'
import { setRecipientMode } from '@envelope/recipient/infrastructure/state'
import { clearRecipientsList } from '@envelope/infrastructure/state'
import { selectIsDateComplete } from '@date/infrastructure/selectors'
import {
  selectSelectedAroma,
  selectIsAromaComplete,
} from '@aroma/infrastructure/selectors'
import {
  setValue,
  setStatus as setCardtextStatus,
  clearText,
  setTextStyle,
  setAlign,
  setFontSizeStep,
  restoreCardtextSession,
  restoreCardtextEditorSession,
  setCardtextAppliedData,
} from '@cardtext/infrastructure/state'
import {
  selectCardtextAssetMatchesApplied,
  selectCardtextIsComplete,
  selectCardtextState,
  selectCardtextValue,
} from '@cardtext/infrastructure/selectors'
import { updateToolbarSection } from '@toolbar/infrastructure/state'
import {
  applyFinal,
  clearApply,
  reset,
  resetCropLayers,
  hydrateEditor,
  restoreSession,
} from '@cardphoto/infrastructure/state'
import {
  selectCardphotoIsComplete,
  selectCardphotoState,
} from '@cardphoto/infrastructure/selectors'
import { buildCardtextToolbarState } from '@cardtext/domain/helpers'
import {
  selectCardById,
  selectIsCardReady,
  selectIsProcessedReady,
} from '@entities/card/infrastructure/selectors'
import {
  cardActions,
  changeStatus,
  clearProcessed,
  copySectionToProcessed,
  setPreviewCardId,
  syncProcessedRequest,
} from '@entities/card/infrastructure/state'
import type { RootState } from '@app/state'
import type { CardphotoState } from '@cardphoto/domain/types'
import type { CardtextState } from '@cardtext/domain/types'
import { initialCardtextValue } from '@cardtext/domain/types'
import type { Card } from '@entities/card/domain/types'
import { checkAndSyncProcessedCard } from './syncProcessedCard'

function* syncDateSet() {
  const dateComplete: boolean = yield select(selectIsDateComplete)
  yield put(setSectionComplete({ section: 'date', isComplete: dateComplete }))
}

function* syncDateClear() {
  yield put(clearSection('date'))
}

function* syncAromaSet() {
  const aromaComplete: boolean = yield select(selectIsAromaComplete)
  yield put(setSectionComplete({ section: 'aroma', isComplete: aromaComplete }))
}

function* syncAromaClear() {
  yield put(clearSection('aroma'))
}

export function* syncEnvelopeStatus() {
  const isReady: boolean = yield select(selectIsEnvelopeReady)
  yield put(setSectionComplete({ section: 'envelope', isComplete: isReady }))
}

function* syncEnvelopeClear() {
  yield put(setSectionComplete({ section: 'envelope', isComplete: false }))
  yield put(clearSection('envelope'))
}

export function* syncCardtextStatus() {
  const textComplete: boolean = yield select(selectCardtextIsComplete)
  yield put(
    setSectionComplete({ section: 'cardtext', isComplete: textComplete }),
  )
}

function* syncCardtextReset() {
  yield put(clearSection('cardtext'))
}

function* syncCardtextToolbar(): SagaIterator {
  const value: ReturnType<typeof selectCardtextValue> =
    yield select(selectCardtextValue)
  const assetMatchesApplied: boolean = yield select(
    selectCardtextAssetMatchesApplied,
  )
  const isListOpen: boolean = yield select(
    (state: RootState) => state.cardtext.isListPanelOpen === true,
  )
  const currentListIcon = yield select(
    (state: RootState) => state.toolbar.cardtext.listCardtext as any,
  )
  const currentListOptions =
    currentListIcon && typeof currentListIcon === 'object'
      ? currentListIcon.options
      : undefined
  const toolbarState = buildCardtextToolbarState(value, {
    assetProcessed: assetMatchesApplied,
  })
  toolbarState.listCardtext = {
    state: isListOpen ? 'active' : 'enabled',
    options: currentListOptions,
  }
  yield put(updateToolbarSection({ section: 'cardtext', value: toolbarState }))
  yield put(
    updateToolbarSection({ section: 'cardtextView', value: toolbarState }),
  )
}

export function* syncCardphotoStatus() {
  const cardphotoComplete: boolean = yield select(selectCardphotoIsComplete)

  yield put(
    setSectionComplete({ section: 'cardphoto', isComplete: cardphotoComplete }),
  )
}

function* handleSectionChange() {
  const isCurrentlyReady: boolean = yield select(selectIsCardReady)

  if (isCurrentlyReady) {
    yield put(syncProcessedRequest())
  } else {
    yield put(clearProcessed())
  }
}

function* handleFullCopy(
  action: ReturnType<typeof cardActions.requestFullCopy>,
) {
  const donorId = action.payload
  const donor: Card | undefined = yield select(selectCardById(donorId))

  if (donor) {
    const donorPhoto =
      donor.cardphoto.appliedData ?? donor.cardphoto.assetData ?? null
    if (donorPhoto) {
      yield put(applyFinal(donorPhoto))
    }
    yield put(setValue(donor.cardtext.assetData?.value ?? initialCardtextValue))
    yield put(restoreSender(donor.envelope.sender))
    yield put(restoreRecipient(donor.envelope.recipient))
    yield put(setAroma(donor.aroma))
    yield put(setDate(donor.date))
    yield put(setSelectedDates([]))

    yield put(setPreviewCardId(null))
  }
}

function* handleSectionCopy(action: ReturnType<typeof copySectionToProcessed>) {
  const { donorId, section } = action.payload
  const donor: Card | undefined = yield select(selectCardById(donorId))

  if (donor) {
    switch (section) {
      case 'cardphoto':
        if (donor.cardphoto.appliedData) {
          yield put(applyFinal(donor.cardphoto.appliedData))
        }
        break
      case 'cardtext':
        yield put(
          setValue(donor.cardtext.assetData?.value ?? initialCardtextValue),
        )
        break
      case 'envelope':
        yield put(restoreSender(donor.envelope.sender))
        yield put(restoreRecipient(donor.envelope.recipient))
        break
      case 'aroma':
        yield put(setAroma(donor.aroma))
        break
    }
  }
}

function* handleStatusClearDateForNonDispatch(
  action: ReturnType<typeof cardActions.changeStatus>,
) {
  if (action.payload.newStatus === 'favorite') {
    yield put(clearDate())

    yield put(setSectionComplete({ section: 'date', isComplete: false }))

    // yield put(uiActions.showDraftIncrement());
  }
}

export function* cardEditorSaga() {
  yield fork(syncCardphotoStatus)
  yield fork(syncCardtextStatus)

  yield takeEvery(
    [setDate.type, setSelectedDates.type, hydrateDateFromSession.type],
    syncDateSet,
  )
  yield takeEvery(clearDate.type, syncDateClear)

  yield takeEvery(setAroma.type, syncAromaSet)
  yield takeEvery(clearAroma.type, syncAromaClear)

  yield takeEvery(
    [
      updateSenderField.type,
      updateRecipientField.type,
      setEnabled.type,
      setSenderApplied.type,
      setSenderAppliedIds.type,
      setSenderAppliedWithData.type,
      setSenderAppliedData.type,
      setRecipientApplied.type,
      setRecipientAppliedWithData.type,
      removeAppliedAt.type,
      setRecipientAppliedData.type,
    ],
    syncEnvelopeStatus,
  )
  yield takeEvery(
    [
      clearSender.type,
      clearRecipient.type,
      restoreSender.type,
      restoreRecipient.type,
    ],
    syncEnvelopeClear,
  )

  yield takeEvery(
    setRecipientMode.type,
    function* (action: ReturnType<typeof setRecipientMode>) {
      if (action.payload === 'recipient') {
        yield put(clearRecipientsList())
      }
    },
  )

  yield takeEvery(
    [
      setDate.type,
      setSelectedDates.type,
      setMultiDateMode.type,
      hydrateDateFromSession.type,
      clearDate.type,
      applyFinal.type,
      clearApply.type,
      setValue.type,
      clearText.type,
      setCardtextStatus.type,
      updateRecipientField.type,
      setAroma.type,
      clearAroma.type,
      clearSender.type,
      clearRecipient.type,
    ],
    handleSectionChange,
  )

  yield takeEvery(changeStatus.type, handleStatusClearDateForNonDispatch)
  yield takeEvery(cardActions.requestFullCopy.type, handleFullCopy)
  yield takeEvery(copySectionToProcessed.type, handleSectionCopy)

  yield takeEvery(syncProcessedRequest.type, checkAndSyncProcessedCard)

  const cardtextToolbarRelated = [
    setValue.type,
    setCardtextStatus.type,
    setTextStyle.type,
    setAlign.type,
    setFontSizeStep.type,
    restoreCardtextSession.type,
    restoreCardtextEditorSession.type,
    setCardtextAppliedData.type,
  ] as const
  yield takeEvery([...cardtextToolbarRelated], syncCardtextStatus)
  yield takeEvery([...cardtextToolbarRelated], syncCardtextToolbar)
  yield takeEvery(clearText.type, syncCardtextReset)

  yield takeEvery(
    [
      applyFinal.type,
      clearApply.type,
      reset.type,
      resetCropLayers.type,
      hydrateEditor.type,
      restoreSession.type,
    ],
    syncCardphotoStatus,
  )
}
