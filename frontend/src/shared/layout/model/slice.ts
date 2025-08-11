import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface LayoutState {
  savedCardId: string | null
}

const initialState: LayoutState = {
  savedCardId: null,
}

const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    setSavedCardId(state, action: PayloadAction<string | null>) {
      state.savedCardId = action.payload
    },
    clearSavedCardId(state) {
      state.savedCardId = null
    },
  },
})

export const { setSavedCardId, clearSavedCardId } = layoutSlice.actions
export default layoutSlice.reducer
