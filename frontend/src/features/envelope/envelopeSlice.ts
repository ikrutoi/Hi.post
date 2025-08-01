import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface EnvelopeState {
  items: string[]
  loading: boolean
  error: string | null
}

const initialState: EnvelopeState = {
  items: [],
  loading: false,
  error: null,
}

const envelopeSlice = createSlice({
  name: 'envelope',
  initialState,
  reducers: {
    startLoading(state) {
      state.loading = true
      state.error = null
    },
    setItems(state, action: PayloadAction<string[]>) {
      state.items = action.payload
      state.loading = false
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload
      state.loading = false
    },
  },
})

export const { startLoading, setItems, setError } = envelopeSlice.actions
export default envelopeSlice.reducer
