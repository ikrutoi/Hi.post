import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RecipientState } from '@envelope/domain/types'

const initialState: RecipientState[] = []

export const envelopeRecipientsSlice = createSlice({
  name: 'envelopeRecipients',
  initialState,
  reducers: {
    setRecipientsList: (_, action: PayloadAction<RecipientState[]>) =>
      action.payload,

    addRecipient: (state, action: PayloadAction<RecipientState>) => {
      state.push(action.payload)
    },

    removeRecipientAt: (state, action: PayloadAction<number>) => {
      const i = action.payload
      if (i >= 0 && i < state.length) state.splice(i, 1)
    },

    clearRecipientsList: () => initialState,
  },
})

export const {
  setRecipientsList,
  addRecipient,
  removeRecipientAt,
  clearRecipientsList,
} = envelopeRecipientsSlice.actions

export default envelopeRecipientsSlice.reducer
