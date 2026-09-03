import type { UnknownAction } from '@reduxjs/toolkit'
import {
  setCartListPanelOpen,
  setCartListSelectedLocalId,
} from '@cart/infrastructure/state'
import { setActiveSection } from '@entities/sectionEditorMenu/infrastructure/state/sectionEditorMenuSlice'
import {
  closeDayPanel,
  setCardPieListPanelOpen,
  endCartCalendarDatePick,
  setHistoryListSelectedLocalId,
  setHistoryListPanelOpen,
  setLastCartArchiveView,
  setLastHistoryArchiveView,
  setNotebookStripDateOverCart,
  setNotebookStripDateOverHistory,
  setNotebookStripTab,
} from '@date/calendar/infrastructure/state'
import { archiveCalendarViewEntered } from '@date/calendar/application/orchestration/notebookOrchestration.events'
import type { DateStripSection } from '@date/presentation/dateStripSection.types'
import type { CardMenuSection } from '@shared/config/constants'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'

export type CartArchiveViewMode = 'inactive' | 'calendar' | 'list'
export type HistoryArchiveViewMode = 'inactive' | 'calendar' | 'list'
export type ArchiveActiveView = 'calendar' | 'list'

export function resolveCartArchiveViewMode(input: {
  cartListPanelOpen: boolean
  notebookStripTab: DateStripSection
}): CartArchiveViewMode {
  if (input.cartListPanelOpen) return 'list'
  if (
    input.notebookStripTab === 'cart' ||
    input.notebookStripTab === 'cartdate'
  ) {
    return 'calendar'
  }
  return 'inactive'
}

export function resolveHistoryArchiveViewMode(input: {
  historyListPanelOpen: boolean
  notebookStripTab: DateStripSection
  activeSection: CardMenuSection | null
  /** Упрощённый peek секции архива истории (CardPie → фабрика без toolbar). */
  archiveSectionPeekActive?: boolean
}): HistoryArchiveViewMode {
  if (input.historyListPanelOpen) return 'list'
  if (input.notebookStripTab !== 'history') return 'inactive'
  /** Закладка History без списка = календарный режим (в т.ч. после section edit). */
  return 'calendar'
}

export function resolveNextArchiveViewOnClick(
  mode: CartArchiveViewMode | HistoryArchiveViewMode,
  lastActiveView: ArchiveActiveView = 'calendar',
): ArchiveActiveView {
  if (mode === 'inactive') return lastActiveView
  return mode === 'calendar' ? 'list' : 'calendar'
}

export const buildNotebookDateTabCommands = (): UnknownAction[] => [
  setNotebookStripDateOverCart(true),
  setCartListSelectedLocalId(null),
  setHistoryListSelectedLocalId(null),
  closeDayPanel(),
  endCartCalendarDatePick(),
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
  endCartCalendarDatePick(),
  setNotebookStripTab('date'),
  setActiveSection('date'),
]

/** Календарь в режиме «Корзина», список закрыт (desktop sidebar / mobile). */
export const buildCartCalendarCommands = (): UnknownAction[] => [
  setHistoryListPanelOpen(false),
  closeDayPanel(),
  updateToolbarIcon({
    section: 'history',
    key: 'listHistory',
    value: 'enabled',
  }),
  setCartListPanelOpen(false),
  updateToolbarIcon({
    section: 'rightSidebar',
    key: 'cart',
    value: 'active',
  }),
  endCartCalendarDatePick(),
  setNotebookStripTab('cart'),
  setActiveSection('date'),
  archiveCalendarViewEntered('cart'),
]

/** Desktop: календарь корзины в центре + список открыток справа. */
export const buildDesktopCartArchiveActivateCommands = (): UnknownAction[] => [
  ...buildCartListCommands(),
  archiveCalendarViewEntered('cart'),
]

/** Список корзины (desktop sidebar / mobile). */
export const buildCartListCommands = (): UnknownAction[] => [
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
  endCartCalendarDatePick(),
  setNotebookStripTab('cart'),
  setActiveSection('date'),
]

/** Mobile header Cart tab: календарь в режиме «Корзина», без списка. */
export const buildNotebookCartTabCommandsMobile = (): UnknownAction[] => [
  setCartListPanelOpen(false),
  setHistoryListPanelOpen(false),
  closeDayPanel(),
  endCartCalendarDatePick(),
  setNotebookStripTab('cart'),
  setActiveSection('date'),
  archiveCalendarViewEntered('cart'),
]

/** Mobile header History tab: календарь в режиме «История», без списка. */
export const buildNotebookHistoryTabCommandsMobile = (): UnknownAction[] => [
  setCartListPanelOpen(false),
  setHistoryListPanelOpen(false),
  closeDayPanel(),
  setNotebookStripTab('history'),
  setActiveSection('date'),
  archiveCalendarViewEntered('history'),
]

/** @deprecated Используйте `buildCartListCommands` или `buildCartArchiveToggleCommands`. */
export const buildNotebookCartTabCommands = (): UnknownAction[] =>
  buildCartListCommands()

/** Календарь в режиме «История», список закрыт (desktop). */
export const buildHistoryCalendarCommandsDesktop = (): UnknownAction[] => [
  setCartListPanelOpen(false),
  updateToolbarIcon({
    section: 'rightSidebar',
    key: 'cart',
    value: 'enabled',
  }),
  setHistoryListPanelOpen(false),
  closeDayPanel(),
  setNotebookStripTab('history'),
  setActiveSection('history'),
  archiveCalendarViewEntered('history'),
]

/** Desktop: календарь истории в центре + список открыток справа. */
export const buildDesktopHistoryArchiveActivateCommands = (): UnknownAction[] => [
  ...buildHistoryListCommands(),
  archiveCalendarViewEntered('history'),
]

/** Список истории (desktop sidebar / mobile). */
export const buildHistoryListCommands = (): UnknownAction[] => [
  setCartListPanelOpen(false),
  updateToolbarIcon({
    section: 'rightSidebar',
    key: 'cart',
    value: 'enabled',
  }),
  setHistoryListPanelOpen(true),
  setNotebookStripTab('history'),
  setActiveSection('history'),
]

export const buildNotebookHistoryTabCommands = (): UnknownAction[] =>
  buildHistoryCalendarCommandsDesktop()

export function buildCartArchiveToggleCommands(input: {
  cartListPanelOpen: boolean
  notebookStripTab: DateStripSection
  isMobileLayout: boolean
  lastActiveView?: ArchiveActiveView
}): UnknownAction[] {
  const mode = resolveCartArchiveViewMode(input)

  /** Desktop sidebar: включение — сразу календарь (центр) + список (справа). */
  if (!input.isMobileLayout && mode === 'inactive') {
    return [
      setLastCartArchiveView('list'),
      ...buildDesktopCartArchiveActivateCommands(),
    ]
  }

  const next = resolveNextArchiveViewOnClick(mode, input.lastActiveView)
  const remember = setLastCartArchiveView(next)
  if (next === 'list') {
    const openList = input.isMobileLayout
      ? buildMobileCartSlotOpenCommands()
      : buildCartListCommands()
    return [remember, ...openList]
  }
  const openCalendar = input.isMobileLayout
    ? buildNotebookCartTabCommandsMobile()
    : buildCartCalendarCommands()
  return [remember, ...openCalendar]
}

export function buildHistoryArchiveToggleCommands(input: {
  historyListPanelOpen: boolean
  notebookStripTab: DateStripSection
  activeSection: CardMenuSection | null
  isMobileLayout: boolean
  lastActiveView?: ArchiveActiveView
}): UnknownAction[] {
  const mode = resolveHistoryArchiveViewMode(input)

  /** Desktop sidebar: включение — сразу календарь (центр) + список (справа). */
  if (!input.isMobileLayout && mode === 'inactive') {
    return [
      setLastHistoryArchiveView('list'),
      ...buildDesktopHistoryArchiveActivateCommands(),
    ]
  }

  const next = resolveNextArchiveViewOnClick(mode, input.lastActiveView)
  const remember = setLastHistoryArchiveView(next)
  if (next === 'list') {
    const openList = input.isMobileLayout
      ? buildMobileHistorySlotOpenCommands()
      : buildHistoryListCommands()
    return [remember, ...openList]
  }
  const openCalendar = input.isMobileLayout
    ? buildNotebookHistoryTabCommandsMobile()
    : buildHistoryCalendarCommandsDesktop()
  return [remember, ...openCalendar]
}

/** Mobile Cart slot: список корзины; tab cart, чтобы слот оставался включённым. */
export const buildMobileCartSlotOpenCommands = (): UnknownAction[] => [
  setHistoryListPanelOpen(false),
  endCartCalendarDatePick(),
  setNotebookStripTab('cart'),
  setCartListPanelOpen(true),
]

export const buildMobileCartSlotCloseCommands = (): UnknownAction[] => [
  setCartListPanelOpen(false),
]

/** Mobile History slot: список истории; tab history, чтобы слот оставался включённым. */
export const buildMobileHistorySlotOpenCommands = (): UnknownAction[] => [
  setCartListPanelOpen(false),
  endCartCalendarDatePick(),
  setNotebookStripTab('history'),
  setHistoryListPanelOpen(true),
]

export const buildMobileHistorySlotCloseCommands = (): UnknownAction[] => [
  setHistoryListPanelOpen(false),
]

/** sectionEditorMenu + cardPieCopy: снять активную закладку Cart/History, не трогая выбор строки. */
export const buildDisableCartOrHistoryNotebookOnSectionMenuCopyExitCommands = (
  notebookStripTab: DateStripSection,
): UnknownAction[] => {
  if (notebookStripTab === 'cart' || notebookStripTab === 'cartdate') {
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
    return buildDesktopCartArchiveActivateCommands()
  }
  if (tab === 'history') {
    return buildDesktopHistoryArchiveActivateCommands()
  }
  return []
}
