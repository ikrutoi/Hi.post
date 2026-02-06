import { createSelector } from '@reduxjs/toolkit'
import { selectSenderState } from '../../sender/infrastructure/selectors'
import { selectRecipientState } from '../../recipient/infrastructure/selectors'
import { EnvelopeSessionRecord } from '../../domain/types'

export const selectEnvelopeSessionRecord = createSelector(
  [selectSenderState, selectRecipientState],
  (sender, recipient): EnvelopeSessionRecord => {
    const isComplete =
      recipient.isComplete && (!sender.enabled || sender.isComplete)

    return {
      sender,
      recipient,
      isComplete,
    }
  },
)

export const selectIsEnvelopeReady = createSelector(
  [selectEnvelopeSessionRecord],
  (envelope) => envelope.isComplete,
)
