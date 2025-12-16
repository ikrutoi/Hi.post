import { all, fork } from 'redux-saga/effects'
import {
  cardEditorSaga,
  envelopeSaga,
  cardtextSaga,
  envelopeToolbarSaga,
} from '../middleware'

export function* rootSaga() {
  yield all([
    fork(cardEditorSaga),
    fork(envelopeSaga),
    fork(cardtextSaga),
    fork(envelopeToolbarSaga),
  ])
}
