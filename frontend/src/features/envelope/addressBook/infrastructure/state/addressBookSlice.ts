import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AddressBookEntry } from '../../domain/types'

export interface AddressBookState {
  senderEntries: AddressBookEntry[]
  recipientEntries: AddressBookEntry[]
}

const initialState: AddressBookState = {
  senderEntries: [],
  recipientEntries: [],
}

export const addressBookSlice = createSlice({
  name: 'addressBook',
  initialState,
  reducers: {
    setAddressBookEntries(
      state,
      action: PayloadAction<{
        sender?: AddressBookEntry[]
        recipient?: AddressBookEntry[]
      }>,
    ) {
      if (action.payload.sender !== undefined)
        state.senderEntries = action.payload.sender
      if (action.payload.recipient !== undefined)
        state.recipientEntries = action.payload.recipient
    },
  },
})

export const { setAddressBookEntries } = addressBookSlice.actions
export default addressBookSlice.reducer
