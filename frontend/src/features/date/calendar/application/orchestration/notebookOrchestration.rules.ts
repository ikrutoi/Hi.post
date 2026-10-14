import type { UnknownAction } from '@reduxjs/toolkit'
import type { RootState } from '@app/state'
import {
  selectCartListPanelOpen,
  selectCartListStatusSegment,
} from '@cart/infrastructure/selectors'
import { selectIsMobileLayout } from '@layout/infrastructure/selectors'
import { selectNotebookStripTab } from '@date/calendar/infrastructure/selectors'
import {
  setCartListPanelOpen,
  setCartListSelectedLocalId,
  setCartListStatusSegment,
} from '@cart/infrastructure/state'
import type { CartListStatusSegment } from '@cart/domain/types'
import { setActiveSection } from '@entities/sectionEditorMenu/infrastructure/state/sectionEditorMenuSlice'
import {
  closeDayPanel,
  setCardPieListPanelOpen,
  endCartCalendarDatePick,
  setHistoryListSelectedLocalId,
  setHistoryListPanelOpen,
  setCartMobileReturn,
  setCartReturnPending,
  setHistoryMobileReturn,
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
  setNotebookStripDateOverCart(false),
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
  setNotebookStripDateOverCart(false),
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
  setNotebookStripDateOverCart(false),
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
  setNotebookStripDateOverHistory(false),
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
  setNotebookStripDateOverHistory(false),
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
  setNotebookStripDateOverHistory(false),
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

/**
 * Мобильный уход из корзины в сборку.
 * Сегмент «заблокированные» запоминаем только пока открыт именно этот список.
 * Календарь не тащит за собой прошлый сегмент — иначе возврат открывает заблокированные.
 */
export function buildRememberMobileCartSurfaceCommands(
  state: RootState,
): UnknownAction[] {
  if (!selectIsMobileLayout(state)) return []
  const listOpen = selectCartListPanelOpen(state)
  const strip = selectNotebookStripTab(state)
  const retained = state.cardPanel.archiveEditRetainsStrip
  const inCart =
    listOpen ||
    strip === 'cart' ||
    strip === 'cartdate' ||
    retained === 'cart' ||
    retained === 'cartdate'
  if (!inCart) return []
  const segment = selectCartListStatusSegment(state)
  return [
    setCartMobileReturn({
      view: listOpen ? 'list' : 'calendar',
      segment: listOpen && segment === 'cartBlocked' ? 'cartBlocked' : 'cart',
    }),
    setCartReturnPending(true),
  ]
}

export function nextCartListStatusSegment(
  current: CartListStatusSegment,
): CartListStatusSegment {
  return current === 'cart' ? 'cartBlocked' : 'cart'
}

/**
 * Desktop: повторный клик по корзине только меняет сегмент списка
 * (активные ↔ заблокированные), список не закрывается.
 */
export function buildDesktopCartListSegmentCycleCommands(
  current: CartListStatusSegment,
): UnknownAction[] {
  const next = nextCartListStatusSegment(current)
  if (next === 'cart') {
    return [endCartCalendarDatePick(), setCartListStatusSegment('cart')]
  }
  return [setCartListStatusSegment('cartBlocked')]
}

export function buildCartArchiveToggleCommands(input: {
  cartListPanelOpen: boolean
  notebookStripTab: DateStripSection
  isMobileLayout: boolean
  lastActiveView?: ArchiveActiveView
  listStatusSegment?: CartListStatusSegment
  /** Mobile: второй клик по корзине показывает заблокированные, если они есть. */
  hasBlockedCartItems?: boolean
  /** Mobile footer: первое нажатие из inactive открывает список, не календарь. */
  inactiveOpensView?: ArchiveActiveView
  /** Снимок корзины перед уходом в историю или сборку. */
  cartMobileReturn?: {
    view: 'calendar' | 'list'
    segment: CartListStatusSegment
  } | null
  /** Уход в сборку: следующий клик возвращает снимок, даже если список ещё открыт. */
  cartReturnPending?: boolean
  /** История, которую закрывает этот клик по корзине. */
  historyListPanelOpen?: boolean
  /** Сборка открытки: клик по корзине возвращает снимок, а не делает шаг круга. */
  activeSection?: CardMenuSection | null
}): UnknownAction[] {
  const mode = resolveCartArchiveViewMode(input)
  const listStatusSegment = input.listStatusSegment ?? 'cart'
  const hasBlockedCartItems = Boolean(input.hasBlockedCartItems)

  /**
   * Desktop sidebar: календарь в центре + список справа.
   * Повторный клик не скрывает список — переключает активные / заблокированные.
   */
  if (!input.isMobileLayout) {
    if (mode === 'list') {
      return buildDesktopCartListSegmentCycleCommands(listStatusSegment)
    }
    return [
      setLastCartArchiveView('list'),
      ...buildDesktopCartArchiveActivateCommands(),
    ]
  }

  const leavingHistory =
    input.historyListPanelOpen === true || input.notebookStripTab === 'history'
  const rememberHistory = leavingHistory
    ? setHistoryMobileReturn({
        view: input.historyListPanelOpen ? 'list' : 'calendar',
      })
    : null
  const withHistoryMemory = (commands: UnknownAction[]) =>
    rememberHistory ? [rememberHistory, ...commands] : commands

  const factorySection =
    input.activeSection === 'cardphoto' ||
    input.activeSection === 'cardtext' ||
    input.activeSection === 'envelope' ||
    input.activeSection === 'aroma'
  /**
   * Возврат из истории или сборки: календарь, активный список или
   * заблокированные — как было в момент ухода, без шага круга.
   * Пока список корзины ещё числится открытым, обычный круг принял бы
   * это за переход на заблокированные.
   */
  if (
    input.cartMobileReturn != null &&
    (mode === 'inactive' || factorySection || input.cartReturnPending)
  ) {
    const surface = input.cartMobileReturn
    const clearPending = setCartReturnPending(false)
    if (surface.view === 'list') {
      return withHistoryMemory([
        clearPending,
        setLastCartArchiveView('list'),
        setActiveSection('date'),
        setCartListStatusSegment(surface.segment),
        ...buildMobileCartSlotOpenCommands(),
      ])
    }
    return withHistoryMemory([
      clearPending,
      setLastCartArchiveView('calendar'),
      setCartListStatusSegment('cart'),
      ...buildNotebookCartTabCommandsMobile(),
    ])
  }

  /**
   * Mobile footer: активный список → заблокированные → календарь → снова активный.
   * Сегмент сбрасывается при уходе в календарь, иначе свитчер остаётся на
   * заблокированных и следующий круг пропускает активный список.
   */
  if (mode === 'list') {
    if (listStatusSegment !== 'cartBlocked' && hasBlockedCartItems) {
      return withHistoryMemory([
        setLastCartArchiveView('list'),
        ...buildDesktopCartListSegmentCycleCommands(listStatusSegment),
      ])
    }
    return withHistoryMemory([
      setLastCartArchiveView('calendar'),
      setCartListStatusSegment('cart'),
      ...buildNotebookCartTabCommandsMobile(),
    ])
  }

  const next =
    mode === 'inactive' && input.inactiveOpensView != null
      ? input.inactiveOpensView
      : resolveNextArchiveViewOnClick(mode, input.lastActiveView)
  const remember = setLastCartArchiveView(next)
  if (next === 'list') {
    return withHistoryMemory([
      remember,
      setCartListStatusSegment('cart'),
      ...buildMobileCartSlotOpenCommands(),
    ])
  }
  return withHistoryMemory([remember, ...buildNotebookCartTabCommandsMobile()])
}

export function buildHistoryArchiveToggleCommands(input: {
  historyListPanelOpen: boolean
  notebookStripTab: DateStripSection
  activeSection: CardMenuSection | null
  isMobileLayout: boolean
  lastActiveView?: ArchiveActiveView
  /** Mobile footer: первое нажатие из inactive открывает список, не календарь. */
  inactiveOpensView?: ArchiveActiveView
  /** Корзина, которую закрывает этот клик по истории. */
  cartListPanelOpen?: boolean
  cartListStatusSegment?: CartListStatusSegment
  /** Снимок истории перед уходом в корзину, дату или фабрику. */
  historyMobileReturn?: {
    view: 'calendar' | 'list'
  } | null
}): UnknownAction[] {
  const mode = resolveHistoryArchiveViewMode(input)

  /**
   * Desktop sidebar: календарь в центре + список справа.
   * Повторный клик не скрывает список (в отличие от mobile toggle).
   */
  if (!input.isMobileLayout) {
    return [
      setLastHistoryArchiveView('list'),
      ...buildDesktopHistoryArchiveActivateCommands(),
    ]
  }

  const leavingCart =
    input.cartListPanelOpen === true ||
    input.notebookStripTab === 'cart' ||
    input.notebookStripTab === 'cartdate'
  const rememberCart = leavingCart
    ? setCartMobileReturn({
        view: input.cartListPanelOpen ? 'list' : 'calendar',
        segment: input.cartListStatusSegment ?? 'cart',
      })
    : null

  /**
   * Возврат из корзины, даты или фабрики: календарь или список,
   * как было в момент ухода, без шага круга.
   */
  if (mode === 'inactive' && input.historyMobileReturn != null) {
    const surface = input.historyMobileReturn
    const remember = setLastHistoryArchiveView(surface.view)
    const open =
      surface.view === 'list'
        ? buildMobileHistorySlotOpenCommands()
        : buildNotebookHistoryTabCommandsMobile()
    return rememberCart ? [rememberCart, remember, ...open] : [remember, ...open]
  }

  const next =
    mode === 'inactive' && input.inactiveOpensView != null
      ? input.inactiveOpensView
      : resolveNextArchiveViewOnClick(mode, input.lastActiveView)
  const remember = setLastHistoryArchiveView(next)
  if (next === 'list') {
    const openList = input.isMobileLayout
      ? buildMobileHistorySlotOpenCommands()
      : buildHistoryListCommands()
    return rememberCart
      ? [rememberCart, remember, ...openList]
      : [remember, ...openList]
  }
  const openCalendar = input.isMobileLayout
    ? buildNotebookHistoryTabCommandsMobile()
    : buildHistoryCalendarCommandsDesktop()
  return rememberCart
    ? [rememberCart, remember, ...openCalendar]
    : [remember, ...openCalendar]
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
