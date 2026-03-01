import { RootState } from '@app/state'
import { createSelector } from '@reduxjs/toolkit'
import type { AddressFields } from '@shared/config/constants'
import type { RecipientState, RecipientView } from '../../domain/types'

export const selectRecipientState = (state: RootState): RecipientState =>
  state.recipient

export const selectRecipientView = (state: RootState): RecipientView =>
  state.recipient.currentView ?? 'addressFormRecipientView'

export const selectRecipientAddressFormData = createSelector(
  [selectRecipientState],
  (recipient): Readonly<AddressFields> => recipient.addressFormData,
)

export const selectRecipientAddress = selectRecipientAddressFormData

export const selectRecipientField = (
  state: RootState,
  field: keyof AddressFields,
): string => state.recipient.addressFormData[field]

export const selectRecipientCompletedFields = createSelector(
  [selectRecipientState],
  (recipient): (keyof AddressFields)[] =>
    (Object.keys(recipient.addressFormData) as (keyof AddressFields)[]).filter(
      (key) => recipient.addressFormData[key].trim() !== '',
    ),
)

export const selectIsRecipientComplete = createSelector(
  [selectRecipientState],
  (recipient) => recipient.addressFormIsComplete,
)

export const selectRecipientEnabled = (state: RootState): boolean =>
  state.recipient.enabled

export const selectRecipientViewId = (state: RootState): string | null =>
  state.recipient.recipientViewId

export const selectRecipientsViewIds = (state: RootState): string[] =>
  state.recipient.recipientsViewIds ?? []

export const selectRecipientApplied = (state: RootState): string[] =>
  state.recipient.applied ?? []
