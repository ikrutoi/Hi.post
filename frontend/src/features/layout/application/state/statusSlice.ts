import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { DraftLayoutState } from '../../domain/types/layout.types'

const initialState: DraftLayoutState['status'] = {
  isLoading: false,
  error: null,
}

export const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
  },
})

export const statusActions = statusSlice.actions
export default statusSlice.reducer
