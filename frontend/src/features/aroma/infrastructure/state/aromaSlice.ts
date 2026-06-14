import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AromaState, AromaItem, AromaSlot } from '@entities/aroma/domain/types'
import { aromaSlotOrder, normalizeAromaItem } from '@entities/aroma/domain/types'

const initialState: AromaState = {
  selectedAroma: null,
  isComplete: false,
  previewOpen: false,
  previewIndex: null,
}

export const aromaSlice = createSlice({
  name: 'aroma',
  initialState,
  reducers: {
    setAroma(state, action: PayloadAction<AromaItem>) {
      state.selectedAroma = normalizeAromaItem(action.payload)
      state.isComplete = true
    },

    openAromaPreview(state, action: PayloadAction<AromaSlot>) {
      state.previewOpen = true
      state.previewIndex = action.payload
    },

    closeAromaPreview(state) {
      state.previewOpen = false
      state.previewIndex = null
    },

    stepAromaPreview(state, action: PayloadAction<-1 | 1>) {
      if (!state.previewOpen || state.previewIndex == null) return
      const idx = aromaSlotOrder.indexOf(state.previewIndex)
      if (idx < 0) return
      const nextIdx =
        (idx + action.payload + aromaSlotOrder.length) % aromaSlotOrder.length
      state.previewIndex = aromaSlotOrder[nextIdx]!
    },

    clear(state) {
      state.selectedAroma = null
      state.isComplete = false
      state.previewOpen = false
      state.previewIndex = null
    },
  },
})

export const {
  setAroma,
  openAromaPreview,
  closeAromaPreview,
  stepAromaPreview,
  clear,
} = aromaSlice.actions
export default aromaSlice.reducer
