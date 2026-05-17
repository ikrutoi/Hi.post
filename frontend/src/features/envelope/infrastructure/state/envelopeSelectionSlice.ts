import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { PanelDensity2Size } from '@shared/ui/icons'
import type { AddressFields } from '@shared/config/constants'
import type { AddressBookMode } from '../../addressBook/domain/types'
import type { AddressEditSession } from '../../domain/types'

/** @deprecated Используйте `closeAddressEditSession` / payload с `keepRecipientView`. */
export type RecipientViewEditModePayload =
  | boolean
  | { enabled: boolean; keepRecipientView?: boolean }

export interface EnvelopeSelectionState {
  recipientsPendingIds: string[]
  activeAddressList: AddressBookMode | null
  recipientListPanelOpen: boolean
  senderListPanelOpen: boolean
  /** Активная сессия правки шаблона (одна на весь конверт). */
  activeAddressEdit: AddressEditSession | null
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
  activeAddressEdit: null,
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

    openAddressEditSession(state, action: PayloadAction<AddressEditSession>) {
      state.activeAddressEdit = action.payload
    },

    closeAddressEditSession(
      state,
      _action: PayloadAction<
        { role?: 'sender' | 'recipient'; keepRecipientView?: boolean } | undefined
      >,
    ) {
      state.activeAddressEdit = null
    },

    updateAddressEditDraftField(
      state,
      action: PayloadAction<{
        field: keyof AddressFields
        value: string
      }>,
    ) {
      const session = state.activeAddressEdit
      if (!session) return
      session.draft[action.payload.field] = action.payload.value
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
  openAddressEditSession,
  closeAddressEditSession,
  updateAddressEditDraftField,
  setAddressFormView,
  addressSaveSuccess,
  cycleAddressListPanelDensity,
  setAddressListPanelDensity,
} = envelopeSelectionSlice.actions

export default envelopeSelectionSlice.reducer
