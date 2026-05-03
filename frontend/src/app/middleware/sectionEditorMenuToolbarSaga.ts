import { takeEvery, put, call, select } from 'redux-saga/effects'
import type { PayloadAction } from '@reduxjs/toolkit'
import { toolbarAction } from '@toolbar/application/helpers'
import { setActiveSection } from '@entities/sectionEditorMenu/infrastructure/state'
import type { SectionEditorMenuKey } from '@toolbar/domain/types'
import { selectCartListPanelOpen } from '@cart/infrastructure/selectors'
import {
  syncSectionMenuVisuals,
  syncSectionMenuVisualsAllEnabled,
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
  const activeKey = action.payload
  const cartOpen: boolean = yield select(selectCartListPanelOpen)

  if (activeKey === 'date' && cartOpen) {
    yield call(syncSectionMenuVisualsAllEnabled)
  } else {
    yield call(syncSectionMenuVisuals, activeKey)
  }
  yield call(syncRightSidebarHistoryHighlight, activeKey)
}

export function* sectionEditorMenuSaga() {
  yield takeEvery(toolbarAction.type, handleSectionEditorMenuToolbarAction)
  yield takeEvery(
    setActiveSection.type,
    handleSectionEditorMenuActiveSectionChange,
  )
}
