import { all, fork } from 'redux-saga/effects'
import {
  cardEditorSaga,
  envelopeSaga,
  envelopeToolbarSaga,
  cardtextToolbarSaga,
} from '../middleware'

export function* rootSaga() {
  yield all([
    fork(cardEditorSaga),
    fork(envelopeSaga),
    fork(envelopeToolbarSaga),
    fork(cardtextToolbarSaga),
  ])
}
