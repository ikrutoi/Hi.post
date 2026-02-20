import { all, fork } from 'redux-saga/effects'
import {
  cardEditorSaga,
  editorPieProcessSaga,
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
  addressSaveSaga,
} from '../middleware'

export function* rootSaga() {
  yield fork(hydrateAppSession)

  yield all([
    fork(watchSessionChanges),
    fork(cardEditorSaga),
    fork(editorPieProcessSaga),

    // fork(envelopeSaga),

    fork(envelopeToolbarSaga),
    fork(envelopeProcessSaga),
    fork(addressSaveSaga),
    fork(cardtextProcessSaga),
    // fork(cardphotoToolbarSaga),
    // fork(cardphotoHistorySaga),
    fork(cardphotoProcessSaga),
    fork(sectionEditorMenuSaga),
  ])
}
