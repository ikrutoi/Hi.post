import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Address } from '../types/Address'

type Envelope = {
  sender: Address
  recipient: Address
}

const initialState: Envelope = {
  sender: { street: '', zip: '', city: '', country: '', name: '' },
  recipient: { street: '', zip: '', city: '', country: '', name: '' },
}

const envelopeSlice = createSlice({
  name: 'envelope',
  initialState,
  reducers: {
    setEnvelope: (state, action: PayloadAction<Partial<Envelope>>) => ({
      ...state,
      ...action.payload,
    }),
  },
})

export const { setEnvelope } = envelopeSlice.actions
export const envelopeReducer = envelopeSlice.reducer
