import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type {
  DateState,
  DispatchDate,
  FirstDayOfWeekPreference,
} from '@entities/date/domain/types'

const initialState: DateState = {
  selectedDate: null,
  isComplete: false,
  firstDayOfWeek: 'Sun',
}

export const dateSlice = createSlice({
  name: 'date',
  initialState,
  reducers: {
    setDate(state, action: PayloadAction<DispatchDate>) {
      state.selectedDate = action.payload
      state.isComplete = true
    },
    clearDate(state) {
      state.selectedDate = null
      state.isComplete = false
    },
    setFirstDayOfWeek(state, action: PayloadAction<FirstDayOfWeekPreference>) {
      state.firstDayOfWeek = action.payload
    },
  },
})

export const { setDate, clearDate, setFirstDayOfWeek } = dateSlice.actions
export default dateSlice.reducer
