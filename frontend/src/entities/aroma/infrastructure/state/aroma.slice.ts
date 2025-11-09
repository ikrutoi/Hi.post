import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AromaState, AromaItem } from '../../domain/types'

const initialState: AromaState = {
  aroma: null,
}

export const aromaSlice = createSlice({
  name: 'aroma',
  initialState,
  reducers: {
    setAroma(state, action: PayloadAction<AromaItem>) {
      state.aroma = action.payload
    },
    clearAroma(state) {
      state.aroma = null
    },
  },
})

export const { setAroma, clearAroma } = aromaSlice.actions
export default aromaSlice.reducer
