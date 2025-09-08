import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AromaState, AromaItem } from '../../domain/aromaTypes'

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
  },
})

export const { updateAroma } = aromaSlice.actions
export default aromaSlice.reducer
