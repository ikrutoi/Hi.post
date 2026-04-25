import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getCurrentDate } from '@shared/utils/date'
import type { CalendarViewDate } from '@entities/date/domain/types'
import type { CardCalendarIndex } from '@entities/card/domain/types'
import type { DaysOfWeek } from '@entities/date/domain/types'
import {
  PostcardStatuses,
  PostcardStatusesCount,
} from '@/entities/postcard/domain/types'

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
  historyListPanelOpen: boolean
  /** Выбранная строка списка истории — правый CardPie по `localId` открытки. */
  historyListSelectedLocalId: number | null
  dateListPanelOpen: boolean
  cardPieListPanelOpen: boolean
  openDayPanel: DayPanelPayload | null
  dateListSortDirection: 'asc' | 'desc'
  cardPieListSortDirection: 'asc' | 'desc'
  postcardStatusesCount: PostcardStatusesCount
  postcardStatuses: PostcardStatuses
}

const now = getCurrentDate()

const initialState: CalendarState = {
  lastViewedCalendarDate: {
    year: now.year,
    month: now.month,
  },
  dateListPanelOpen: false,
  cardPieListPanelOpen: false,
  historyListPanelOpen: false,
  historyListSelectedLocalId: null,
  openDayPanel: null,
  dateListSortDirection: 'asc',
  cardPieListSortDirection: 'asc',
  postcardStatusesCount: {
    cart: null,
    ready: null,
    sent: null,
    delivered: null,
    error: null,
  },
  postcardStatuses: {
    cart: true,
    ready: true,
    sent: true,
    delivered: true,
    error: true,
  },
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
        state.openDayPanel = null
        state.cardPieListPanelOpen = false
        state.historyListPanelOpen = false
      }
    },

    setCardPieListPanelOpen(state, action: PayloadAction<boolean>) {
      state.cardPieListPanelOpen = action.payload
      if (action.payload) {
        state.dateListPanelOpen = false
        state.historyListPanelOpen = false
        state.openDayPanel = null
      }
    },

    toggleDateListSortDirection(state) {
      state.dateListSortDirection =
        state.dateListSortDirection === 'asc' ? 'desc' : 'asc'
    },

    toggleCardPieListSortDirection(state) {
      state.cardPieListSortDirection =
        state.cardPieListSortDirection === 'asc' ? 'desc' : 'asc'
    },

    setPostcardStatusesCount(
      state,
      action: PayloadAction<PostcardStatusesCount>,
    ) {
      state.postcardStatusesCount = action.payload
    },

    setPostcardStatuses(state, action: PayloadAction<PostcardStatuses>) {
      console.log('setPostcardStatuses', action.payload)
      state.postcardStatuses = action.payload
    },

    setHistoryListPanelOpen(state, action: PayloadAction<boolean>) {
      state.historyListPanelOpen = action.payload
      state.historyListSelectedLocalId = null
      if (action.payload) {
        state.dateListPanelOpen = false
        state.openDayPanel = null
      }
    },

    setHistoryListSelectedLocalId(state, action: PayloadAction<number | null>) {
      state.historyListSelectedLocalId = action.payload
    },
  },
})

export const {
  updateLastViewedCalendarDate,
  openDayPanel,
  closeDayPanel,
  setDateListPanelOpen,
  setCardPieListPanelOpen,
  toggleDateListSortDirection,
  toggleCardPieListSortDirection,
  setPostcardStatusesCount,
  setPostcardStatuses,
  setHistoryListPanelOpen,
  setHistoryListSelectedLocalId,
} = calendarSlice.actions
export default calendarSlice.reducer
