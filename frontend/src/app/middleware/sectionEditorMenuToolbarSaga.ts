import { takeEvery, put, call, select } from 'redux-saga/effects'
import type { PayloadAction } from '@reduxjs/toolkit'
import { toolbarAction } from '@toolbar/application/helpers'
import { setActiveSection } from '@entities/sectionEditorMenu/infrastructure/state'
import type { SectionEditorMenuKey } from '@toolbar/domain/types'
import {
  selectCardPieCopyStripExpanded,
  selectCartListPanelOpen,
} from '@cart/infrastructure/selectors'
import { setCartListPanelOpen } from '@cart/infrastructure/state'
import {
  setHistoryListPanelOpen,
  setNotebookStripTab,
} from '@date/calendar/infrastructure/state'
import { selectNotebookStripTab } from '@date/calendar/infrastructure/selectors'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import {
  syncSectionMenuVisuals,
  syncSectionMenuVisualsAllEnabled,
  syncRightSidebarHistoryHighlight,
} from './sectionEditorMenuHandlers'

import type { SagaIterator } from 'redux-saga'

function* applySectionEditorMenuToolbarVisuals(): SagaIterator {
  const activeKey = yield select(selectActiveSection)
  if (activeKey == null) return

  const notebookStripTab = yield select(selectNotebookStripTab)
  const cardPieCopyStripExpanded: boolean = yield select(
    selectCardPieCopyStripExpanded,
  )

  if (cardPieCopyStripExpanded) {
    yield call(syncSectionMenuVisualsAllEnabled)
  } else if (activeKey === 'date' && notebookStripTab === 'cart') {
    /** Режим полосы «Корзина»: календарь корзины при `activeSection === 'date'` — пункт «Дата» в меню без active. */
    yield call(syncSectionMenuVisualsAllEnabled)
  } else {
    yield call(syncSectionMenuVisuals, activeKey)
  }
}

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
): SagaIterator {
  const activeKey = action.payload

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

  yield call(applySectionEditorMenuToolbarVisuals)
  yield call(syncRightSidebarHistoryHighlight, activeKey)
}

function* syncSectionMenuOnNotebookStripTabChange(): SagaIterator {
  yield call(applySectionEditorMenuToolbarVisuals)
  const activeKey = yield select(selectActiveSection)
  if (activeKey != null) {
    yield call(syncRightSidebarHistoryHighlight, activeKey)
  }
}

export function* sectionEditorMenuSaga() {
  yield takeEvery(toolbarAction.type, handleSectionEditorMenuToolbarAction)
  yield takeEvery(
    setActiveSection.type,
    handleSectionEditorMenuActiveSectionChange,
  )
  yield takeEvery(
    setNotebookStripTab.type,
    syncSectionMenuOnNotebookStripTabChange,
  )
}
