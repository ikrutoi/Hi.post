import { RootState } from '@app/state'
import { createSelector } from '@reduxjs/toolkit'
import type { AddressFields } from '@shared/config/constants'
import type { RecipientState } from '@envelope/domain/types'

export const selectRecipientState = (state: RootState): RecipientState =>
  state.recipient

export const selectRecipientAddress = createSelector(
  [selectRecipientState],
  (recipient): Readonly<AddressFields> => recipient.data
)

export const selectRecipientField = (
  state: RootState,
  field: keyof AddressFields
): string => state.recipient.data[field]

export const selectRecipientCompletedFields = createSelector(
  [selectRecipientState],
  (recipient): (keyof AddressFields)[] =>
    (Object.keys(recipient.data) as (keyof AddressFields)[]).filter(
      (key) => recipient.data[key].trim() !== ''
    )
)

export const selectIsRecipientComplete = (state: RootState): boolean =>
  state.recipient.isComplete

export const selectRecipientEnabled = (state: RootState): boolean =>
  state.recipient.enabled
