import { SagaIterator } from 'redux-saga'
import { all, call, takeLatest } from 'redux-saga/effects'
import { handleEditorPieToolbarAction } from './editorPieToolbarSaga'
import { toolbarAction } from '@/features/toolbar/application/helpers'

export function* editorPieProcessSaga(): SagaIterator {
  yield all([
    takeLatest(toolbarAction.type, handleEditorPieToolbarAction),

    // fork(watchFontSizeChanges),
    // fork(watchCardphotoOrientation),
  ])
}
