// cardEditorSaga.ts
import { takeEvery, put } from 'redux-saga/effects'
import {
  setSectionComplete,
  clearSection,
} from '@entities/cardEditor/infrastructure/state'

import { setDate, clearDate } from '@date/infrastructure/state'
import { setAroma, clearAroma } from '@aroma/infrastructure/state'
import { setEnvelope, clearEnvelope } from '@envelope/infrastructure/state'

function* syncDateSet() {
  yield put(setSectionComplete({ section: 'date', isComplete: true }))
}

function* syncDateClear() {
  yield put(clearSection('date'))
}

function* syncAromaSet() {
  yield put(setSectionComplete({ section: 'aroma', isComplete: true }))
}

function* syncAromaClear() {
  yield put(clearSection('aroma'))
}

function* syncEnvelopeSet() {
  yield put(setSectionComplete({ section: 'envelope', isComplete: true }))
}

function* syncEnvelopeClear() {
  yield put(clearSection('envelope'))
}

export function* cardEditorSaga() {
  yield takeEvery(setDate.type, syncDateSet)
  yield takeEvery(clearDate.type, syncDateClear)

  yield takeEvery(setAroma.type, syncAromaSet)
  yield takeEvery(clearAroma.type, syncAromaClear)

  yield takeEvery(setEnvelope.type, syncEnvelopeSet)
  yield takeEvery(clearEnvelope.type, syncEnvelopeClear)
}
