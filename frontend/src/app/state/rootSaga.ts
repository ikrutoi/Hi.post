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
  cardCalendarPreviewSaga,
  hydrateAppSession,
  watchSessionChanges,
  addressSaveSaga,
  cardPanelToolbarSaga,
  watchDateToolbar,
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
    fork(cardCalendarPreviewSaga),
    fork(sectionEditorMenuSaga),
    fork(cardPanelToolbarSaga),
    fork(watchDateToolbar),
  ])
}
