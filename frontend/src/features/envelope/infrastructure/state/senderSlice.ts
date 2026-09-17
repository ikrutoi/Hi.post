import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { initialSection } from '../../addressForm/domain/models'
import type { AddressFields } from '@shared/config/constants'
import type {
  SenderState,
  SenderView,
  SenderSortOptions,
} from '../../domain/types'
import type { AddressSaveRequestedPayload } from '../../domain/types/addressSave.types'

const DEFAULT_SENDER_SORT_OPTIONS: SenderSortOptions = {
  sortedBy: 'name',
  direction: 'asc',
}

export const initialSender: SenderState = {
  currentView: 'senderView',
  formDraft: { ...initialSection.data },
  viewDraft: { ...initialSection.data },
  formIsComplete: false,
  formIsEmpty: true,
  sortOptions: DEFAULT_SENDER_SORT_OPTIONS,
  senderViewId: null,
  applied: [],
  appliedData: null,
  appliedLocked: false,
  enabled: false,
}

/**
 * Sender is retired: keep action types for leftover sagas, ignore payloads.
 */
const senderSlice = createSlice({
  name: 'sender',
  initialState: initialSender,
  reducers: {
    updateSenderField: {
      reducer: () => initialSender,
      prepare: (payload: { field: keyof AddressFields; value: string }) => ({
        payload,
      }),
    },
    setEnabled: {
      reducer: () => initialSender,
      prepare: (payload: boolean) => ({ payload }),
    },
    restoreSender: {
      reducer: () => initialSender,
      prepare: (payload: Partial<SenderState>) => ({ payload }),
    },
    clearSender: () => initialSender,
    setSenderAppliedIds: {
      reducer: () => initialSender,
      prepare: (payload: string[]) => ({ payload }),
    },
    setSenderAppliedWithData: {
      reducer: () => initialSender,
      prepare: (payload: { ids: string[]; data: AddressFields[] }) => ({
        payload,
      }),
    },
    setSenderApplied: {
      reducer: () => initialSender,
      prepare: (payload: boolean) => ({ payload }),
    },
    setSenderAppliedData: {
      reducer: () => initialSender,
      prepare: (payload: AddressFields | null) => ({ payload }),
    },
    setSenderView: {
      reducer: () => initialSender,
      prepare: (payload: SenderView) => ({ payload }),
    },
    setSenderViewId: {
      reducer: () => initialSender,
      prepare: (payload: string | null) => ({ payload }),
    },
    clearSenderFormData: () => initialSender,
    setSenderFormDraft: {
      reducer: () => initialSender,
      prepare: (payload: AddressFields) => ({ payload }),
    },
    clearSenderViewDraft: () => initialSender,
    setSenderViewDraft: {
      reducer: () => initialSender,
      prepare: (payload: AddressFields) => ({ payload }),
    },
    toggleSenderSortDirection: () => initialSender,
    saveAddressRequested: {
      reducer: () => initialSender,
      prepare: (payload?: AddressSaveRequestedPayload) => ({ payload }),
    },
  },
})

export const {
  updateSenderField,
  setEnabled,
  restoreSender,
  clearSender,
  setSenderAppliedIds,
  setSenderAppliedWithData,
  setSenderApplied,
  setSenderAppliedData,
  setSenderView,
  setSenderViewId,
  clearSenderFormData,
  setSenderFormDraft,
  clearSenderViewDraft,
  setSenderViewDraft,
  toggleSenderSortDirection,
  saveAddressRequested,
} = senderSlice.actions
export default senderSlice.reducer
