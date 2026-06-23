import { SagaIterator } from 'redux-saga'
import { PayloadAction } from '@reduxjs/toolkit'
import { call } from 'redux-saga/effects'
import { EditorPieKey, ToolbarSection } from '@/features/toolbar/domain/types'
import { clearCardPieWorkspaceAfterCartAdd } from './editorPieHandlers'
import { toggleCardPieListPanelFromToolbar } from './cardPieToolbarSync'

export function* handleEditorPieToolbarAction(
  action: PayloadAction<{ section: ToolbarSection; key: EditorPieKey }>,
): SagaIterator {
  const { section, key } = action.payload
  if (section !== 'editorPie') return
  switch (key) {
    case 'cardPie': {
      yield call(toggleCardPieListPanelFromToolbar)
      break
    }
    case 'delete': {
      yield call(clearCardPieWorkspaceAfterCartAdd)
      break
    }
  }
}
