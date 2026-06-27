import { SagaIterator } from 'redux-saga'
import { PayloadAction } from '@reduxjs/toolkit'
import { call, put } from 'redux-saga/effects'
import { EditorPieKey, ToolbarSection } from '@/features/toolbar/domain/types'
import { addEditorPiePlanToCart } from '@date/infrastructure/state'
import { clearCardPieWorkspaceAfterCartAdd } from './editorPieHandlers'
import { toggleCardPieListPanelFromToolbar } from './cardPieToolbarSync'
import type { IconKey } from '@shared/config/constants'

export function* handleEditorPieToolbarAction(
  action: PayloadAction<{ section: ToolbarSection; key: EditorPieKey | IconKey }>,
): SagaIterator {
  const { section, key } = action.payload
  if (section !== 'editorPie') return
  switch (key) {
    case 'cardPie': {
      yield call(toggleCardPieListPanelFromToolbar)
      break
    }
    case 'addCart': {
      yield put(addEditorPiePlanToCart({}))
      break
    }
    case 'delete': {
      yield call(clearCardPieWorkspaceAfterCartAdd)
      break
    }
  }
}
