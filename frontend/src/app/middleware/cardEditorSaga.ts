import { takeEvery, put, select } from 'redux-saga/effects'
import {
  setSectionComplete,
  clearSection,
} from '@entities/cardEditor/infrastructure/state'
import { setDate, clearDate } from '@date/infrastructure/state'
import { setAroma, clearAroma } from '@aroma/infrastructure/state'
import {
  recomputeEnvelope,
  clearEnvelope,
} from '@envelope/infrastructure/state'
import { selectIsDateComplete } from '@date/infrastructure/selectors'
import { selectIsAromaComplete } from '@aroma/infrastructure/selectors'
import { selectIsEnvelopeComplete } from '@envelope/infrastructure/selectors'

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

function* syncEnvelopeRecompute() {
  const envelopeComplete: boolean = yield select(selectIsEnvelopeComplete)
  yield put(
    setSectionComplete({ section: 'envelope', isComplete: envelopeComplete })
  )
}

function* syncEnvelopeClear() {
  yield put(clearSection('envelope'))
}

export function* cardEditorSaga() {
  yield takeEvery(setDate.type, syncDateSet)
  yield takeEvery(clearDate.type, syncDateClear)

  yield takeEvery(setAroma.type, syncAromaSet)
  yield takeEvery(clearAroma.type, syncAromaClear)

  yield takeEvery(recomputeEnvelope.type, syncEnvelopeRecompute)
  yield takeEvery(clearEnvelope.type, syncEnvelopeClear)
}
