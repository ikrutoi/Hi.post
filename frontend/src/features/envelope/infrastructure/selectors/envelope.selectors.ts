import { createSelector } from '@reduxjs/toolkit'
import { selectSenderState } from '../../sender/infrastructure/selectors'
import { selectRecipientState } from '../../recipient/infrastructure/selectors'
import { EnvelopeSessionRecord } from '../../domain/types'

const selectEnvelopeSelectionState = (state: { envelopeSelection: { selectedRecipientIds: string[]; recipientListPanelOpen: boolean } }) =>
  state.envelopeSelection

export const selectSelectedRecipientIds = createSelector(
  [selectEnvelopeSelectionState],
  (s) => s.selectedRecipientIds,
)

export const selectRecipientListPanelOpen = createSelector(
  [selectEnvelopeSelectionState],
  (s) => s.recipientListPanelOpen,
)

export const selectEnvelopeSessionRecord = createSelector(
  [selectSenderState, selectRecipientState],
  (sender, recipient): EnvelopeSessionRecord => {
    // Тумблер Отправитель выключен: достаточно Apply в Получателе. Включён: нужен Apply и в Отправителе, и в Получателе.
    const isComplete = sender.enabled
      ? sender.applied && recipient.applied
      : recipient.applied

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
