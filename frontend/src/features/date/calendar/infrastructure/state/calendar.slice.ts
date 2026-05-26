import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { setCartListPanelOpen } from '@cart/infrastructure/state'
import { getCurrentDate } from '@shared/utils/date'
import type { CalendarViewDate } from '@entities/date/domain/types'
import type { CardCalendarIndex } from '@entities/card/domain/types'
import type { DaysOfWeek } from '@entities/date/domain/types'
import {
  PostcardStatuses,
  PostcardStatusesCount,
} from '@/entities/postcard/domain/types'
import type { DateStripSection } from '@date/presentation/dateStripSection.types'
import type { PanelDensity2Size } from '@shared/ui/icons'
import type { HistoryListSortMode } from '@date/application/helpers/historyListSort'

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
   * Закладка «Дата» при открытом CartListPanel: полоса «Дата», пока корзина не открывают заново снаружи.
   * Сбрасывается при `setNotebookStripTab('cart'|'history')` и при `setCartListPanelOpen(true)`.
   */
  notebookStripDateOverCart: boolean
  /**
   * Выбор новой даты из списка корзины (cartBlocked → dateEdit): стили календаря и сброс при уходе с «Корзина» / панели.
   */
  cartCalendarDatePickMode: boolean
  /**
   * `localId` открытки, для которой включён `cartCalendarDatePickMode`: на клик по дню календаря
   * сага применяет новую дату именно к ней.
   */
  cartCalendarDatePickLocalId: number | null
  historyListPanelOpen: boolean
  /** Выбранная строка списка истории — правый CardPie по `localId` открытки. */
  historyListSelectedLocalId: number | null
  dateListPanelOpen: boolean
  cardPieListPanelOpen: boolean
  openDayPanel: DayPanelPayload | null
  dateListSortDirection: 'asc' | 'desc'
  cardPieListSortDirection: 'asc' | 'desc'
  /** Список истории: цикл sortDown → sortUp → sortAZDown → sortAZUp. */
  historyListSortMode: HistoryListSortMode
  /**
   * Плотность сетки списка истории (`panelDensity2`): 1 — 4 ячейки, 2 — 5 ячеек.
   */
  historyListPanelDensity: PanelDensity2Size
  postcardStatusesCount: PostcardStatusesCount
  postcardStatuses: PostcardStatuses
  /**
   * Увеличивается при клике по закладке «Дата» на полосе календаря — App сбрасывает peek-ввод в центре.
   */
  notebookDateTabPeekClearTick: number
}

const now = getCurrentDate()

const initialState: CalendarState = {
  lastViewedCalendarDate: {
    year: now.year,
    month: now.month,
  },
  notebookStripTab: getInitialNotebookStripTab(),
  notebookStripDateOverCart: false,
  cartCalendarDatePickMode: false,
  cartCalendarDatePickLocalId: null,
  dateListPanelOpen: false,
  cardPieListPanelOpen: false,
  historyListPanelOpen: false,
  historyListSelectedLocalId: null,
  openDayPanel: null,
  dateListSortDirection: 'asc',
  cardPieListSortDirection: 'asc',
  historyListSortMode: 'dateDesc',
  historyListPanelDensity: 1,
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

    setPostcardStatusesCount(
      state,
      action: PayloadAction<PostcardStatusesCount>,
    ) {
      state.postcardStatusesCount = action.payload
    },

    setPostcardStatuses(state, action: PayloadAction<PostcardStatuses>) {
      state.postcardStatuses = action.payload
    },

    setHistoryListPanelOpen(state, action: PayloadAction<boolean>) {
      const wasOpen = state.historyListPanelOpen
      state.historyListPanelOpen = action.payload
      if (!action.payload) {
        state.historyListSelectedLocalId = null
        return
      }
      state.dateListPanelOpen = false
      /** Переход закрыть → открыть: чистый список истории; повторное `true` (сага при том же меню) — сохраняем строку и панель дня для правого CardPie. */
      if (!wasOpen) {
        state.historyListSelectedLocalId = null
        state.openDayPanel = null
      }
    },

    setHistoryListSelectedLocalId(state, action: PayloadAction<number | null>) {
      state.historyListSelectedLocalId = action.payload
    },

    setNotebookStripTab(state, action: PayloadAction<DateStripSection>) {
      state.notebookStripTab = action.payload
      if (action.payload === 'cart' || action.payload === 'history') {
        state.notebookStripDateOverCart = false
      }
      if (action.payload !== 'cart') {
        state.cartCalendarDatePickMode = false
        state.cartCalendarDatePickLocalId = null
      }
    },

    setNotebookStripDateOverCart(state, action: PayloadAction<boolean>) {
      state.notebookStripDateOverCart = action.payload
    },

    setCartCalendarDatePickMode(state, action: PayloadAction<boolean>) {
      state.cartCalendarDatePickMode = action.payload
      if (!action.payload) {
        state.cartCalendarDatePickLocalId = null
      }
    },

    setCartCalendarDatePickLocalId(
      state,
      action: PayloadAction<number | null>,
    ) {
      state.cartCalendarDatePickLocalId = action.payload
    },

    bumpNotebookDateTabPeekClearTick(state) {
      state.notebookDateTabPeekClearTick += 1
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setCartListPanelOpen, (state, action) => {
      if (action.payload === true) {
        state.notebookStripDateOverCart = false
      }
      state.cartCalendarDatePickMode = false
      state.cartCalendarDatePickLocalId = null
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
  setPostcardStatusesCount,
  setPostcardStatuses,
  setHistoryListPanelOpen,
  setHistoryListSelectedLocalId,
  setNotebookStripTab,
  setNotebookStripDateOverCart,
  setCartCalendarDatePickMode,
  setCartCalendarDatePickLocalId,
  bumpNotebookDateTabPeekClearTick,
} = calendarSlice.actions
export default calendarSlice.reducer
