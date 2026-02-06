import { takeEvery, put, select } from 'redux-saga/effects'
import {
  setSectionComplete,
  clearSection,
} from '@entities/cardEditor/infrastructure/state'
import { setDate, clearDate } from '@date/infrastructure/state'
import { setAroma, clear as clearAroma } from '@aroma/infrastructure/state'
import {
  updateRecipientField,
  clearRecipient,
} from '@envelope/recipient/infrastructure/state'
import {
  updateSenderField,
  setEnabled,
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

function* syncEnvelopeStatus() {
  const isReady: boolean = yield select(selectIsEnvelopeReady)

  yield put(setSectionComplete({ section: 'envelope', isComplete: isReady }))
}

function* syncEnvelopeClear() {
  yield put(setSectionComplete({ section: 'envelope', isComplete: false }))
  yield put(clearSection('envelope'))
}

function* syncCardtextSet() {
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

export function* cardEditorSaga() {
  yield takeEvery(setDate.type, syncDateSet)
  yield takeEvery(clearDate.type, syncDateClear)

  yield takeEvery(setAroma.type, syncAromaSet)
  yield takeEvery(clearAroma.type, syncAromaClear)

  yield takeEvery(
    [updateSenderField.type, updateRecipientField.type, setEnabled.type],
    syncEnvelopeStatus,
  )
  yield takeEvery([clearSender.type, clearRecipient.type], syncEnvelopeClear)

  yield takeEvery(setValue.type, syncCardtextSet)
  // yield takeEvery(setValue.type, syncCardtextToolbar)
  yield takeEvery(clearCardtext.type, syncCardtextReset)
}
