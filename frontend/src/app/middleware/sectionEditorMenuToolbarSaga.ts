import { takeEvery, put, call, select } from 'redux-saga/effects'
import type { PayloadAction } from '@reduxjs/toolkit'
import { toolbarAction } from '@toolbar/application/helpers'
import { setActiveSection } from '@entities/sectionEditorMenu/infrastructure/state'
import type { SectionEditorMenuKey } from '@toolbar/domain/types'
import { selectCartListPanelOpen } from '@cart/infrastructure/selectors'
import { setCartListPanelOpen } from '@cart/infrastructure/state'
import { setHistoryListPanelOpen } from '@date/calendar/infrastructure/state'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
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
    /**
     * Явный выбор «Дата» в меню: закрыть правую корзину, иначе фабрика остаётся на
     * `activeSection === 'date'`, а календарь — в режиме корзины (`cartListPanelOpen`).
     */
    if (key === 'date') {
      const cartOpen: boolean = yield select(selectCartListPanelOpen)
      if (cartOpen) {
        yield put(setCartListPanelOpen(false))
        yield put(
          updateToolbarIcon({
            section: 'rightSidebar',
            key: 'cart',
            value: 'enabled',
          }),
        )
      }
    }
    yield put(setActiveSection(key))
  }
}

function* handleSectionEditorMenuActiveSectionChange(
  action: PayloadAction<SectionEditorMenuKey>,
) {
  const activeKey = action.payload
  const cartOpen: boolean = yield select(selectCartListPanelOpen)

  if (activeKey === 'history') {
    yield put(setHistoryListPanelOpen(true))
    yield put(
      updateToolbarIcon({
        section: 'history',
        key: 'listHistory',
        value: 'active',
      }),
    )
  }

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
