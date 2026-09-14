import type { AppDispatch } from '@app/state/store'
import { setCartListPanelOpen } from '@cart/infrastructure/state'
import { isCartOwnedNotebookStrip } from '@date/calendar/application/logic/calendarStripSection'
import {
  setHistoryListPanelOpen,
  setNotebookStripDateOverCart,
  setNotebookStripDateOverHistory,
  setNotebookStripTab,
} from '@date/calendar/infrastructure/state'
import type { DateStripSection } from '@date/presentation/dateStripSection.types'
import { setActiveSection } from '@entities/sectionEditorMenu/infrastructure/state'

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
