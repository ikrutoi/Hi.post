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
  setNotebookStripDateOverHistory,
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

/** Mobile header Date tab: календарь в режиме «Дата», без списков. */
export const buildNotebookDateTabCommandsMobile = (): UnknownAction[] => [
  setNotebookStripDateOverCart(true),
  setNotebookStripDateOverHistory(true),
  setCartListSelectedLocalId(null),
  setHistoryListSelectedLocalId(null),
  setCartListPanelOpen(false),
  setHistoryListPanelOpen(false),
  closeDayPanel(),
  setCartCalendarDatePickMode(false),
  setNotebookStripTab('date'),
  setActiveSection('date'),
]

/** Mobile header Cart tab: календарь в режиме «Корзина», без списка. */
export const buildNotebookCartTabCommandsMobile = (): UnknownAction[] => [
  setCartListPanelOpen(false),
  setHistoryListPanelOpen(false),
  closeDayPanel(),
  setCartCalendarDatePickMode(false),
  setNotebookStripTab('cart'),
  setActiveSection('date'),
]

/** Mobile header History tab: календарь в режиме «История», без списка. */
export const buildNotebookHistoryTabCommandsMobile = (): UnknownAction[] => [
  setCartListPanelOpen(false),
  setHistoryListPanelOpen(false),
  closeDayPanel(),
  setNotebookStripTab('history'),
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

/** Mobile Cart slot: только список корзины, режим календаря не меняется. */
export const buildMobileCartSlotOpenCommands = (): UnknownAction[] => [
  setHistoryListPanelOpen(false),
  setCartListPanelOpen(true),
]

export const buildMobileCartSlotCloseCommands = (): UnknownAction[] => [
  setCartListPanelOpen(false),
]

/** Mobile History slot: только список истории, режим календаря не меняется. */
export const buildMobileHistorySlotOpenCommands = (): UnknownAction[] => [
  setCartListPanelOpen(false),
  setHistoryListPanelOpen(true),
]

export const buildMobileHistorySlotCloseCommands = (): UnknownAction[] => [
  setHistoryListPanelOpen(false),
]

/** sectionEditorMenu + cardPieCopy: снять активную закладку Cart/History, не трогая выбор строки. */
export const buildDisableCartOrHistoryNotebookOnSectionMenuCopyExitCommands = (
  notebookStripTab: DateStripSection,
): UnknownAction[] => {
  if (notebookStripTab === 'cart') {
    return [
      setNotebookStripDateOverCart(true),
      updateToolbarIcon({
        section: 'rightSidebar',
        key: 'cart',
        value: 'enabled',
      }),
      setNotebookStripTab('date'),
      closeDayPanel(),
    ]
  }

  if (notebookStripTab === 'history') {
    return [
      setNotebookStripDateOverHistory(true),
      updateToolbarIcon({
        section: 'history',
        key: 'listHistory',
        value: 'enabled',
      }),
      setNotebookStripTab('date'),
      closeDayPanel(),
    ]
  }

  return [closeDayPanel()]
}

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
      setNotebookStripTab('cart'),
    ]
  }
  if (tab === 'history') {
    return [
      setCartListPanelOpen(false),
      setHistoryListPanelOpen(true),
      setActiveSection('history'),
      setNotebookStripTab('history'),
    ]
  }
  return []
}
