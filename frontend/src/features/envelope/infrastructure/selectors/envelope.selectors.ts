import { RootState } from '@app/state'
import { createSelector } from '@reduxjs/toolkit'
import type { EnvelopeState } from '@envelope/domain/types'

export const selectEnvelopeState = (state: RootState): EnvelopeState =>
  state.envelope

export const selectIsEnvelopeComplete = createSelector(
  [selectEnvelopeState],
  (envelope): boolean => envelope.isComplete
)

export const selectIsSenderComplete = createSelector(
  [selectEnvelopeState],
  (envelope): boolean => envelope.sender.isComplete
)

export const selectIsRecipientComplete = createSelector(
  [selectEnvelopeState],
  (envelope): boolean => envelope.recipient.isComplete
)

export const selectRoleComplete = (
  state: RootState,
  role: 'sender' | 'recipient'
): boolean => {
  const envelope = selectEnvelopeState(state)
  return envelope[role].isComplete
}
