import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type {
  DispatchDate,
  SelectedDispatchDate,
} from '@entities/date/domain/types'

const initialState: SelectedDispatchDate = null

const dateSlice = createSlice({
  name: 'date',
  initialState,
  reducers: {
    updateDispatchDate: (_state, action: PayloadAction<DispatchDate>) =>
      action.payload,
    resetDispatchDate: () => null,
  },
} as {
  name: string
  initialState: SelectedDispatchDate
  reducers: {
    updateDispatchDate: (
      state: SelectedDispatchDate,
      action: PayloadAction<DispatchDate>
    ) => SelectedDispatchDate
    resetDispatchDate: () => SelectedDispatchDate
  }
})

export const { updateDispatchDate, resetDispatchDate } = dateSlice.actions
export default dateSlice.reducer
