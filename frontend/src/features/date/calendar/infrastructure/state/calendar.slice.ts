import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getCurrentDate } from '@shared/utils/date'
import type { CalendarViewDate } from '@entities/date/domain/types'

type CalendarState = {
  lastViewedCalendarDate: CalendarViewDate
}

const now = getCurrentDate()

const initialState: CalendarState = {
  lastViewedCalendarDate: {
    year: now.year,
    month: now.month,
  },
}

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    updateLastViewedCalendarDate(
      state,
      action: PayloadAction<CalendarViewDate>
    ) {
      state.lastViewedCalendarDate = action.payload
    },
  },
})

export const { updateLastViewedCalendarDate } = calendarSlice.actions
export default calendarSlice.reducer
