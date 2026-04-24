import { takeEvery, put, call } from 'redux-saga/effects'
import type { PayloadAction } from '@reduxjs/toolkit'
import { toolbarAction } from '@toolbar/application/helpers'
import { setActiveSection } from '@entities/sectionEditorMenu/infrastructure/state'
import type { SectionEditorMenuKey } from '@toolbar/domain/types'
import {
  syncSectionMenuVisuals,
  syncRightSidebarHistoryHighlight,
} from './sectionEditorMenuHandlers'

export function* handleSectionEditorMenuToolbarAction(
  action: PayloadAction<{ section: string; key: SectionEditorMenuKey }>,
) {
  const { section, key } = action.payload

  if (section === 'sectionEditorMenu') {
    yield put(setActiveSection(key))
  }
}

function* handleSectionEditorMenuActiveSectionChange(
  action: PayloadAction<SectionEditorMenuKey>,
) {
  yield call(syncSectionMenuVisuals, action.payload)
  yield call(syncRightSidebarHistoryHighlight, action.payload)
}

export function* sectionEditorMenuSaga() {
  yield takeEvery(toolbarAction.type, handleSectionEditorMenuToolbarAction)
  yield takeEvery(
    setActiveSection.type,
    handleSectionEditorMenuActiveSectionChange,
  )
}
