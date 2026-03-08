import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AddressBookEntry, AddressBookMode } from '../../domain/types'

export interface AddressBookState {
  senderEntries: AddressBookEntry[]
  recipientEntries: AddressBookEntry[]
  mode: AddressBookMode | null
}

const initialState: AddressBookState = {
  senderEntries: [],
  recipientEntries: [],
  mode: null,
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

    addAddressBookEntry(state, action: PayloadAction<AddressBookEntry>) {
      const entry = action.payload
      if (entry.role === 'sender') {
        if (!state.senderEntries.some((e) => e.id === entry.id)) {
          state.senderEntries.push(entry)
        }
      } else {
        if (!state.recipientEntries.some((e) => e.id === entry.id)) {
          state.recipientEntries.push(entry)
        }
      }
    },

    removeAddressBookEntry(
      state,
      action: PayloadAction<{ id: string; role: 'sender' | 'recipient' }>,
    ) {
      const { id, role } = action.payload
      if (role === 'sender') {
        state.senderEntries = state.senderEntries.filter((e) => e.id !== id)
      } else {
        state.recipientEntries = state.recipientEntries.filter(
          (e) => e.id !== id,
        )
      }
    },

    setAddressBookMode(state, action: PayloadAction<AddressBookMode | null>) {
      state.mode = action.payload
    },
  },
})

export const {
  setAddressBookEntries,
  addAddressBookEntry,
  removeAddressBookEntry,
  setAddressBookMode,
} = addressBookSlice.actions
export default addressBookSlice.reducer
