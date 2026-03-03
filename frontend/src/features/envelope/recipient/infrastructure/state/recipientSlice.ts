import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { initialSection } from '../../../addressForm/domain/models'
import type { AddressFields } from '@shared/config/constants'
import type {
  RecipientState,
  RecipientView,
  RecipientMode,
  SortOptions,
} from '../../domain/types'

const DEFAULT_SORT_OPTIONS: SortOptions = {
  sortedBy: 'name',
  direction: 'asc',
}

function isFormDraftEmpty(data: AddressFields): boolean {
  return !Object.values(data).some((v) => (v ?? '').trim() !== '')
}

export const initialRecipient: RecipientState = {
  currentView: 'addressFormRecipientView',
  formDraft: { ...initialSection.data },
  viewDraft: { ...initialSection.data },
  formIsComplete: false,
  formIsEmpty: true,
  sortOptions: DEFAULT_SORT_OPTIONS,
  recipientViewId: null,
  recipientsViewIds: [],
  applied: [],
  mode: 'recipient',
}

function isComplete(data: AddressFields): boolean {
  return Object.values(data).every((val) => val.trim() !== '')
}

const recipientSlice = createSlice({
  name: 'recipient',
  initialState: initialRecipient,
  reducers: {
    updateRecipientField: (
      state,
      action: PayloadAction<{ field: keyof AddressFields; value: string }>,
    ) => {
      const { field, value } = action.payload
      if (state.currentView === 'addressFormRecipientView') {
        state.formDraft[field] = value
        state.formIsComplete = isComplete(state.formDraft)
      } else {
        state.viewDraft[field] = value
        state.formIsComplete = isComplete(state.viewDraft)
      }
    },

    restoreRecipient: (
      state,
      action: PayloadAction<Partial<RecipientState>>,
    ) => {
      return {
        ...initialRecipient,
        ...action.payload,
      }
    },

    setEnabled: (state, action: PayloadAction<boolean>) => {
      state.mode = action.payload ? 'recipients' : 'recipient'
      if (action.payload) {
        state.currentView = 'recipientsView'
      } else {
        state.currentView = 'recipientView'
      }
      state.formIsEmpty = isFormDraftEmpty(state.formDraft)
    },

    setRecipientMode: (state, action: PayloadAction<RecipientMode>) => {
      state.mode = action.payload
      if (action.payload === 'recipients') {
        state.currentView = 'recipientsView'
      } else {
        state.currentView = 'recipientView'
      }
      state.formIsEmpty = isFormDraftEmpty(state.formDraft)
    },

    clearRecipient: () => initialRecipient,

    resetRecipientForm: (state) => {
      state.currentView = 'addressFormRecipientView'
      state.formDraft = { ...initialSection.data }
      state.formIsComplete = false
      state.formIsEmpty = true
    },

    clearRecipientFormData(state) {
      state.formDraft = { ...initialSection.data }
      state.formIsComplete = false
      state.formIsEmpty = true
    },

    setRecipientAppliedIds: (state, action: PayloadAction<string[]>) => {
      state.applied = action.payload
    },

    setRecipientApplied: (state, action: PayloadAction<boolean>) => {
      if (!action.payload) state.applied = []
    },

    setRecipientView: (state, action: PayloadAction<RecipientView>) => {
      const nextView = action.payload
      if (nextView !== 'addressFormRecipientView') {
        state.formIsEmpty = isFormDraftEmpty(state.formDraft)
      }
      state.currentView = nextView
    },

    setRecipientViewId: (state, action: PayloadAction<string | null>) => {
      state.recipientViewId = action.payload
    },

    setRecipientsViewIds: (state, action: PayloadAction<string[]>) => {
      state.recipientsViewIds = action.payload
    },

    toggleRecipientSortDirection(state) {
      state.sortOptions.direction =
        state.sortOptions.direction === 'asc' ? 'desc' : 'asc'
    },

    saveAddressRequested: () => {},
  },
})

export const {
  updateRecipientField,
  setEnabled,
  setRecipientMode,
  restoreRecipient,
  clearRecipient,
  resetRecipientForm,
  clearRecipientFormData,
  setRecipientAppliedIds,
  setRecipientApplied,
  setRecipientView,
  setRecipientViewId,
  setRecipientsViewIds,
  toggleRecipientSortDirection,
  saveAddressRequested,
} = recipientSlice.actions
export default recipientSlice.reducer
