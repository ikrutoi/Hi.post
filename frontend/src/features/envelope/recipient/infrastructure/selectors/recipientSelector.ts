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

/** Адрес для отображения: в recipientView с шаблоном — из адресной книги по recipientViewId, иначе — addressFormData. */
export const selectRecipientDisplayAddress = createSelector(
  [selectRecipientState, (s: RootState) => s.addressBook?.recipientEntries ?? []],
  (recipient, entries): Readonly<AddressFields> => {
    if (
      recipient.currentView === 'recipientView' &&
      recipient.recipientViewId
    ) {
      const entry = entries.find((e: { id: string }) => e.id === recipient.recipientViewId)
      if (entry?.address) return entry.address as AddressFields
    }
    return recipient.addressFormData
  },
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
  state.recipient.mode === 'recipients'

export const selectRecipientViewId = (state: RootState): string | null =>
  state.recipient.recipientViewId

export const selectRecipientsViewIds = (state: RootState): string[] =>
  state.recipient.recipientsViewIds ?? []

export const selectRecipientApplied = (state: RootState): string[] =>
  state.recipient.applied ?? []
