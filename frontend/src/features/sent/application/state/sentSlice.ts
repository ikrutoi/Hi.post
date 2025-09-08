import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Sent, SentPostcard } from '../../domain/sentModel'

const initialState: Sent = []

const sentSlice = createSlice({
  name: 'sent',
  initialState,
  reducers: {
    setSentCards(state, action: PayloadAction<Sent>) {
      return action.payload
    },
    addSentCard(state, action: PayloadAction<SentPostcard>) {
      state.push(action.payload)
    },
    clearSentCards() {
      return []
    },
  },
})

export const sentActions = sentSlice.actions
export default sentSlice.reducer
