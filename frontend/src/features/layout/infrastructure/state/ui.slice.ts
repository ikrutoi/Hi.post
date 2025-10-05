import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { UiState } from '../../domain/types'

const initialState: UiState = {
  isLoading: false,
  error: null,
  buttonsVisible: true,
  buttonsLocked: false,
  theme: 'light',
  layoutMode: 'default',
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
    setButtonsVisibility(state, action: PayloadAction<boolean>) {
      state.buttonsVisible = action.payload
    },
    setButtonsLock(state, action: PayloadAction<boolean>) {
      state.buttonsLocked = action.payload
    },
    setTheme(state, action: PayloadAction<'light' | 'dark'>) {
      state.theme = action.payload
    },
    setLayoutMode(state, action: PayloadAction<string>) {
      state.layoutMode = action.payload
    },
  },
})

export const {
  setLoading,
  setError,
  setButtonsVisibility,
  setButtonsLock,
  setTheme,
  setLayoutMode,
} = uiSlice.actions

export default uiSlice.reducer
