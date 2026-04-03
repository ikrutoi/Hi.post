import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type {
  DateState,
  DispatchDate,
  FirstDayOfWeekPreference,
} from '@entities/date/domain/types'

const initialState: DateState = {
  selectedDate: null,
  selectedDates: [],
  isComplete: false,
  firstDayOfWeek: 'Sun',
}

export const dateSlice = createSlice({
  name: 'date',
  initialState,
  reducers: {
    setDate(state, action: PayloadAction<DispatchDate>) {
      state.selectedDate = action.payload
      state.selectedDates = []
      state.isComplete = true
    },
    setSelectedDates(state, action: PayloadAction<DispatchDate[]>) {
      state.selectedDates = action.payload
      state.isComplete =
        action.payload.length > 0 || state.selectedDate != null
    },
    clearDate(state) {
      state.selectedDate = null
      state.selectedDates = []
      state.isComplete = false
    },
    setFirstDayOfWeek(state, action: PayloadAction<FirstDayOfWeekPreference>) {
      state.firstDayOfWeek = action.payload
    },
    hydrateDateFromSession(state, action: PayloadAction<DateState>) {
      const s = action.payload
      state.selectedDate = s.selectedDate ?? null
      state.selectedDates = Array.isArray(s.selectedDates) ? s.selectedDates : []
      state.isComplete = s.isComplete ?? false
      state.firstDayOfWeek = s.firstDayOfWeek ?? 'Sun'
    },
  },
})

export const {
  setDate,
  setSelectedDates,
  clearDate,
  setFirstDayOfWeek,
  hydrateDateFromSession,
} = dateSlice.actions
export default dateSlice.reducer
