import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { DraftLayoutState } from '../../domain/layoutTypes'

const initialState: DraftLayoutState['ui'] = {
  theme: 'light',
  layoutMode: 'default',
}

export const layoutUiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<'light' | 'dark'>) {
      state.theme = action.payload
    },
    setLayoutMode(state, action: PayloadAction<string>) {
      state.layoutMode = action.payload
    },
  },
})

export const layoutUiActions = layoutUiSlice.actions
export default layoutUiSlice.reducer
