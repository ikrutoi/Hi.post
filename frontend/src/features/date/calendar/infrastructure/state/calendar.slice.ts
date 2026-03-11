import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getCurrentDate } from '@shared/utils/date'
import type { CalendarViewDate } from '@entities/date/domain/types'
import type { CardCalendarIndex } from '@entities/card/domain/types'
import type { DaysOfWeek } from '@entities/date/domain/types'

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
  /** Открыто кликом по дню недели (SAT и т.д.); повторный клик по тому же дню закрывает панель. */
  openedByWeekday?: DaysOfWeek
}

type CalendarState = {
  lastViewedCalendarDate: CalendarViewDate
  openDayPanel: DayPanelPayload | null
}

const now = getCurrentDate()

const initialState: CalendarState = {
  lastViewedCalendarDate: {
    year: now.year,
    month: now.month,
  },
  openDayPanel: null,
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
  },
})

export const { updateLastViewedCalendarDate, openDayPanel, closeDayPanel } =
  calendarSlice.actions
export default calendarSlice.reducer
