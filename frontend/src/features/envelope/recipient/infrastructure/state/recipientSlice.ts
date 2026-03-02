import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { initialSection } from '../../../addressForm/domain/models'
import type { AddressFields } from '@shared/config/constants'
import type {
  RecipientState,
  RecipientView,
  RecipientMode,
} from '../../domain/types'

export const initialRecipient: RecipientState = {
  currentView: 'addressFormRecipientView',
  addressFormData: { ...initialSection.data },
  addressFormIsComplete: false,
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
      state.addressFormData[action.payload.field] = action.payload.value
      state.addressFormIsComplete = isComplete(state.addressFormData)
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
      if (action.payload) state.currentView = 'recipientsView'
      else state.currentView = 'recipientView'
    },

    setRecipientMode: (state, action: PayloadAction<RecipientMode>) => {
      state.mode = action.payload
      if (action.payload === 'recipients') state.currentView = 'recipientsView'
      else state.currentView = 'recipientView'
    },

    clearRecipient: () => initialRecipient,

    resetRecipientForm: (state) => {
      state.currentView = 'addressFormRecipientView'
      state.addressFormData = { ...initialSection.data }
      state.addressFormIsComplete = false
    },

    setRecipientAppliedIds: (state, action: PayloadAction<string[]>) => {
      state.applied = action.payload
    },

    setRecipientApplied: (state, action: PayloadAction<boolean>) => {
      if (!action.payload) state.applied = []
    },

    setRecipientView: (state, action: PayloadAction<RecipientView>) => {
      state.currentView = action.payload
    },

    setRecipientViewId: (state, action: PayloadAction<string | null>) => {
      state.recipientViewId = action.payload
    },

    setRecipientsViewIds: (state, action: PayloadAction<string[]>) => {
      state.recipientsViewIds = action.payload
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
  setRecipientAppliedIds,
  setRecipientApplied,
  setRecipientView,
  setRecipientViewId,
  setRecipientsViewIds,
  saveAddressRequested,
} = recipientSlice.actions
export default recipientSlice.reducer
