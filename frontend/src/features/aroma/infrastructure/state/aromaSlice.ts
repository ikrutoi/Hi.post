import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AromaState, AromaItem } from '@entities/aroma/domain/types'
import { normalizeAromaItem } from '@entities/aroma/domain/types'

const initialState: AromaState = {
  selectedAroma: null,
  viewAroma: null,
  isComplete: false,
}

export const aromaSlice = createSlice({
  name: 'aroma',
  initialState,
  reducers: {
    setViewAroma(state, action: PayloadAction<AromaItem>) {
      state.viewAroma = normalizeAromaItem(action.payload)
    },

    setAroma(state, action: PayloadAction<AromaItem>) {
      const normalized = normalizeAromaItem(action.payload)
      state.selectedAroma = normalized
      state.viewAroma = normalized
      state.isComplete = true
    },

    clearViewAroma(state) {
      state.viewAroma = null
    },

    clearApplied(state) {
      state.selectedAroma = null
      state.isComplete = false
    },

    clear(state) {
      state.selectedAroma = null
      state.viewAroma = null
      state.isComplete = false
    },
  },
})

export const { setViewAroma, setAroma, clearViewAroma, clearApplied, clear } =
  aromaSlice.actions
export default aromaSlice.reducer
