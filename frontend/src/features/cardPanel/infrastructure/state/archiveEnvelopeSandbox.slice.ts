import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AddressFields } from '@shared/config/constants'
import { initialRecipient } from '@envelope/recipient/infrastructure/state/recipientSlice'
import type {
  RecipientState,
  RecipientView,
} from '@envelope/recipient/domain/types'
import type { ArchiveEnvelopeSandboxState } from '../../domain/types/archiveEnvelopeSandbox.types'

function isComplete(data: AddressFields): boolean {
  return Object.values(data).every((val) => (val ?? '').trim() !== '')
}

function hasAddressFields(data: AddressFields | null | undefined): boolean {
  if (data == null) return false
  return Object.values(data).some((v) => (v ?? '').trim() !== '')
}

function cloneRecipient(partial: Partial<RecipientState>): RecipientState {
  return {
    ...initialRecipient,
    ...partial,
    formDraft: { ...initialRecipient.formDraft, ...partial.formDraft },
    viewDraft: { ...initialRecipient.viewDraft, ...partial.viewDraft },
    applied: [...(partial.applied ?? initialRecipient.applied)],
    recipientsViewIdsFirstList: [
      ...(partial.recipientsViewIdsFirstList ??
        initialRecipient.recipientsViewIdsFirstList),
    ],
    recipientsViewIdsSecondList: [
      ...(partial.recipientsViewIdsSecondList ??
        initialRecipient.recipientsViewIdsSecondList),
    ],
  }
}

const initialState: ArchiveEnvelopeSandboxState = {
  localId: null,
  source: null,
  recipient: { ...initialRecipient },
}

const archiveEnvelopeSandboxSlice = createSlice({
  name: 'archiveEnvelopeSandbox',
  initialState,
  reducers: {
    loadArchiveEnvelopeSandbox(
      state,
      action: PayloadAction<{
        localId: number
        source: 'cart' | 'history'
        recipient: Partial<RecipientState>
        envelopeIsComplete?: boolean
      }>,
    ) {
      const { localId, source, recipient } = action.payload
      state.localId = localId
      state.source = source
      state.recipient = cloneRecipient(recipient)
      if (
        state.recipient.appliedData != null &&
        !hasAddressFields(state.recipient.viewDraft)
      ) {
        state.recipient.viewDraft = { ...state.recipient.appliedData }
        state.recipient.formIsComplete = isComplete(state.recipient.viewDraft)
      }
      const appliedRecipientIds = state.recipient.applied ?? []
      if (
        state.recipient.recipientViewId == null &&
        appliedRecipientIds.length > 0
      ) {
        state.recipient.recipientViewId = appliedRecipientIds[0] ?? null
      }
      /**
       * Single applied recipient with no multi-list: keep ids list in sync so
       * edit UI / Apply can resolve the same way as left assembly.
       */
      if (
        appliedRecipientIds.length === 1 &&
        (state.recipient.recipientsViewIdsFirstList?.length ?? 0) === 0 &&
        (state.recipient.recipientsViewIdsSecondList?.length ?? 0) === 0
      ) {
        state.recipient.recipientsViewIdsFirstList = [appliedRecipientIds[0]!]
        state.recipient.currentRecipientsList = 'first'
      }
      if (
        (appliedRecipientIds.length > 0 ||
          state.recipient.appliedData != null) &&
        state.recipient.currentView === 'recipientCreate'
      ) {
        state.recipient.currentView = 'recipientView'
      }
    },

    clearArchiveEnvelopeSandbox() {
      return {
        localId: null,
        source: null,
        recipient: { ...initialRecipient },
      }
    },

    updateArchiveSenderField: {
      reducer: () => {},
      prepare: (payload: { field: keyof AddressFields; value: string }) => ({
        payload,
      }),
    },
    setArchiveSenderEnabled: {
      reducer: () => {},
      prepare: (payload: boolean) => ({ payload }),
    },
    setArchiveSenderView: {
      reducer: () => {},
      prepare: (payload: string) => ({ payload }),
    },
    setArchiveSenderViewId: {
      reducer: () => {},
      prepare: (payload: string | null) => ({ payload }),
    },
    setArchiveSenderApplied: {
      reducer: () => {},
      prepare: (payload: boolean) => ({ payload }),
    },
    setArchiveSenderAppliedWithData: {
      reducer: () => {},
      prepare: (payload: { ids: string[]; data: AddressFields[] }) => ({
        payload,
      }),
    },
    clearArchiveSenderFormData: () => {},

    updateArchiveRecipientField(
      state,
      action: PayloadAction<{ field: keyof AddressFields; value: string }>,
    ) {
      const { field, value } = action.payload
      if (state.recipient.currentView === 'recipientCreate') {
        state.recipient.formDraft[field] = value
        state.recipient.formIsComplete = isComplete(state.recipient.formDraft)
      } else {
        state.recipient.viewDraft[field] = value
        state.recipient.formIsComplete = isComplete(state.recipient.viewDraft)
      }
    },

    setArchiveRecipientView(state, action: PayloadAction<RecipientView>) {
      state.recipient.currentView = action.payload
    },

    setArchiveRecipientViewId(state, action: PayloadAction<string | null>) {
      state.recipient.recipientViewId = action.payload
    },

    setArchiveRecipientApplied(state, action: PayloadAction<boolean>) {
      if (!action.payload) {
        const fromApplied = state.recipient.appliedData
        if (fromApplied != null && hasAddressFields(fromApplied)) {
          state.recipient.viewDraft = { ...fromApplied }
          state.recipient.formIsComplete = isComplete(fromApplied)
        } else {
          state.recipient.formIsComplete = isComplete(state.recipient.viewDraft)
        }
        const appliedId =
          state.recipient.applied?.[0] ??
          state.recipient.recipientsViewIdsFirstList?.[0] ??
          state.recipient.recipientsViewIdsSecondList?.[0] ??
          null
        if (appliedId) {
          state.recipient.recipientViewId = appliedId
        }
        state.recipient.currentView = 'recipientView'
        state.recipient.applied = []
        state.recipient.appliedData = null
      }
    },

    setArchiveRecipientAppliedWithData(
      state,
      action: PayloadAction<{ ids: string[]; data: AddressFields[] }>,
    ) {
      state.recipient.applied = action.payload.ids
      state.recipient.appliedData =
        action.payload.data.length === 1 ? action.payload.data[0] : null
    },

    clearArchiveRecipientFormData(state) {
      state.recipient.formDraft = { ...initialRecipient.formDraft }
      state.recipient.formIsComplete = false
      state.recipient.formIsEmpty = true
    },
  },
})

export const {
  loadArchiveEnvelopeSandbox,
  clearArchiveEnvelopeSandbox,
  updateArchiveSenderField,
  setArchiveSenderEnabled,
  setArchiveSenderView,
  setArchiveSenderViewId,
  setArchiveSenderApplied,
  setArchiveSenderAppliedWithData,
  updateArchiveRecipientField,
  setArchiveRecipientView,
  setArchiveRecipientViewId,
  setArchiveRecipientApplied,
  setArchiveRecipientAppliedWithData,
  clearArchiveSenderFormData,
  clearArchiveRecipientFormData,
} = archiveEnvelopeSandboxSlice.actions

export default archiveEnvelopeSandboxSlice.reducer
