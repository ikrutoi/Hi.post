import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { DraftLayoutState } from '../../domain/layoutTypes'

const initialState: DraftLayoutState['buttons'] = {
  isVisible: true,
  isLocked: false,
}

export const fullCardButtonsSlice = createSlice({
  name: 'buttons',
  initialState,
  reducers: {
    setButtonsVisibility(state, action: PayloadAction<boolean>) {
      state.isVisible = action.payload
    },
    setButtonsLock(state, action: PayloadAction<boolean>) {
      state.isLocked = action.payload
    },
  },
})

export const fullCardButtonsActions = fullCardButtonsSlice.actions
export default fullCardButtonsSlice.reducer
