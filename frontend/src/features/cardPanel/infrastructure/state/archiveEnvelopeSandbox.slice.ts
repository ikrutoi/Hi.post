import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AddressFields } from '@shared/config/constants'
import { initialSender } from '@envelope/sender/infrastructure/state/senderSlice'
import { initialRecipient } from '@envelope/recipient/infrastructure/state/recipientSlice'
import type { SenderState, SenderView } from '@envelope/sender/domain/types'
import type {
  RecipientState,
  RecipientView,
} from '@envelope/recipient/domain/types'
import type { ArchiveEnvelopeSandboxState } from '../../domain/types/archiveEnvelopeSandbox.types'

function isComplete(data: AddressFields): boolean {
  return Object.values(data).every((val) => (val ?? '').trim() !== '')
}

function cloneSender(partial: Partial<SenderState>): SenderState {
  const next: SenderState = {
    ...initialSender,
    ...partial,
    formDraft: { ...initialSender.formDraft, ...partial.formDraft },
    viewDraft: { ...initialSender.viewDraft, ...partial.viewDraft },
    applied: [...(partial.applied ?? initialSender.applied)],
  }
  if (
    !next.appliedLocked &&
    ((next.applied?.length ?? 0) > 0 || next.appliedData != null)
  ) {
    next.appliedLocked = true
  }
  return next
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
  sender: { ...initialSender },
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
        sender: Partial<SenderState>
        recipient: Partial<RecipientState>
        /** Complete postcard envelope ⇒ empty/disabled sender is applied. */
        envelopeIsComplete?: boolean
      }>,
    ) {
      const { localId, source, sender, recipient, envelopeIsComplete } =
        action.payload
      state.localId = localId
      state.source = source
      state.sender = cloneSender({
        ...sender,
        appliedLocked:
          Boolean(sender.appliedLocked) ||
          (sender.applied?.length ?? 0) > 0 ||
          Boolean(envelopeIsComplete),
      })
      /** Ensure edit drafts exist even if postcard only stored appliedData. */
      if (
        state.sender.appliedData != null &&
        !Object.values(state.sender.viewDraft).some((v) => (v ?? '').trim() !== '')
      ) {
        state.sender.viewDraft = { ...state.sender.appliedData }
        state.sender.formIsComplete = isComplete(state.sender.viewDraft)
      }
      if (
        state.sender.senderViewId == null &&
        (state.sender.applied?.length ?? 0) > 0
      ) {
        state.sender.senderViewId = state.sender.applied[0] ?? null
      }
      state.recipient = cloneRecipient(recipient)
      if (
        state.recipient.appliedData != null &&
        !Object.values(state.recipient.viewDraft).some(
          (v) => (v ?? '').trim() !== '',
        )
      ) {
        state.recipient.viewDraft = { ...state.recipient.appliedData }
        state.recipient.formIsComplete = isComplete(state.recipient.viewDraft)
      }
      if (
        state.recipient.recipientViewId == null &&
        (state.recipient.applied?.length ?? 0) > 0
      ) {
        state.recipient.recipientViewId = state.recipient.applied[0] ?? null
      }
    },

    clearArchiveEnvelopeSandbox() {
      return {
        localId: null,
        source: null,
        sender: { ...initialSender },
        recipient: { ...initialRecipient },
      }
    },

    updateArchiveSenderField(
      state,
      action: PayloadAction<{ field: keyof AddressFields; value: string }>,
    ) {
      const { field, value } = action.payload
      if (state.sender.currentView === 'senderCreate') {
        state.sender.formDraft[field] = value
        state.sender.formIsComplete = isComplete(state.sender.formDraft)
      } else {
        state.sender.viewDraft[field] = value
        state.sender.formIsComplete = isComplete(state.sender.viewDraft)
      }
    },

    setArchiveSenderEnabled(state, action: PayloadAction<boolean>) {
      state.sender.enabled = action.payload
    },

    setArchiveSenderView(state, action: PayloadAction<SenderView>) {
      state.sender.currentView = action.payload
    },

    setArchiveSenderViewId(state, action: PayloadAction<string | null>) {
      state.sender.senderViewId = action.payload
    },

    setArchiveSenderApplied(state, action: PayloadAction<boolean>) {
      if (!action.payload) {
        const fromApplied = state.sender.appliedData
        if (fromApplied != null) {
          state.sender.viewDraft = { ...fromApplied }
          state.sender.formIsComplete = isComplete(fromApplied)
        }
        const appliedId = state.sender.applied?.[0]
        if (appliedId) {
          state.sender.senderViewId = appliedId
        }
        state.sender.currentView = 'senderView'
        state.sender.applied = []
        state.sender.appliedData = null
        state.sender.appliedLocked = false
      } else {
        state.sender.appliedLocked = true
      }
    },

    setArchiveSenderAppliedWithData(
      state,
      action: PayloadAction<{ ids: string[]; data: AddressFields[] }>,
    ) {
      state.sender.applied = action.payload.ids
      state.sender.appliedData =
        action.payload.data.length === 1 ? action.payload.data[0] : null
      state.sender.appliedLocked = true
    },

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
        if (fromApplied != null) {
          state.recipient.viewDraft = { ...fromApplied }
          state.recipient.formIsComplete = isComplete(fromApplied)
        }
        const appliedId = state.recipient.applied?.[0]
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
} = archiveEnvelopeSandboxSlice.actions

export default archiveEnvelopeSandboxSlice.reducer
