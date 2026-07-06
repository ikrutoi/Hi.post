import { takeEvery, put, select, call } from 'redux-saga/effects'
import type { PayloadAction } from '@reduxjs/toolkit'
import { toolbarAction } from '@toolbar/application/helpers'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import { setCartListPanelOpen } from '@cart/infrastructure/state'
import { selectCartListPanelOpen } from '@cart/infrastructure/selectors'
import { setHistoryListPanelOpen } from '@date/calendar/infrastructure/state'
import {
  selectIsHistoryListPanelOpen,
  selectNotebookStripTab,
} from '@date/calendar/infrastructure/selectors'
import {
  buildCartArchiveToggleCommands,
  buildHistoryArchiveToggleCommands,
} from '@date/calendar/application/orchestration/notebookOrchestration.rules'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import { setUserLoginPanelOpen } from '@features/auth/infrastructure/state/auth.slice'
import { selectUserLoginPanelOpen } from '@features/auth/infrastructure/selectors/authSelectors'
import {
  syncSectionMenuVisualsAllEnabled,
} from './sectionEditorMenuHandlers'
import {
  RIGHT_SIDEBAR_KEYS,
  type RightSidebarKey,
} from '@/features/toolbar/domain/types/rightSidebar.types'

function* syncRightSidebarVisuals(clickedKey: RightSidebarKey) {
  const section = 'rightSidebar'
  for (const iconKey of RIGHT_SIDEBAR_KEYS) {
    yield put(
      updateToolbarIcon({
        section,
        key: iconKey,
        value: iconKey === clickedKey ? 'active' : 'enabled',
      }),
    )
  }
}

function* dispatchCommands(
  commands: ReturnType<typeof buildCartArchiveToggleCommands>,
) {
  for (const command of commands) {
    yield put(command)
  }
}

export function* handleRightSidebarToolbarAction(
  action: PayloadAction<{ section: string; key: RightSidebarKey }>,
) {
  const { section, key } = action.payload

  if (section !== 'rightSidebar') return

  if (key === 'userLogin') {
    const isOpen: boolean = yield select(selectUserLoginPanelOpen)
    const nextOpen = !isOpen
    yield put(setUserLoginPanelOpen(nextOpen))
    if (nextOpen) {
      yield put(setCartListPanelOpen(false))
      yield put(setHistoryListPanelOpen(false))
    }
    yield put(
      updateToolbarIcon({
        section: 'rightSidebar',
        key: 'userLogin',
        value: nextOpen ? 'active' : 'enabled',
      }),
    )
    if (nextOpen) {
      for (const iconKey of RIGHT_SIDEBAR_KEYS) {
        if (iconKey === 'userLogin') continue
        yield put(
          updateToolbarIcon({
            section: 'rightSidebar',
            key: iconKey,
            value: 'enabled',
          }),
        )
      }
    }
    return
  }

  if (key === 'cart') {
    const cartListPanelOpen: boolean = yield select(selectCartListPanelOpen)
    const notebookStripTab = yield select(selectNotebookStripTab)
    yield put(setUserLoginPanelOpen(false))
    yield* dispatchCommands(
      buildCartArchiveToggleCommands({
        cartListPanelOpen,
        notebookStripTab,
        isMobileLayout: false,
      }),
    )
    yield call(syncSectionMenuVisualsAllEnabled)
    yield put(
      updateToolbarIcon({
        section: 'rightSidebar',
        key: 'cart',
        value: 'active',
      }),
    )
    for (const iconKey of RIGHT_SIDEBAR_KEYS) {
      if (iconKey === 'cart') continue
      yield put(
        updateToolbarIcon({
          section: 'rightSidebar',
          key: iconKey,
          value: 'enabled',
        }),
      )
    }
    return
  }

  if (key === 'history') {
    const historyListPanelOpen: boolean = yield select(selectIsHistoryListPanelOpen)
    const notebookStripTab = yield select(selectNotebookStripTab)
    const activeSection = yield select(selectActiveSection)
    yield put(setUserLoginPanelOpen(false))
    yield* dispatchCommands(
      buildHistoryArchiveToggleCommands({
        historyListPanelOpen,
        notebookStripTab,
        activeSection,
        isMobileLayout: false,
      }),
    )
    yield* syncRightSidebarVisuals('history')
    return
  }

  yield* syncRightSidebarVisuals(key)
}

export function* rightSidebarToolbarSaga() {
  yield takeEvery(toolbarAction.type, handleRightSidebarToolbarAction)
}
