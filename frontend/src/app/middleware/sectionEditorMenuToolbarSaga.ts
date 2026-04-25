import { takeEvery, put, call, select } from 'redux-saga/effects'
import type { PayloadAction } from '@reduxjs/toolkit'
import { toolbarAction } from '@toolbar/application/helpers'
import { setActiveSection } from '@entities/sectionEditorMenu/infrastructure/state'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import { setCardPieFavoriteListPanelOpen } from '@date/calendar/infrastructure/state'
import { selectIsCardPieFavoriteListPanelOpen } from '@date/calendar/infrastructure/selectors'
import type { SectionEditorMenuKey } from '@toolbar/domain/types'
import {
  syncSectionMenuVisuals,
  syncRightSidebarHistoryHighlight,
} from './sectionEditorMenuHandlers'

export function* handleSectionEditorMenuToolbarAction(
  action: PayloadAction<{ section: string; key: SectionEditorMenuKey }>,
) {
  const { section, key } = action.payload

  if (section !== 'sectionEditorMenu') return

  if (key === 'cardPieFavorite') {
    const isOpen: boolean = yield select(selectIsCardPieFavoriteListPanelOpen)
    const nextOpen = !isOpen
    yield put(setCardPieFavoriteListPanelOpen(nextOpen))
    yield put(
      updateToolbarIcon({
        section: 'sectionEditorMenu',
        key: 'cardPieFavorite',
        value: nextOpen ? 'active' : 'enabled',
      }),
    )
    return
  }

  yield put(setActiveSection(key))
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
