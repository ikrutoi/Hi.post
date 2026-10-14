import { store, type AppDispatch } from '@app/state/store'
import { setCartListPanelOpen } from '@cart/infrastructure/state'
import { isCartOwnedNotebookStrip } from '@date/calendar/application/logic/calendarStripSection'
import { buildRememberMobileCartSurfaceCommands } from '@date/calendar/application/orchestration/notebookOrchestration.rules'
import {
  selectIsHistoryListPanelOpen,
  selectNotebookStripTab,
} from '@date/calendar/infrastructure/selectors'
import {
  setHistoryListPanelOpen,
  setHistoryMobileReturn,
  setNotebookStripDateOverCart,
  setNotebookStripDateOverHistory,
  setNotebookStripTab,
} from '@date/calendar/infrastructure/state'
import type { DateStripSection } from '@date/presentation/dateStripSection.types'
import { setActiveSection } from '@entities/sectionEditorMenu/infrastructure/state'
import { selectIsMobileLayout } from '@layout/infrastructure/selectors'

export function isCartOrHistoryArchiveActive(input: {
  cartListPanelOpen: boolean
  historyListPanelOpen: boolean
  notebookStripTab: DateStripSection
}): boolean {
  return (
    input.cartListPanelOpen ||
    input.historyListPanelOpen ||
    isCartOwnedNotebookStrip(input.notebookStripTab) ||
    input.notebookStripTab === 'history'
  )
}

/** Close cart/history chrome and show the date factory. */
export function revealFactoryFromCartOrHistory(
  dispatch: AppDispatch,
  input: {
    cartListPanelOpen: boolean
    historyListPanelOpen: boolean
    notebookStripTab: DateStripSection
  },
): void {
  const state = store.getState()
  if (selectIsMobileLayout(state)) {
    const historyListOpen = selectIsHistoryListPanelOpen(state)
    const strip = selectNotebookStripTab(state)
    if (historyListOpen || strip === 'history') {
      dispatch(
        setHistoryMobileReturn({
          view: historyListOpen ? 'list' : 'calendar',
        }),
      )
    }
  }
  for (const command of buildRememberMobileCartSurfaceCommands(state)) {
    dispatch(command)
  }

  if (input.cartListPanelOpen) {
    dispatch(setCartListPanelOpen(false))
  }
  if (input.historyListPanelOpen) {
    dispatch(setHistoryListPanelOpen(false))
  }
  if (
    isCartOwnedNotebookStrip(input.notebookStripTab) ||
    input.notebookStripTab === 'history'
  ) {
    if (isCartOwnedNotebookStrip(input.notebookStripTab)) {
      dispatch(setNotebookStripDateOverCart(true))
    }
    if (input.notebookStripTab === 'history') {
      dispatch(setNotebookStripDateOverHistory(true))
    }
    dispatch(setNotebookStripTab('date'))
    dispatch(setActiveSection('date'))
  }
}
