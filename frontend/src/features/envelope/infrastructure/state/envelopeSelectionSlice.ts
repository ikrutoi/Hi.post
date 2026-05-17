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
  /** Плотность панели списка отправителя (`panelDensity2`). */
  senderAddressListPanelDensity: PanelDensity2Size
  /** Плотность панели списка получателей (`panelDensity2`). */
  recipientAddressListPanelDensity: PanelDensity2Size
  /** @deprecated Раньше одно значение на оба списка; читается при миграции. */
  addressListPanelDensity?: PanelDensity2Size
}

const initialState: EnvelopeSelectionState = {
  recipientsPendingIds: [],
  activeAddressList: null,
  recipientListPanelOpen: false,
  senderListPanelOpen: false,
  activeAddressEdit: null,
  showAddressFormView: false,
  addressFormViewRole: null,
  senderAddressListPanelDensity: 1,
  recipientAddressListPanelDensity: 1,
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

    cycleSenderAddressListPanelDensity(state) {
      state.senderAddressListPanelDensity =
        state.senderAddressListPanelDensity === 1 ? 2 : 1
    },

    cycleRecipientAddressListPanelDensity(state) {
      state.recipientAddressListPanelDensity =
        state.recipientAddressListPanelDensity === 1 ? 2 : 1
    },

    setSenderAddressListPanelDensity(
      state,
      action: PayloadAction<PanelDensity2Size>,
    ) {
      state.senderAddressListPanelDensity = action.payload
    },

    setRecipientAddressListPanelDensity(
      state,
      action: PayloadAction<PanelDensity2Size>,
    ) {
      state.recipientAddressListPanelDensity = action.payload
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
  cycleSenderAddressListPanelDensity,
  cycleRecipientAddressListPanelDensity,
  setSenderAddressListPanelDensity,
  setRecipientAddressListPanelDensity,
} = envelopeSelectionSlice.actions

export default envelopeSelectionSlice.reducer
