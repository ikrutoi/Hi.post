import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AromaState, AromaItem } from '@entities/aroma/domain/types'

const initialState: AromaState = {
  selected: null,
}

const aromaSlice = createSlice({
  name: 'aroma',
  initialState,
  reducers: {
    updateAroma: (state, action: PayloadAction<AromaItem | null>) => {
      state.selected = action.payload
    },
    resetAroma: (state) => {
      state.selected = null
    },
  },
})

export const { updateAroma, resetAroma } = aromaSlice.actions
export default aromaSlice.reducer
