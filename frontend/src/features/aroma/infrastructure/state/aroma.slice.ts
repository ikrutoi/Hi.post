import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AromaState, AromaItem } from '@entities/aroma/domain/types'

const initialState: AromaState = {
  selectedAroma: null,
}

export const aromaSlice = createSlice({
  name: 'aroma',
  initialState,
  reducers: {
    setAroma(state, action: PayloadAction<AromaItem>) {
      state.selectedAroma = action.payload
    },
    clearAroma(state) {
      state.selectedAroma = null
    },
  },
})

export const { setAroma, clearAroma } = aromaSlice.actions
export default aromaSlice.reducer
