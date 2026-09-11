import { POSTCARD_DISPATCH_DATE_FALLBACK } from '@entities/postcard'
import type {
  PostcardStatuses,
  PostcardStatusesCount,
} from '@/entities/postcard/domain/types'
import type { RootState } from '@app/state'
import type { PostcardStatus } from '@entities/postcard/domain/types'
import type { CalendarViewDate, DispatchDate } from '@entities/date/domain/types'
import type { DateStripSection } from '@date/presentation/dateStripSection.types'
import { createSelector } from '@reduxjs/toolkit'
import { selectIsMobileLayout } from '@layout/infrastructure/selectors'
import { selectCartItems } from '@cart/infrastructure/selectors'
import { selectCartListSelectedLocalId, selectCartListPanelOpen } from '@cart/infrastructure/selectors/cartSelectors'
import { getHistoryOpenDayPanelPrimaryPostcardLocalId } from '../historyOpenDayPanelPrimaryPostcard'
import { resolveCartdateBranch } from '@date/calendar/application/logic/calendarStripSection'
import type { DayPanelPayload } from '../state/calendar.slice'
import type { PanelDensity2Size } from '@shared/ui/icons'

export const selectLastCalendarViewDate = (
  state: RootState,
): CalendarViewDate => state.calendar.lastViewedCalendarDate

export const selectLastStripMonthCycleStep = (state: RootState) =>
  state.calendar.lastStripMonthCycleStep

export const computeNotebookStripTabFromState = (
  state: RootState,
): DateStripSection => {
  const currentTab = state.calendar.notebookStripTab

  /** Mobile: закладки хедера задают strip явно; списки корзины/истории strip не трогают. */
  if (selectIsMobileLayout(state)) {
    return currentTab
  }

  /**
   * `cartdate` — отдельный режим (не assembly `date`). Не схлопывать в `date`
   * при `activeSection === 'date'` / sync после closeDayPanel — иначе гаснет cart.
   */
  if (currentTab === 'cartdate') {
    return 'cartdate'
  }

  const activeSection = state.sectionEditorMenu.activeSection
  if (state.cart.isActive && state.calendar.notebookStripDateOverCart) {
    return 'date'
  }
  if (state.cart.isActive) return 'cart'
  if (
    activeSection === 'date' &&
    currentTab === 'cart' &&
    !state.calendar.notebookStripDateOverCart
  ) {
    return 'cart'
  }
  if (activeSection === 'history') return 'history'
  if (
    state.calendar.historyListPanelOpen &&
    !state.calendar.notebookStripDateOverHistory
  ) {
    return 'history'
  }
  if (
    state.calendar.historyListPanelOpen &&
    state.calendar.notebookStripDateOverHistory
  ) {
    return 'date'
  }
  if (activeSection === 'date') return 'date'
  return 'date'
}

export const selectNotebookStripTab = (state: RootState): DateStripSection =>
  state.calendar.notebookStripTab

export const selectLastCartArchiveView = (
  state: RootState,
): 'calendar' | 'list' => state.calendar.lastCartArchiveView ?? 'calendar'

export const selectLastHistoryArchiveView = (
  state: RootState,
): 'calendar' | 'list' => state.calendar.lastHistoryArchiveView ?? 'calendar'

export const selectComputedNotebookStripTab = (
  state: RootState,
): DateStripSection => computeNotebookStripTabFromState(state)

export const selectCartCalendarDatePickMode = (state: RootState): boolean =>
  state.calendar.cartCalendarDatePickMode

export const selectCartCalendarDatePickLocalId = (
  state: RootState,
): number | null => state.calendar.cartCalendarDatePickLocalId

export const selectCartDatePickDraftDate = (
  state: RootState,
): DispatchDate | null => state.calendar.cartDatePickDraftDate

export const selectCartDatePickSessionActive = (state: RootState): boolean =>
  state.calendar.cartDatePickSessionActive

function sameDispatchDate(a: DispatchDate, b: DispatchDate): boolean {
  return a.year === b.year && a.month === b.month && a.day === b.day
}

/**
 * `cartdate`: Apply доступен, когда черновик дня отличается от даты открытки.
 * Без Apply черновик не пишется в открытку / CardPie.
 */
export const selectCanApplyCartdatePick = createSelector(
  [
    selectNotebookStripTab,
    selectCartCalendarDatePickMode,
    selectCartCalendarDatePickLocalId,
    selectCartDatePickDraftDate,
    selectCartItems,
  ],
  (tab, mode, localId, draft, items): boolean => {
    if (tab !== 'cartdate' || !mode || localId == null || draft == null) {
      return false
    }
    const postcard = items.find((p) => p.localId === localId)
    if (postcard == null) return false
    return !sameDispatchDate(postcard.date, draft)
  },
)

/** @deprecated Use `selectCanApplyCartdatePick`. */
export const selectCanApplyUnblockedCartDatePick = selectCanApplyCartdatePick

/**
 * Ветка `cartdate`: `cart` | `cartBlocked` | null вне режима.
 */
export const selectCartdateBranch = createSelector(
  [
    selectNotebookStripTab,
    selectCartCalendarDatePickLocalId,
    selectCartItems,
  ],
  (tab, localId, items) => {
    if (tab !== 'cartdate' || localId == null) return null
    const postcard = items.find((p) => p.localId === localId)
    if (postcard == null) return null
    return resolveCartdateBranch({
      status: postcard.status,
      dates: [postcard.date],
    })
  },
)

export const selectNotebookDateTabPeekClearTick = (state: RootState): number =>
  state.calendar.notebookDateTabPeekClearTick

export const selectIsDateListPanelOpen = (state: RootState): boolean =>
  state.calendar.dateListPanelOpen

export const selectOpenDayPanel = (state: RootState): DayPanelPayload | null =>
  state.calendar.openDayPanel

export const selectIsCardPieListPanelOpen = (state: RootState): boolean =>
  state.calendar.cardPieListPanelOpen

export const selectIsHistoryListPanelOpen = (state: RootState): boolean =>
  state.calendar.historyListPanelOpen

export const selectHistoryListSelectedLocalId = (
  state: RootState,
): number | null => state.calendar.historyListSelectedLocalId ?? null

export const selectDateListSortDirection = (state: RootState): 'asc' | 'desc' =>
  state.calendar.dateListSortDirection ?? 'asc'

export const selectHistoryListSortMode = (
  state: RootState,
) => state.calendar.historyListSortMode ?? 'dateAsc'

export const selectHistoryListPanelDensity = (
  state: RootState,
): PanelDensity2Size => state.calendar.historyListPanelDensity ?? 1

export const selectPlanMiniListDensity = (
  state: RootState,
): PanelDensity2Size => state.calendar.planMiniListDensity ?? 1

export const selectCardPieListSortDirection = (
  state: RootState,
): 'asc' | 'desc' => state.calendar.cardPieListSortDirection ?? 'asc'

export const selectPostcardStatusesCount = (
  state: RootState,
): PostcardStatusesCount => state.calendar.postcardStatusesCount

export const selectPostcardStatuses = (state: RootState): PostcardStatuses =>
  state.calendar.postcardStatuses

export const selectHistoryOpenDayPanelArchiveLocalId = createSelector(
  [
    (s: RootState) => s.calendar.openDayPanel,
    (s: RootState) => s.sectionEditorMenu.activeSection,
    selectCartItems,
    selectPostcardStatuses,
  ],
  (openDayPanel, activeSection, cartItems, postcardStatuses) => {
    if (activeSection !== 'history' || openDayPanel == null) return null
    return getHistoryOpenDayPanelPrimaryPostcardLocalId(
      openDayPanel.dayData,
      cartItems,
      postcardStatuses,
    )
  },
)

function archivePostcardLocalIdExists(
  cartItems: readonly { localId: number }[],
  localId: number | null | undefined,
): localId is number {
  if (localId == null) return false
  return cartItems.some((item) => item.localId === localId)
}

/** Та же приоритизация `localId`, что у archive CardPie в App / mobile shell. */
export function resolveRightListArchivePostcardLocalId(input: {
  cartListPanelOpen: boolean
  cartListSelectedLocalId: number | null
  historyListPanelOpen: boolean
  historyListSelectedLocalId: number | null
  historyOpenDayPanelArchiveLocalId: number | null
  /** Raw `notebookStripTab` — не computed: иначе открытый список корзины «перебивает» history strip. */
  notebookStripTab: DateStripSection
  cartItems: readonly { localId: number }[]
}): number | null {
  const {
    cartListPanelOpen,
    cartListSelectedLocalId,
    historyListPanelOpen,
    historyListSelectedLocalId,
    historyOpenDayPanelArchiveLocalId,
    notebookStripTab,
    cartItems,
  } = input

  const onCartStrip =
    notebookStripTab === 'cart' || notebookStripTab === 'cartdate'
  const onHistoryStrip = notebookStripTab === 'history'

  /** Активная strip-закладка важнее «залипшего» open-флага другого списка. */
  if (
    onHistoryStrip &&
    archivePostcardLocalIdExists(cartItems, historyListSelectedLocalId)
  ) {
    return historyListSelectedLocalId
  }
  if (
    onCartStrip &&
    archivePostcardLocalIdExists(cartItems, cartListSelectedLocalId)
  ) {
    return cartListSelectedLocalId
  }

  if (
    archivePostcardLocalIdExists(cartItems, cartListSelectedLocalId) &&
    (cartListPanelOpen || onCartStrip)
  ) {
    return cartListSelectedLocalId
  }
  if (
    archivePostcardLocalIdExists(cartItems, historyListSelectedLocalId) &&
    (historyListPanelOpen || onHistoryStrip)
  ) {
    return historyListSelectedLocalId
  }

  if (
    cartListPanelOpen &&
    archivePostcardLocalIdExists(cartItems, cartListSelectedLocalId)
  ) {
    return cartListSelectedLocalId
  }
  if (
    historyListPanelOpen &&
    archivePostcardLocalIdExists(cartItems, historyListSelectedLocalId)
  ) {
    return historyListSelectedLocalId
  }
  if (
    archivePostcardLocalIdExists(
      cartItems,
      historyOpenDayPanelArchiveLocalId,
    )
  ) {
    return historyOpenDayPanelArchiveLocalId
  }
  return null
}

/** Peek archive на date tab при `activePieSide === 'right'` (см. App.tsx). */
export function resolveRightListArchivePostcardLocalIdWithPeek(input: {
  cartListPanelOpen: boolean
  cartListSelectedLocalId: number | null
  historyListPanelOpen: boolean
  historyListSelectedLocalId: number | null
  historyOpenDayPanelArchiveLocalId: number | null
  notebookStripTab: DateStripSection
  cartItems: readonly { localId: number }[]
  activePieSideRight: boolean
}): number | null {
  const base = resolveRightListArchivePostcardLocalId(input)
  if (base != null) return base
  if (!input.activePieSideRight) return null

  if (
    archivePostcardLocalIdExists(
      input.cartItems,
      input.historyListSelectedLocalId,
    )
  ) {
    return input.historyListSelectedLocalId
  }
  if (
    archivePostcardLocalIdExists(input.cartItems, input.cartListSelectedLocalId)
  ) {
    return input.cartListSelectedLocalId
  }
  return null
}

/** Источник archive CardPie для `localId` (корзина / история). */
export function resolveRightListArchiveSourceForLocalId(
  localId: number | null,
  input: {
    cartListSelectedLocalId: number | null
    historyListSelectedLocalId: number | null
    historyOpenDayPanelArchiveLocalId: number | null
    cartItems: readonly { localId: number; status: PostcardStatus }[]
  },
): 'cart' | 'history' | null {
  if (localId == null) return null
  const postcard = input.cartItems.find((item) => item.localId === localId)
  if (postcard == null) return null

  if (input.historyListSelectedLocalId === localId) return 'history'
  if (input.historyOpenDayPanelArchiveLocalId === localId) return 'history'
  if (input.cartListSelectedLocalId === localId) return 'cart'

  if (postcard.status === 'cart' || postcard.status === 'cartBlocked') {
    return 'cart'
  }
  return 'history'
}

/** Тот же `localId`, что у archive CardPie на экране (store + peek). */
export function readDisplayedRightListArchivePostcardLocalId(
  state: RootState,
  options: {
    isMobileLayout: boolean
    activePieSideRight: boolean
    pinnedLocalId: number | null
  },
): number | null {
  if (options.pinnedLocalId != null) return options.pinnedLocalId

  const cartItems = selectCartItems(state)
  if (options.isMobileLayout) {
    if (selectCartListPanelOpen(state)) {
      const cartId = selectCartListSelectedLocalId(state)
      if (archivePostcardLocalIdExists(cartItems, cartId)) return cartId
    }
    if (selectIsHistoryListPanelOpen(state)) {
      const historyId = selectHistoryListSelectedLocalId(state)
      if (archivePostcardLocalIdExists(cartItems, historyId)) return historyId
    }
  }

  return resolveRightListArchivePostcardLocalIdWithPeek({
    cartListPanelOpen: selectCartListPanelOpen(state),
    cartListSelectedLocalId: selectCartListSelectedLocalId(state),
    historyListPanelOpen: selectIsHistoryListPanelOpen(state),
    historyListSelectedLocalId: selectHistoryListSelectedLocalId(state),
    historyOpenDayPanelArchiveLocalId: selectHistoryOpenDayPanelArchiveLocalId(
      state,
    ),
    notebookStripTab: selectNotebookStripTab(state),
    cartItems,
    activePieSideRight: options.activePieSideRight,
  })
}

/** `localId` открытки, выбранной в правом archive CardPie (корзина / история / день). */
export const selectRightListArchivePostcardLocalId = createSelector(
  [
    selectCartListPanelOpen,
    selectCartListSelectedLocalId,
    selectIsHistoryListPanelOpen,
    selectHistoryListSelectedLocalId,
    selectHistoryOpenDayPanelArchiveLocalId,
    selectNotebookStripTab,
    selectCartItems,
  ],
  (
    cartListPanelOpen,
    cartListSelectedLocalId,
    historyListPanelOpen,
    historyListSelectedLocalId,
    historyOpenDayPanelArchiveLocalId,
    notebookStripTab,
    cartItems,
  ): number | null =>
    resolveRightListArchivePostcardLocalId({
      cartListPanelOpen,
      cartListSelectedLocalId,
      historyListPanelOpen,
      historyListSelectedLocalId,
      historyOpenDayPanelArchiveLocalId,
      notebookStripTab,
      cartItems,
    }),
)

function isPostcardDispatchFallbackDate(d: DispatchDate): boolean {
  return (
    d.year === POSTCARD_DISPATCH_DATE_FALLBACK.year &&
    d.month === POSTCARD_DISPATCH_DATE_FALLBACK.month &&
    d.day === POSTCARD_DISPATCH_DATE_FALLBACK.day
  )
}

/**
 * Дата отправки открытки, для которой показан правый CardPie из списка корзины / истории
 * (та же приоритизация `localId`, что в `App.tsx` для `rightListArchiveLocalId`).
 */
export const selectRightListArchiveCardPieHighlightDispatchDate = createSelector(
  [
    selectCartListPanelOpen,
    selectCartListSelectedLocalId,
    selectHistoryOpenDayPanelArchiveLocalId,
    selectIsHistoryListPanelOpen,
    selectHistoryListSelectedLocalId,
    selectNotebookStripTab,
    selectCartItems,
  ],
  (
    cartListPanelOpen,
    cartListSelectedLocalId,
    historyDayPanelArchiveLocalId,
    historyListPanelOpen,
    historyListSelectedLocalId,
    notebookStripTab,
    cartItems,
  ): DispatchDate | null => {
    const localId = resolveRightListArchivePostcardLocalId({
      cartListPanelOpen,
      cartListSelectedLocalId,
      historyListPanelOpen,
      historyListSelectedLocalId,
      historyOpenDayPanelArchiveLocalId: historyDayPanelArchiveLocalId,
      notebookStripTab,
      cartItems,
    })
    if (localId == null) return null
    const postcard = cartItems.find((p) => p.localId === localId)
    if (!postcard) return null
    const d = postcard.date
    if (isPostcardDispatchFallbackDate(d)) return null
    return d
  },
)
