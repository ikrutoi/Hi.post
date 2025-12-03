import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AromaState, AromaItem } from '@entities/aroma/domain/types'

const initialState: AromaState = {
  selectedAroma: null,
  isComplete: false,
}

export const aromaSlice = createSlice({
  name: 'aroma',
  initialState,
  reducers: {
    setAroma(state, action: PayloadAction<AromaItem>) {
      state.selectedAroma = action.payload
      state.isComplete = true
    },
    clearAroma(state) {
      state.selectedAroma = null
      state.isComplete = false
    },
  },
})

export const { setAroma, clearAroma } = aromaSlice.actions
export default aromaSlice.reducer
