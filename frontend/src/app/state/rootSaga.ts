import { all, fork } from 'redux-saga/effects'
import {
  cardEditorSaga,
  // envelopeSaga,
  envelopeToolbarSaga,
  envelopeProcessSaga,
  cardtextProcessSaga,
  // cardtextToolbarSaga,
  sectionEditorMenuSaga,
  // cardphotoToolbarSaga,
  cardphotoProcessSaga,
  cardphotoHistorySaga,
  hydrateAppSession,
  watchSessionChanges,
} from '../middleware'

export function* rootSaga() {
  yield fork(hydrateAppSession)

  yield all([
    fork(watchSessionChanges),

    fork(cardEditorSaga),
    // fork(envelopeSaga),
    fork(envelopeToolbarSaga),
    fork(envelopeProcessSaga),
    fork(cardtextProcessSaga),
    // fork(cardphotoToolbarSaga),
    fork(cardphotoHistorySaga),
    fork(cardphotoProcessSaga),
    fork(sectionEditorMenuSaga),
  ])
}
