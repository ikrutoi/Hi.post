import { SagaIterator } from 'redux-saga'
import { PayloadAction } from '@reduxjs/toolkit'
import { call } from 'redux-saga/effects'
import { toolbarAction } from '@toolbar/application/helpers'
import {
  handleAddDraftsAction,
  handleClearAllMiniSectionsAction,
} from './editorPieHandlers'
import { EditorPieKey, ToolbarSection } from '@/features/toolbar/domain/types'

export function* handleEditorPieToolbarAction(
  action: PayloadAction<{ section: ToolbarSection; key: EditorPieKey }>,
) {
  const { section, key } = action.payload
  // const { section, key, payload: editor } = action.payload
  if (section !== 'editorPie') return
  switch (key) {
    case 'addDrafts':
      yield call(handleAddDraftsAction)
      break

    case 'close':
      yield call(handleClearAllMiniSectionsAction)
      break
  }
}
