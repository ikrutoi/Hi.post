import { all, fork } from 'redux-saga/effects'
import {
  cardEditorSaga,
  editorPieProcessSaga,
  envelopeToolbarSaga,
  envelopeProcessSaga,
  addressBookSyncSaga,
  cardtextProcessSaga,
  sectionEditorMenuSaga,
  cardphotoProcessSaga,
  hydrateAppSession,
  watchSessionChanges,
  addressSaveSaga,
  cardPanelToolbarSaga,
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
    fork(addressBookSyncSaga),
    fork(addressSaveSaga),
    fork(cardtextProcessSaga),
    // fork(cardphotoToolbarSaga),
    // fork(cardphotoHistorySaga),
    fork(cardphotoProcessSaga),
    fork(sectionEditorMenuSaga),
    fork(cardPanelToolbarSaga),
  ])
}
