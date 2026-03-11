import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { initialSection } from '../../../addressForm/domain/models'
import type { AddressFields } from '@shared/config/constants'
import type {
  SenderState,
  SenderView,
  SenderSortOptions,
} from '../../domain/types'
import type { ListStatus } from '@entities/envelope/domain/types'

const DEFAULT_SENDER_SORT_OPTIONS: SenderSortOptions = {
  sortedBy: 'name',
  direction: 'asc',
}

function isFormDraftEmpty(data: AddressFields): boolean {
  return !Object.values(data).some((v) => (v ?? '').trim() !== '')
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
  enabled: true,
}

function isComplete(data: AddressFields): boolean {
  return Object.values(data).every((val) => val.trim() !== '')
}

const senderSlice = createSlice({
  name: 'sender',
  initialState: initialSender,
  reducers: {
    updateSenderField: (
      state,
      action: PayloadAction<{ field: keyof AddressFields; value: string }>,
    ) => {
      const { field, value } = action.payload
      if (state.currentView === 'addressFormSenderView') {
        state.formDraft[field] = value
        state.formIsComplete = isComplete(state.formDraft)
      } else {
        state.viewDraft[field] = value
        state.formIsComplete = isComplete(state.viewDraft)
      }
    },

    setEnabled: (state, action: PayloadAction<boolean>) => {
      state.enabled = action.payload
    },

    restoreSender: (state, action: PayloadAction<Partial<SenderState>>) => {
      return {
        ...initialSender,
        ...action.payload,
      }
    },

    clearSender: () => initialSender,

    setSenderAppliedIds: (state, action: PayloadAction<string[]>) => {
      state.applied = action.payload
    },

    setSenderAppliedWithData: (
      state,
      action: PayloadAction<{ ids: string[]; data: AddressFields[] }>,
    ) => {
      state.applied = action.payload.ids
      state.appliedData =
        action.payload.data.length === 1 ? action.payload.data[0] : null
    },

    setSenderApplied: (state, action: PayloadAction<boolean>) => {
      if (!action.payload) {
        state.applied = []
        state.appliedData = null
      }
    },

    setSenderAppliedData: (
      state,
      action: PayloadAction<AddressFields | null>,
    ) => {
      state.appliedData = action.payload
    },

    setSenderView: (state, action: PayloadAction<SenderView>) => {
      const nextView = action.payload
      if (nextView !== 'addressFormSenderView') {
        state.formIsEmpty = isFormDraftEmpty(state.formDraft)
      }
      state.currentView = nextView
    },

    setSenderViewId: (state, action: PayloadAction<string | null>) => {
      state.senderViewId = action.payload
    },

    clearSenderFormData(state) {
      state.formDraft = { ...initialSection.data }
      state.formIsComplete = false
      state.formIsEmpty = true
    },

    toggleSenderSortDirection(state) {
      state.sortOptions.direction =
        state.sortOptions.direction === 'asc' ? 'desc' : 'asc'
    },

    saveAddressRequested: (
      _state,
      _action: PayloadAction<{ listStatus?: ListStatus } | undefined>,
    ) => {},
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
  toggleSenderSortDirection,
  saveAddressRequested,
} = senderSlice.actions
export default senderSlice.reducer
