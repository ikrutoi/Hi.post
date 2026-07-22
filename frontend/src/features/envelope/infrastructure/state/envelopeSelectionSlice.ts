import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { PanelDensity2Size } from '@shared/ui/icons'
import type { AddressFields } from '@shared/config/constants'
import type { AddressBookMode } from '../../addressBook/domain/types'
import type { AddressCreateEditContext, AddressEditSession } from '../../domain/types'
import type { SenderView } from '../../sender/domain/types'
import type {
  CurrentRecipientsList,
  RecipientView,
} from '../../recipient/domain/types'

/** @deprecated Используйте `closeAddressEditSession` / payload с `keepRecipientView`. */
export type RecipientViewEditModePayload =
  | boolean
  | { enabled: boolean; keepRecipientView?: boolean }

/** Preview selection while address template list is open (Apply commits, return reverts). */
export type AddressListPreviewSnapshot =
  | {
      mode: 'sender'
      sandbox: boolean
      senderViewId: string | null
      currentView: SenderView
      viewDraft: AddressFields
    }
  | {
      mode: 'recipients'
      sandbox: boolean
      pendingIds: string[]
      recipientsViewIdsFirstList: string[]
      recipientsViewIdsSecondList: string[]
      currentRecipientsList: CurrentRecipientsList
      recipientViewId: string | null
      currentView: RecipientView
      viewDraft: AddressFields
    }

export interface EnvelopeSelectionState {
  recipientsPendingIds: string[]
  activeAddressList: AddressBookMode | null
  recipientListPanelOpen: boolean
  senderListPanelOpen: boolean
  /** Активная сессия правки шаблона (одна на весь конверт). */
  activeAddressEdit: AddressEditSession | null
  /** Mobile: create-форма с данными существующего шаблона (не inline edit). */
  addressCreateEditContext: AddressCreateEditContext | null
  showAddressFormView: boolean
  addressFormViewRole: 'sender' | 'recipient' | null
  /** Плотность панели списка отправителя (`panelDensity2`). */
  senderAddressListPanelDensity: PanelDensity2Size
  /** Плотность панели списка получателей (`panelDensity2`). */
  recipientAddressListPanelDensity: PanelDensity2Size
  /** @deprecated Раньше одно значение на оба списка; читается при миграции. */
  addressListPanelDensity?: PanelDensity2Size
  /** Mobile: increment to clear address-view focus (CardPie / navigation). */
  mobileAddressFocusClearSeq: number
  /** State before opening address template list — restored on return without Apply. */
  addressListPreviewSnapshot: AddressListPreviewSnapshot | null
}

const initialState: EnvelopeSelectionState = {
  recipientsPendingIds: [],
  activeAddressList: null,
  recipientListPanelOpen: false,
  senderListPanelOpen: false,
  activeAddressEdit: null,
  addressCreateEditContext: null,
  showAddressFormView: false,
  addressFormViewRole: null,
  senderAddressListPanelDensity: 1,
  recipientAddressListPanelDensity: 1,
  mobileAddressFocusClearSeq: 0,
  addressListPreviewSnapshot: null,
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

    /** Sets pending ids without syncing recipient view (list preview cancel). */
    restoreRecipientsPendingIds(state, action: PayloadAction<string[]>) {
      state.recipientsPendingIds = action.payload
    },

    setAddressListPreviewSnapshot(
      state,
      action: PayloadAction<AddressListPreviewSnapshot | null>,
    ) {
      state.addressListPreviewSnapshot = action.payload
    },

    clearAddressListPreviewSnapshot(state) {
      state.addressListPreviewSnapshot = null
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

    /** Mobile CardPie / chrome: leave focused address view without opening lists. */
    requestClearMobileAddressFocus(state) {
      state.mobileAddressFocusClearSeq += 1
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

    setAddressCreateEditContext(
      state,
      action: PayloadAction<AddressCreateEditContext | null>,
    ) {
      state.addressCreateEditContext = action.payload
    },

    clearAddressCreateEditContext(state) {
      state.addressCreateEditContext = null
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

    /** Триггер saga: подтянуть формы отправителя/получателей из applied (клик минисекции Конверт). */
    syncEnvelopeFormsFromAppliedRequested(_state) {},
  },
})

export const {
  toggleRecipientSelection,
  setRecipientsPendingIds,
  clearRecipientsPending,
  restoreRecipientsPendingIds,
  setAddressListPreviewSnapshot,
  clearAddressListPreviewSnapshot,
  setActiveAddressList,
  closeAddressList,
  requestClearMobileAddressFocus,
  openAddressEditSession,
  closeAddressEditSession,
  setAddressCreateEditContext,
  clearAddressCreateEditContext,
  updateAddressEditDraftField,
  setAddressFormView,
  addressSaveSuccess,
  cycleSenderAddressListPanelDensity,
  cycleRecipientAddressListPanelDensity,
  setSenderAddressListPanelDensity,
  setRecipientAddressListPanelDensity,
  syncEnvelopeFormsFromAppliedRequested,
} = envelopeSelectionSlice.actions

export default envelopeSelectionSlice.reducer
