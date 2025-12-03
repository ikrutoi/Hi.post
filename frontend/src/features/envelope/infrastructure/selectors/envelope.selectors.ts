import { RootState } from '@app/state'
import { createSelector } from '@reduxjs/toolkit'
import type { EnvelopeState } from '../../domain/types'

export const selectEnvelopeState = (state: RootState): EnvelopeState =>
  state.envelope

export const selectIsEnvelopeComplete = createSelector(
  [selectEnvelopeState],
  (envelope): boolean => envelope.isComplete
)

export const selectEnvelopeSenderFlags = createSelector(
  [selectEnvelopeState],
  (envelope) => ({
    isComplete: envelope.sender.isComplete,
    enabled: envelope.sender.enabled,
  })
)

export const selectEnvelopeRecipientFlags = createSelector(
  [selectEnvelopeState],
  (envelope) => ({
    isComplete: envelope.recipient.isComplete,
  })
)

export const selectEnvelopeFlags = createSelector(
  [
    selectEnvelopeSenderFlags,
    selectEnvelopeRecipientFlags,
    selectIsEnvelopeComplete,
  ],
  (sender, recipient, isComplete) => ({
    sender,
    recipient,
    isComplete,
  })
)
