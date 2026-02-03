import { all, fork } from 'redux-saga/effects'
import {
  cardEditorSaga,
  envelopeSaga,
  envelopeToolbarSaga,
  cardtextProcessSaga,
  // cardtextToolbarSaga,
  sectionEditorMenuSaga,
  // cardphotoToolbarSaga,
  cardphotoProcessSaga,
  cardphotoHistorySaga,
} from '../middleware'

export function* rootSaga() {
  yield all([
    fork(cardEditorSaga),
    fork(envelopeSaga),
    fork(envelopeToolbarSaga),
    fork(cardtextProcessSaga),
    // fork(cardphotoToolbarSaga),
    fork(cardphotoHistorySaga),
    fork(cardphotoProcessSaga),
    fork(sectionEditorMenuSaga),
  ])
}
