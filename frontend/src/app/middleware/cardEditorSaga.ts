import { takeEvery, put, select, call, fork } from 'redux-saga/effects'
import {
  setSectionComplete,
  clearSection,
} from '@entities/cardEditor/infrastructure/state'
import { setDate, clearDate } from '@date/infrastructure/state'
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
import {
  selectEnvelopeSessionRecord,
  selectIsEnvelopeReady,
} from '@envelope/infrastructure/selectors'
import { setRecipientMode } from '@envelope/recipient/infrastructure/state'
import { clearRecipientsList } from '@envelope/infrastructure/state'
import {
  selectIsDateComplete,
  selectSelectedDate,
} from '@date/infrastructure/selectors'
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
} from '@cardtext/infrastructure/state'
import {
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
  setProcessedCard,
  syncProcessedRequest,
} from '@entities/card/infrastructure/state'
import type { DispatchDate } from '@entities/date'
import type { CardphotoState } from '@cardphoto/domain/types'
import type { CardtextState } from '@cardtext/domain/types'
import { initialCardtextValue } from '@cardtext/domain/types'
import type { EnvelopeSessionRecord } from '@envelope/domain/types'
import type { Card } from '@entities/card/domain/types'
import type { AromaItem, AromaState } from '@entities/aroma'

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

function* syncCardtextToolbar() {
  const value: ReturnType<typeof selectCardtextValue> =
    yield select(selectCardtextValue)
  const assetProcessed: boolean = yield select(selectCardtextIsComplete)
  const toolbarState = buildCardtextToolbarState(value, {
    assetProcessed,
  })
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

function* checkAndSyncProcessedCard() {
  const cardphoto: CardphotoState = yield select(selectCardphotoState)
  const cardtext: CardtextState = yield select(selectCardtextState)
  const envelope: EnvelopeSessionRecord = yield select(
    selectEnvelopeSessionRecord,
  )
  const calendarDate: DispatchDate = yield select(selectSelectedDate)
  const aroma: AromaItem = yield select(selectSelectedAroma)

  console.log('CHECK_AND_SYNC_PROCESSED photo', cardphoto)

  const appliedPhoto = cardphoto.appliedData
  if (!appliedPhoto) return

  const processedCard: Card = {
    id: appliedPhoto.id,
    status: 'processed',
    thumbnailUrl: appliedPhoto.thumbnail?.url || '',
    cardphoto,
    cardtext,
    envelope,
    aroma,
    date: calendarDate,
    meta: {
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  }

  console.log('CHECK_AND_SYNC_PROCESSED processedCard', processedCard)
  yield put(setProcessedCard(processedCard))
}

function* handleFullCopy(
  action: ReturnType<typeof cardActions.requestFullCopy>,
) {
  const donorId = action.payload
  const donor: Card | undefined = yield select(selectCardById(donorId))

  if (donor) {
    yield put(applyFinal(donor.cardphoto))
    yield put(
      setValue(donor.cardtext.assetData?.value ?? initialCardtextValue),
    )
    yield put(restoreSender(donor.envelope.sender))
    yield put(restoreRecipient(donor.envelope.recipient))
    yield put(setAroma(donor.aroma))
    yield put(setDate(donor.date))

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

function* handleStatusToDrafts(
  action: ReturnType<typeof cardActions.changeStatus>,
) {
  if (action.payload.newStatus === 'drafts') {
    yield put(clearDate())

    yield put(setSectionComplete({ section: 'date', isComplete: false }))

    // yield put(uiActions.showDraftIncrement());
  }
}

export function* cardEditorSaga() {
  yield fork(syncCardphotoStatus)
  yield fork(syncCardtextStatus)

  yield takeEvery(setDate.type, syncDateSet)
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

  yield takeEvery(setRecipientMode.type, function* (
    action: ReturnType<typeof setRecipientMode>,
  ) {
    if (action.payload === 'recipient') {
      yield put(clearRecipientsList())
    }
  })

  yield takeEvery(
    [
      setDate.type,
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

  yield takeEvery(changeStatus.type, handleStatusToDrafts)
  yield takeEvery(cardActions.requestFullCopy.type, handleFullCopy)
  yield takeEvery(copySectionToProcessed.type, handleSectionCopy)

  yield takeEvery(syncProcessedRequest.type, checkAndSyncProcessedCard)

  const cardtextToolbarRelated = [
    setValue.type,
    setCardtextStatus.type,
    setTextStyle.type,
    setAlign.type,
    setFontSizeStep.type,
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
