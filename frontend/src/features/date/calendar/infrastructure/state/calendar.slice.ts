import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type {
  CalendarViewDate,
  LastCalendarViewDate,
} from '@entities/date/domain/types'

type CalendarState = {
  lastViewedCalendarDate: CalendarViewDate | null
}

const initialState: CalendarState = {
  lastViewedCalendarDate: null,
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
    resetLastViewedCalendarDate(state) {
      state.lastViewedCalendarDate = null
    },
  },
})

export const { updateLastViewedCalendarDate, resetLastViewedCalendarDate } =
  calendarSlice.actions
export default calendarSlice.reducer
