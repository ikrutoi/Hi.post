import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { initialSection } from '../../../addressForm/domain/models'
import type { AddressFields } from '@shared/config/constants'
import type {
  RecipientState,
  RecipientView,
  SortOptions,
  CurrentRecipientsList,
} from '../../domain/types'
import type { ListStatus } from '@entities/envelope/domain/types'
import type { AddressSaveRequestedPayload } from '../../../domain/types/addressSave.types'

const DEFAULT_SORT_OPTIONS: SortOptions = {
  sortedBy: 'name',
  direction: 'asc',
}

function isFormDraftEmpty(data: AddressFields): boolean {
  return !Object.values(data).some((v) => (v ?? '').trim() !== '')
}

export const initialRecipient: RecipientState = {
  currentView: 'recipientsView',
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
}

function isComplete(data: AddressFields): boolean {
  return Object.values(data).every((val) => (val ?? '').trim() !== '')
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
      if (state.currentView === 'recipientCreate') {
        state.formDraft[field] = value
        state.formIsComplete = isComplete(state.formDraft)
      } else {
        state.viewDraft[field] = value
        state.formIsComplete = isComplete(state.viewDraft)
      }
    },

    restoreRecipient: (
      _state,
      action: PayloadAction<Partial<RecipientState> & Record<string, unknown>>,
    ) => {
      const { mode: _removed, ...rest } = action.payload
      return {
        ...initialRecipient,
        ...rest,
      }
    },

    clearRecipient: () => initialRecipient,

    resetRecipientForm: (state) => {
      state.currentView = 'recipientCreate'
      state.formDraft = { ...initialSection.data }
      state.formIsComplete = false
      state.formIsEmpty = true
    },

    clearRecipientFormData(state) {
      state.formDraft = { ...initialSection.data }
      state.formIsComplete = false
      state.formIsEmpty = true
    },

    setRecipientFormDraft(state, action: PayloadAction<AddressFields>) {
      state.formDraft = action.payload
      state.formIsComplete = isComplete(action.payload)
      state.formIsEmpty = isFormDraftEmpty(action.payload)
    },

    // Очищает данные просмотра (viewDraft), чтобы после удаления адреса из RecipientView
    // не оставался «залипший» адрес и показывался пустой плейсхолдер.
    clearRecipientViewDraft(state) {
      state.viewDraft = { ...initialSection.data }
      state.formIsComplete = false
      // formIsEmpty относится к formDraft и пересчитывается при смене view;
      // здесь достаточно сбросить сами данные отображения.
    },

    setRecipientViewDraft(state, action: PayloadAction<AddressFields>) {
      state.viewDraft = action.payload
      state.formIsComplete = isComplete(action.payload)
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
      if (nextView !== 'recipientCreate') {
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
      _action: PayloadAction<AddressSaveRequestedPayload | undefined>,
    ) => {},
  },
})

export const {
  updateRecipientField,
  restoreRecipient,
  clearRecipient,
  resetRecipientForm,
  clearRecipientFormData,
  setRecipientFormDraft,
  clearRecipientViewDraft,
  setRecipientViewDraft,
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
