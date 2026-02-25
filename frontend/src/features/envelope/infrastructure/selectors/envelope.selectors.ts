import { createSelector } from '@reduxjs/toolkit'
import { selectSenderState } from '../../sender/infrastructure/selectors'
import { selectRecipientState } from '../../recipient/infrastructure/selectors'
import { EnvelopeSessionRecord } from '../../domain/types'

const selectEnvelopeSelectionState = (state: {
  envelopeSelection: {
    selectedRecipientIds: string[]
    recipientListPanelOpen: boolean
    recipientMode: EnvelopeSessionRecord['recipientMode']
  }
}) => state.envelopeSelection

const selectRecipientsListState = (state: {
  envelopeRecipients: EnvelopeSessionRecord['recipients']
}) => state.envelopeRecipients ?? []

export const selectSelectedRecipientIds = createSelector(
  [selectEnvelopeSelectionState],
  (s) => s.selectedRecipientIds,
)

export const selectRecipientListPanelOpen = createSelector(
  [selectEnvelopeSelectionState],
  (s) => s.recipientListPanelOpen,
)

export const selectRecipientMode = createSelector(
  [selectEnvelopeSelectionState],
  (s) => s.recipientMode,
)

export const selectRecipientsList = selectRecipientsListState

export const selectEnvelopeSessionRecord = createSelector(
  [
    selectSenderState,
    selectRecipientState,
    selectRecipientMode,
    selectRecipientsListState,
  ],
  (sender, recipient, recipientMode, recipients): EnvelopeSessionRecord => {
    const isComplete = sender.enabled
      ? sender.applied && recipient.applied
      : recipient.applied

    return {
      sender,
      recipient,
      recipients,
      recipientMode,
      isComplete,
    }
  },
)

export const selectIsEnvelopeReady = createSelector(
  [selectEnvelopeSessionRecord],
  (envelope) => envelope.isComplete,
)
