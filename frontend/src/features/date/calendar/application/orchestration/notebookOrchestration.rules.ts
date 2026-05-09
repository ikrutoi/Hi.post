import type { UnknownAction } from '@reduxjs/toolkit'
import {
  setCartListPanelOpen,
  setCartListSelectedLocalId,
  setCartListStatusSegment,
} from '@cart/infrastructure/state'
import { setActiveSection } from '@entities/sectionEditorMenu/infrastructure/state/sectionEditorMenuSlice'
import {
  closeDayPanel,
  setCardPieListPanelOpen,
  setCartCalendarDatePickMode,
  setHistoryListSelectedLocalId,
  setHistoryListPanelOpen,
  setNotebookStripDateOverCart,
  setNotebookStripTab,
} from '@date/calendar/infrastructure/state'
import type { DateStripSection } from '@date/presentation/dateStripSection.types'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'

export const buildNotebookDateTabCommands = (): UnknownAction[] => [
  setNotebookStripDateOverCart(true),
  setCartListSelectedLocalId(null),
  setHistoryListSelectedLocalId(null),
  closeDayPanel(),
  setCartCalendarDatePickMode(false),
  setNotebookStripTab('date'),
  setCardPieListPanelOpen(true),
  setActiveSection('date'),
]

export const buildNotebookCartTabCommands = (): UnknownAction[] => [
  setHistoryListPanelOpen(false),
  closeDayPanel(),
  updateToolbarIcon({
    section: 'history',
    key: 'listHistory',
    value: 'enabled',
  }),
  setCartListPanelOpen(true),
  updateToolbarIcon({
    section: 'rightSidebar',
    key: 'cart',
    value: 'active',
  }),
  setCartCalendarDatePickMode(false),
  setCartListStatusSegment('cart'),
  setNotebookStripTab('cart'),
  setActiveSection('date'),
]

export const buildNotebookHistoryTabCommands = (): UnknownAction[] => [
  setCartListPanelOpen(false),
  updateToolbarIcon({
    section: 'rightSidebar',
    key: 'cart',
    value: 'enabled',
  }),
  setNotebookStripTab('history'),
  setActiveSection('history'),
]

export const buildNotebookSessionRestoreCommands = (
  tab: DateStripSection | null,
): UnknownAction[] => {
  if (tab === 'cart') {
    return [
      setCartListPanelOpen(true),
      setHistoryListPanelOpen(false),
      setActiveSection('date'),
      setCartCalendarDatePickMode(false),
      setCartListStatusSegment('cart'),
    ]
  }
  if (tab === 'history') {
    return [
      setCartListPanelOpen(false),
      setHistoryListPanelOpen(true),
      setActiveSection('history'),
    ]
  }
  return []
}
