import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { EnvelopeAddresses } from '@features/envelope/types'
import { initialAddress } from '@features/envelope/types'

interface EnvelopeState {
  addresses: EnvelopeAddresses
  loading: boolean
  error: string | null
}

const initialState: EnvelopeState = {
  addresses: {
    sender: initialAddress,
    recipient: initialAddress,
  },
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
    setAddresses(state, action: PayloadAction<EnvelopeAddresses>) {
      state.addresses = action.payload
      state.loading = false
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload
      state.loading = false
    },
  },
})

export const { startLoading, setAddresses, setError } = envelopeSlice.actions
export default envelopeSlice.reducer
