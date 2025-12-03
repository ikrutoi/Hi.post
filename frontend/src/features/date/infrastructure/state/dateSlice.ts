import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { DateState, DispatchDate } from '@entities/date/domain/types'

const initialState: DateState = {
  selectedDate: null,
  isComplete: false,
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
  },
})

export const { setDate, clearDate } = dateSlice.actions
export default dateSlice.reducer
