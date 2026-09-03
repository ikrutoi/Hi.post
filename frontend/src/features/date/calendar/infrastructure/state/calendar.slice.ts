import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { setCartListPanelOpen } from '@cart/infrastructure/state'
import { getCurrentDate } from '@shared/utils/date'
import type {
  CalendarViewDate,
  DaysOfWeek,
  DispatchDate,
} from '@entities/date/domain/types'
import type { CardCalendarIndex } from '@entities/card/domain/types'
import {
  PostcardStatus,
  PostcardStatuses,
  PostcardStatusesCount,
} from '@/entities/postcard/domain/types'
import type { DateStripSection } from '@date/presentation/dateStripSection.types'
import type { PanelDensity2Size } from '@shared/ui/icons'
import type { HistoryListSortMode } from '@date/application/helpers/historyListSort'

import {
  nextStripMonthCycleIndex,
  type CalendarStripKind,
} from '@date/application/helpers/calendarStripMonthCycle'

const CALENDAR_STRIP_TAB_SESSION_KEY = 'hi.post.calendarStripTab'

const getInitialNotebookStripTab = (): DateStripSection => {
  if (typeof window === 'undefined') return 'date'
  const saved = window.sessionStorage.getItem(CALENDAR_STRIP_TAB_SESSION_KEY)
  return saved === 'cart' || saved === 'history' ? saved : 'date'
}

export const EMPTY_DAY_DATA: CardCalendarIndex = {
  processed: null,
  cart: [],
  ready: [],
  sent: [],
  delivered: [],
  error: [],
}

export type DayPanelPayload = {
  dateKey: string
  dayData: CardCalendarIndex
  openedByWeekday?: DaysOfWeek
}

type CalendarState = {
  lastViewedCalendarDate: CalendarViewDate
  /**
   * Активная закладка полосы Date / Cart / History в фабрике (центр + peek).
   * Синхронизируется сагой с `activeSection`, корзиной и панелью истории.
   */
  notebookStripTab: DateStripSection
  /**
   * Последний режим корзины (календарь / список), чтобы слот открывал его снова
   * после выключения, а не всегда календарь.
   */
  lastCartArchiveView: 'calendar' | 'list'
  /**
   * Последний режим истории (календарь / список).
   */
  lastHistoryArchiveView: 'calendar' | 'list'
  /**
   * Закладка «Дата» при открытом CartListPanel: полоса «Дата», пока корзина не открывают заново снаружи.
   * Сбрасывается при `setNotebookStripTab('cart'|'history')` и при `setCartListPanelOpen(true)`.
   */
  notebookStripDateOverCart: boolean
  /**
   * Закладка «Дата» при открытом HistoryListPanel: полоса «Дата», список и выбор строки не сбрасываются.
   */
  notebookStripDateOverHistory: boolean
  /**
   * Выбор новой даты из списка корзины (cartBlocked → dateEdit): стили календаря и сброс при уходе с «Корзина» / панели.
   */
  cartCalendarDatePickMode: boolean
  /**
   * `localId` открытки, для которой включён `cartCalendarDatePickMode`: на клик по дню календаря
   * сага применяет новую дату именно к ней.
   */
  cartCalendarDatePickLocalId: number | null
  /**
   * `cartdate`: черновик новой даты до Apply. Без Apply / при выходе сбрасывается —
   * открытка и CardPie остаются на старой (blocked) дате.
   */
  cartDatePickDraftDate: DispatchDate | null
  /**
   * Sticky session for date-pick: keeps cart/history list chrome hidden even if
   * `cartCalendarDatePickMode` is transiently cleared (panel open / sagas).
   */
  cartDatePickSessionActive: boolean
  historyListPanelOpen: boolean
  /** Выбранная строка списка истории — правый CardPie по `localId` открытки. */
  historyListSelectedLocalId: number | null
  dateListPanelOpen: boolean
  cardPieListPanelOpen: boolean
  openDayPanel: DayPanelPayload | null
  dateListSortDirection: 'asc' | 'desc'
  cardPieListSortDirection: 'asc' | 'desc'
  /** Список истории: цикл sort131Up → sort131Down → sortAZDown → sortAZUp. */
  historyListSortMode: HistoryListSortMode
  /**
   * Плотность сетки списка истории (`panelDensity2`): 1 — 4 ячейки, 2 — 5 ячеек.
   */
  historyListPanelDensity: PanelDensity2Size
  /**
   * Desktop plan minis: 1 — 3 колонки, 2 — 4 колонки.
   */
  planMiniListDensity: PanelDensity2Size
  postcardStatusesCount: PostcardStatusesCount
  postcardStatuses: PostcardStatuses
  /**
   * Увеличивается при клике по закладке «Дата» на полосе календаря — App сбрасывает peek-ввод в центре.
   */
  notebookDateTabPeekClearTick: number
  /** Индексы цикла футера cart/history strip по статусу. */
  stripMonthCycleIndices: {
    cart: Record<'cart' | 'cartBlocked', number>
    history: Record<'cart' | 'ready' | 'sent' | 'delivered' | 'error', number>
  }
  stripMonthCycleKeys: {
    cart: Partial<Record<'cart' | 'cartBlocked', string>>
    history: Partial<
      Record<'cart' | 'ready' | 'sent' | 'delivered' | 'error', string>
    >
  }
  /** Индекс, применённый последним `stepStripMonthCycle` (для UI в том же тике). */
  lastStripMonthCycleStep: {
    strip: CalendarStripKind
    status: string
    index: number
  } | null
}

const now = getCurrentDate()

const initialState: CalendarState = {
  lastViewedCalendarDate: {
    year: now.year,
    month: now.month,
  },
  notebookStripTab: getInitialNotebookStripTab(),
  lastCartArchiveView: 'calendar',
  lastHistoryArchiveView: 'calendar',
  notebookStripDateOverCart: false,
  notebookStripDateOverHistory: false,
  cartCalendarDatePickMode: false,
  cartCalendarDatePickLocalId: null,
  cartDatePickDraftDate: null,
  cartDatePickSessionActive: false,
  dateListPanelOpen: false,
  cardPieListPanelOpen: false,
  historyListPanelOpen: false,
  historyListSelectedLocalId: null,
  openDayPanel: null,
  dateListSortDirection: 'asc',
  cardPieListSortDirection: 'asc',
  historyListSortMode: 'dateAsc',
  historyListPanelDensity: 1,
  planMiniListDensity: 1,
  postcardStatusesCount: {
    cart: null,
    cartBlocked: null,
    ready: null,
    sent: null,
    delivered: null,
    error: null,
  },
  postcardStatuses: {
    cart: true,
    cartBlocked: true,
    ready: true,
    sent: true,
    delivered: true,
    error: true,
  },
  notebookDateTabPeekClearTick: 0,
  stripMonthCycleIndices: {
    cart: { cart: 0, cartBlocked: 0 },
    history: { cart: 0, ready: 0, sent: 0, delivered: 0, error: 0 },
  },
  stripMonthCycleKeys: { cart: {}, history: {} },
  lastStripMonthCycleStep: null,
}

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    updateLastViewedCalendarDate(
      state,
      action: PayloadAction<CalendarViewDate>,
    ) {
      state.lastViewedCalendarDate = action.payload
    },

    openDayPanel(state, action: PayloadAction<DayPanelPayload>) {
      state.openDayPanel = action.payload
    },

    closeDayPanel(state) {
      state.openDayPanel = null
    },

    setDateListPanelOpen(state, action: PayloadAction<boolean>) {
      state.dateListPanelOpen = action.payload
      if (action.payload) {
        state.cardPieListPanelOpen = false
        /**
         * В режиме закладки «Дата» открытие Date list из тулбара не должно
         * закрывать правые списки (History/Cart) и панель дня справа.
         */
        if (state.notebookStripTab !== 'date') {
          state.openDayPanel = null
          state.historyListPanelOpen = false
        }
      }
    },

    setCardPieListPanelOpen(state, action: PayloadAction<boolean>) {
      state.cardPieListPanelOpen = action.payload
      if (action.payload) {
        state.dateListPanelOpen = false
        /**
         * На полосках «Дата» и «История» открытие CardPie слева не закрывает
         * правые списки (корзина / список истории) и панель дня.
         */
        const keepRightListPanels =
          state.notebookStripTab === 'date' ||
          state.notebookStripTab === 'history'
        if (!keepRightListPanels) {
          state.historyListPanelOpen = false
          state.openDayPanel = null
        }
      }
    },

    toggleDateListSortDirection(state) {
      state.dateListSortDirection =
        state.dateListSortDirection === 'asc' ? 'desc' : 'asc'
    },

    setHistoryListSortMode(state, action: PayloadAction<HistoryListSortMode>) {
      state.historyListSortMode = action.payload
    },

    cycleHistoryListPanelDensity(state) {
      const d = state.historyListPanelDensity
      state.historyListPanelDensity = d === 1 ? 2 : 1
    },

    setHistoryListPanelDensity(
      state,
      action: PayloadAction<PanelDensity2Size>,
    ) {
      state.historyListPanelDensity = action.payload
    },

    cyclePlanMiniListDensity(state) {
      const d = state.planMiniListDensity
      state.planMiniListDensity = d === 1 ? 2 : 1
    },

    setPostcardStatusesCount(
      state,
      action: PayloadAction<PostcardStatusesCount>,
    ) {
      state.postcardStatusesCount = action.payload
    },

    setPostcardStatuses(state, action: PayloadAction<PostcardStatuses>) {
      state.postcardStatuses = action.payload
    },

    togglePostcardStatus(state, action: PayloadAction<PostcardStatus>) {
      const status = action.payload
      if (status === 'cart') {
        const nextCartValue = !state.postcardStatuses.cart
        state.postcardStatuses.cart = nextCartValue
        state.postcardStatuses.cartBlocked = nextCartValue
        return
      }
      state.postcardStatuses[status] = !state.postcardStatuses[status]
    },

    setHistoryListPanelOpen(state, action: PayloadAction<boolean>) {
      const wasOpen = state.historyListPanelOpen
      state.historyListPanelOpen = action.payload
      if (!action.payload) {
        return
      }
      state.lastHistoryArchiveView = 'list'
      state.dateListPanelOpen = false
      /** Переход закрыть → открыть: сохраняем выбранную в календаре открытку; сбрасываем только панель дня. */
      if (!wasOpen) {
        state.openDayPanel = null
        state.notebookStripDateOverHistory = false
      }
    },

    setHistoryListSelectedLocalId(state, action: PayloadAction<number | null>) {
      state.historyListSelectedLocalId = action.payload
    },

    setNotebookStripTab(state, action: PayloadAction<DateStripSection>) {
      state.notebookStripTab = action.payload
      if (
        action.payload === 'cart' ||
        action.payload === 'history' ||
        action.payload === 'cartdate'
      ) {
        state.notebookStripDateOverCart = false
        state.notebookStripDateOverHistory = false
      }
      /**
       * `cart` и `cartdate` держат date-pick session.
       * Уход на date/history сбрасывает pick.
       */
      if (action.payload !== 'cart' && action.payload !== 'cartdate') {
        state.cartCalendarDatePickMode = false
        state.cartCalendarDatePickLocalId = null
        state.cartDatePickDraftDate = null
        state.cartDatePickSessionActive = false
      }
    },

    setLastCartArchiveView(
      state,
      action: PayloadAction<'calendar' | 'list'>,
    ) {
      state.lastCartArchiveView = action.payload
    },

    setLastHistoryArchiveView(
      state,
      action: PayloadAction<'calendar' | 'list'>,
    ) {
      state.lastHistoryArchiveView = action.payload
    },

    setNotebookStripDateOverCart(state, action: PayloadAction<boolean>) {
      state.notebookStripDateOverCart = action.payload
    },

    setNotebookStripDateOverHistory(state, action: PayloadAction<boolean>) {
      state.notebookStripDateOverHistory = action.payload
    },

    setCartCalendarDatePickMode(state, action: PayloadAction<boolean>) {
      state.cartCalendarDatePickMode = action.payload
      if (!action.payload) {
        state.cartCalendarDatePickLocalId = null
        state.cartDatePickDraftDate = null
        /**
         * Keep `cartDatePickSessionActive` — only `endCartCalendarDatePick`
         * drops the session so list chrome can return.
         */
      } else {
        state.cartDatePickSessionActive = true
      }
    },

    setCartCalendarDatePickLocalId(
      state,
      action: PayloadAction<number | null>,
    ) {
      state.cartCalendarDatePickLocalId = action.payload
    },

    setCartDatePickDraftDate(
      state,
      action: PayloadAction<DispatchDate | null>,
    ) {
      state.cartDatePickDraftDate =
        action.payload == null ? null : { ...action.payload }
    },

    /** Start date-pick and pin list chrome hidden for the session. */
    beginCartCalendarDatePick(
      state,
      action: PayloadAction<{ localId: number }>,
    ) {
      state.cartCalendarDatePickMode = true
      state.cartCalendarDatePickLocalId = action.payload.localId
      state.cartDatePickDraftDate = null
      state.cartDatePickSessionActive = true
    },

    /** End date-pick session (list chrome may show again). */
    endCartCalendarDatePick(state) {
      state.cartCalendarDatePickMode = false
      state.cartCalendarDatePickLocalId = null
      state.cartDatePickDraftDate = null
      state.cartDatePickSessionActive = false
    },

    bumpNotebookDateTabPeekClearTick(state) {
      state.notebookDateTabPeekClearTick += 1
    },

    stepStripMonthCycle(
      state,
      action: PayloadAction<{
        strip: CalendarStripKind
        status: string
        localIdsKey: string
        itemCount: number
        /** Индекс уже выбранной в календаре / списке открытки — цикл от неё. */
        selectedIndex?: number
      }>,
    ) {
      const { strip, status, localIdsKey, itemCount, selectedIndex } =
        action.payload

      if (state.stripMonthCycleIndices == null) {
        state.stripMonthCycleIndices = {
          cart: { cart: 0, cartBlocked: 0 },
          history: { cart: 0, ready: 0, sent: 0, delivered: 0, error: 0 },
        }
      }
      if (state.stripMonthCycleKeys == null) {
        state.stripMonthCycleKeys = { cart: {}, history: {} }
      }

      const keys = state.stripMonthCycleKeys[strip] as Record<
        string,
        string | undefined
      >
      const indices = state.stripMonthCycleIndices[strip] as Record<
        string,
        number
      >

      if (keys[status] !== localIdsKey) {
        keys[status] = localIdsKey
        indices[status] = 0
      }

      if (itemCount <= 0) {
        state.lastStripMonthCycleStep = null
        return
      }

      let displayIndex: number
      if (
        selectedIndex != null &&
        selectedIndex >= 0 &&
        selectedIndex < itemCount
      ) {
        displayIndex = nextStripMonthCycleIndex(selectedIndex, itemCount)
      } else {
        displayIndex = indices[status] ?? 0
      }

      state.lastStripMonthCycleStep = { strip, status, index: displayIndex }
      indices[status] = nextStripMonthCycleIndex(displayIndex, itemCount)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setCartListPanelOpen, (state, action) => {
      if (action.payload === true) {
        state.lastCartArchiveView = 'list'
        state.notebookStripDateOverCart = false
        /**
         * Do not clear date-pick here: callers that leave pick call
         * `endCartCalendarDatePick` / `setCartCalendarDatePickMode(false)`.
         * Clearing on open raced peek→edit (list under peek stayed open).
         */
      }
    })
  },
})

export const {
  updateLastViewedCalendarDate,
  openDayPanel,
  closeDayPanel,
  setDateListPanelOpen,
  setCardPieListPanelOpen,
  toggleDateListSortDirection,
  setHistoryListSortMode,
  cycleHistoryListPanelDensity,
  setHistoryListPanelDensity,
  cyclePlanMiniListDensity,
  setPostcardStatusesCount,
  setPostcardStatuses,
  togglePostcardStatus,
  setHistoryListPanelOpen,
  setHistoryListSelectedLocalId,
  setNotebookStripTab,
  setLastCartArchiveView,
  setLastHistoryArchiveView,
  setNotebookStripDateOverCart,
  setNotebookStripDateOverHistory,
  setCartCalendarDatePickMode,
  setCartCalendarDatePickLocalId,
  setCartDatePickDraftDate,
  beginCartCalendarDatePick,
  endCartCalendarDatePick,
  bumpNotebookDateTabPeekClearTick,
  stepStripMonthCycle,
} = calendarSlice.actions
export default calendarSlice.reducer
