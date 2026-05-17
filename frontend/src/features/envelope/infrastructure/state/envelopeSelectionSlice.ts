import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { PanelDensity2Size } from '@shared/ui/icons'
import type { AddressBookMode } from '../../addressBook/domain/types'

export type RecipientViewEditModePayload =
  | boolean
  | { enabled: boolean; keepRecipientView?: boolean }

export interface EnvelopeSelectionState {
  recipientsPendingIds: string[]
  activeAddressList: AddressBookMode | null
  recipientListPanelOpen: boolean
  senderListPanelOpen: boolean
  senderViewEditMode: boolean
  recipientViewEditMode: boolean
  showAddressFormView: boolean
  addressFormViewRole: 'sender' | 'recipient' | null
  /** Плотность строк в панели адресной книги (`panelDensity2`): 1 — крупнее, 2 — компактнее. */
  addressListPanelDensity: PanelDensity2Size
}

const initialState: EnvelopeSelectionState = {
  recipientsPendingIds: [],
  activeAddressList: null,
  recipientListPanelOpen: false,
  senderListPanelOpen: false,
  senderViewEditMode: false,
  recipientViewEditMode: false,
  showAddressFormView: false,
  addressFormViewRole: null,
  addressListPanelDensity: 1,
}

export const envelopeSelectionSlice = createSlice({
  name: 'envelopeSelection',
  initialState,
  reducers: {
    toggleRecipientSelection(state, action: PayloadAction<string>) {
      const id = action.payload
      const idx = state.recipientsPendingIds.indexOf(id)
      if (idx === -1) {
        state.recipientsPendingIds.push(id)
      } else {
        state.recipientsPendingIds.splice(idx, 1)
      }
    },

    setRecipientsPendingIds(state, action: PayloadAction<string[]>) {
      state.recipientsPendingIds = action.payload
    },

    clearRecipientsPending(state) {
      state.recipientsPendingIds = []
    },

    setActiveAddressList(state, action: PayloadAction<AddressBookMode | null>) {
      const mode = action.payload
      state.activeAddressList = mode
      state.senderListPanelOpen = mode === 'sender'
      state.recipientListPanelOpen = mode === 'recipients'
    },

    closeAddressList(state) {
      state.activeAddressList = null
      state.senderListPanelOpen = false
      state.recipientListPanelOpen = false
    },

    setSenderViewEditMode(state, action: PayloadAction<boolean>) {
      state.senderViewEditMode = action.payload
    },

    setRecipientViewEditMode(
      state,
      action: PayloadAction<RecipientViewEditModePayload>,
    ) {
      const payload =
        typeof action.payload === 'boolean'
          ? { enabled: action.payload }
          : action.payload
      state.recipientViewEditMode = payload.enabled
    },

    setAddressFormView(
      state,
      action: PayloadAction<{
        show: boolean
        role: 'sender' | 'recipient' | null
      }>,
    ) {
      state.showAddressFormView = action.payload.show
      state.addressFormViewRole = action.payload.role
    },

    addressSaveSuccess() {},

    cycleAddressListPanelDensity(state) {
      state.addressListPanelDensity =
        state.addressListPanelDensity === 1 ? 2 : 1
    },

    setAddressListPanelDensity(
      state,
      action: PayloadAction<PanelDensity2Size>,
    ) {
      state.addressListPanelDensity = action.payload
    },
  },
})

export const {
  toggleRecipientSelection,
  setRecipientsPendingIds,
  clearRecipientsPending,
  setActiveAddressList,
  closeAddressList,
  setSenderViewEditMode,
  setRecipientViewEditMode,
  setAddressFormView,
  addressSaveSuccess,
  cycleAddressListPanelDensity,
  setAddressListPanelDensity,
} = envelopeSelectionSlice.actions

export default envelopeSelectionSlice.reducer
