import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { initialSection } from '../../../addressForm/domain/models'
import type { AddressFields } from '@shared/config/constants'
import type {
  RecipientState,
  RecipientView,
  RecipientMode,
  SortOptions,
  CurrentRecipientsList,
} from '../../domain/types'
import type { ListStatus } from '@entities/envelope/domain/types'

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
  recipientsViewSortDirection: 'asc',
  recipientViewId: null,
  recipientsViewIdsFirstList: [],
  recipientsViewIdsSecondList: [],
  currentRecipientsList: 'first',
  applied: [],
  appliedData: null,
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
        state.recipientsViewSortDirection = 'asc'
      } else {
        state.currentView = 'recipientView'
      }
      state.formIsEmpty = isFormDraftEmpty(state.formDraft)
    },

    setRecipientMode: (state, action: PayloadAction<RecipientMode>) => {
      state.mode = action.payload
      if (action.payload === 'recipients') {
        state.currentView = 'recipientsView'
        state.recipientsViewSortDirection = 'asc'
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

    // Очищает данные просмотра (viewDraft), чтобы после удаления адреса из RecipientView
    // не оставался «залипший» адрес и показывался пустой плейсхолдер.
    clearRecipientViewDraft(state) {
      state.viewDraft = { ...initialSection.data }
      state.formIsComplete = false
      // formIsEmpty относится к formDraft и пересчитывается при смене view;
      // здесь достаточно сбросить сами данные отображения.
    },

    setRecipientAppliedIds: (state, action: PayloadAction<string[]>) => {
      state.applied = action.payload
    },

    setRecipientAppliedWithData: (
      state,
      action: PayloadAction<{ ids: string[]; data: AddressFields[] }>,
    ) => {
      state.applied = action.payload.ids
      state.appliedData =
        action.payload.data.length === 1 ? action.payload.data[0] : null
    },

    setRecipientApplied: (state, action: PayloadAction<boolean>) => {
      if (!action.payload) {
        state.applied = []
        state.appliedData = null
      }
    },

    setRecipientAppliedData: (
      state,
      action: PayloadAction<AddressFields | null>,
    ) => {
      state.appliedData = action.payload
    },

    removeAppliedAt: (state, action: PayloadAction<number>) => {
      const i = action.payload
      if (i >= 0 && i < state.applied.length) {
        state.applied.splice(i, 1)
        if (state.applied.length !== 1) state.appliedData = null
      }
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
      state.recipientsViewIdsFirstList = action.payload
    },

    setRecipientsViewIdsSecondList: (
      state,
      action: PayloadAction<string[]>,
    ) => {
      state.recipientsViewIdsSecondList = action.payload
    },

    setCurrentRecipientsList: (
      state,
      action: PayloadAction<CurrentRecipientsList>,
    ) => {
      state.currentRecipientsList = action.payload
    },

    toggleRecipientSortDirection(state) {
      state.sortOptions.direction =
        state.sortOptions.direction === 'asc' ? 'desc' : 'asc'
    },

    toggleRecipientsViewSortDirection(state) {
      state.recipientsViewSortDirection =
        state.recipientsViewSortDirection === 'asc' ? 'desc' : 'asc'
    },

    saveAddressRequested: (
      _state,
      _action: PayloadAction<{ listStatus?: ListStatus } | undefined>,
    ) => {},
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
  clearRecipientViewDraft,
  setRecipientAppliedIds,
  setRecipientAppliedWithData,
  setRecipientApplied,
  setRecipientAppliedData,
  removeAppliedAt,
  setRecipientView,
  setRecipientViewId,
  setRecipientsViewIds,
  setRecipientsViewIdsSecondList,
  setCurrentRecipientsList,
  toggleRecipientSortDirection,
  toggleRecipientsViewSortDirection,
  saveAddressRequested,
} = recipientSlice.actions
export default recipientSlice.reducer
