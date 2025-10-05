import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { DispatchDate } from '@entities/date/domain/types'

const initialState: DispatchDate = { isSelected: false }

const dateSlice = createSlice({
  name: 'date',
  initialState,
  reducers: {
    updateDispatchDate: (state, action: PayloadAction<DispatchDate>) => {
      Object.assign(state, action.payload)
    },
  },
})

export const { updateDispatchDate } = dateSlice.actions
export default dateSlice.reducer
