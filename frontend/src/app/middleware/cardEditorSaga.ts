import { takeEvery, put, select } from 'redux-saga/effects'
import {
  setSectionComplete,
  clearSection,
} from '@entities/cardEditor/infrastructure/state'
import { setDate, clearDate } from '@date/infrastructure/state'
import { setAroma, clear as clearAroma } from '@aroma/infrastructure/state'
import {
  updateRecipientField,
  restoreRecipient,
  clearRecipient,
} from '@envelope/recipient/infrastructure/state'
import {
  updateSenderField,
  setEnabled,
  restoreSender,
  clearSender,
} from '@envelope/sender/infrastructure/state'
import { selectIsEnvelopeReady } from '@envelope/infrastructure/selectors'
import { selectIsDateComplete } from '@date/infrastructure/selectors'
import { selectIsAromaComplete } from '@aroma/infrastructure/selectors'
import {
  setValue,
  clear as clearCardtext,
} from '@cardtext/infrastructure/state'
import { selectCardtextIsComplete } from '@cardtext/infrastructure/selectors'
import { updateToolbarSection } from '@toolbar/infrastructure/state'
import { applyFinal } from '@cardphoto/infrastructure/state'
import { selectCardphotoIsComplete } from '@cardphoto/infrastructure/selectors'
import { buildCardtextToolbarState } from '@cardtext/domain/helpers'

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

function* syncCardtextToolbar(action: ReturnType<typeof setValue>) {
  const toolbarState = buildCardtextToolbarState(action.payload)
  yield put(updateToolbarSection({ section: 'cardtext', value: toolbarState }))
}

export function* syncCardphotoStatus() {
  const cardphotoComplete: boolean = yield select(selectCardphotoIsComplete)

  yield put(
    setSectionComplete({ section: 'cardphoto', isComplete: cardphotoComplete }),
  )
}

export function* cardEditorSaga() {
  yield takeEvery(setDate.type, syncDateSet)
  yield takeEvery(clearDate.type, syncDateClear)

  yield takeEvery(setAroma.type, syncAromaSet)
  yield takeEvery(clearAroma.type, syncAromaClear)

  yield takeEvery(
    [updateSenderField.type, updateRecipientField.type, setEnabled.type],
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

  yield takeEvery(setValue.type, syncCardtextStatus)
  // yield takeEvery(setValue.type, syncCardtextToolbar)
  yield takeEvery(clearCardtext.type, syncCardtextReset)

  yield takeEvery(applyFinal.type, syncCardphotoStatus)
  // yield takeEvery(clearCardtext.type, syncCardtextReset)
}
