import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { EnvelopeState } from '../../domain/types'

const initialState: EnvelopeState = {
  sender: {
    enabled: true,
    isComplete: false,
  },
  recipient: {
    isComplete: false,
  },
  isComplete: false,
}

export const envelopeSlice = createSlice({
  name: 'envelope',
  initialState,
  reducers: {
    setComplete: (state, action: PayloadAction<boolean>) => {
      state.isComplete = action.payload
    },
  },
})

export const { setComplete } = envelopeSlice.actions
export default envelopeSlice.reducer
