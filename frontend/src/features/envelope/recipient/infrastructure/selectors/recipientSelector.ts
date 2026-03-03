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
  (recipient): Readonly<AddressFields> => recipient.viewDraft,
)

export const selectRecipientFormDraft = createSelector(
  [selectRecipientState],
  (recipient): Readonly<AddressFields> => recipient.formDraft,
)

/** Адрес для отображения:
 * - в recipientView с шаблоном и в режиме просмотра — из адресной книги по recipientViewId
 * - в режиме редактирования — из viewDraft.
 */
export const selectRecipientDisplayAddress = createSelector(
  [
    selectRecipientState,
    (s: RootState) => s.addressBook?.recipientEntries ?? [],
    (s: RootState) => s.envelopeSelection?.recipientViewEditMode ?? false,
  ],
  (
    recipient,
    entries,
    recipientViewEditMode,
  ): Readonly<AddressFields> => {
    if (
      !recipientViewEditMode &&
      recipient.currentView === 'recipientView' &&
      recipient.recipientViewId
    ) {
      const entry = entries.find(
        (e: { id: string }) => e.id === recipient.recipientViewId,
      )
      if (entry?.address) return entry.address as AddressFields
    }
    return recipient.viewDraft
  },
)

export const selectRecipientAddress = selectRecipientAddressFormData

export const selectRecipientField = (
  state: RootState,
  field: keyof AddressFields,
): string => state.recipient.viewDraft[field]

export const selectRecipientCompletedFields = createSelector(
  [selectRecipientState],
  (recipient): (keyof AddressFields)[] =>
    (Object.keys(recipient.viewDraft) as (keyof AddressFields)[]).filter(
      (key) => recipient.viewDraft[key].trim() !== '',
    ),
)

export const selectIsRecipientComplete = createSelector(
  [selectRecipientState],
  (recipient) => recipient.formIsComplete,
)

export const selectRecipientEnabled = (state: RootState): boolean =>
  state.recipient.mode === 'recipients'

export const selectRecipientViewId = (state: RootState): string | null =>
  state.recipient.recipientViewId

export const selectRecipientsViewIds = (state: RootState): string[] =>
  state.recipient.recipientsViewIdsFirstList ?? []

export const selectRecipientApplied = (state: RootState): string[] =>
  state.recipient.applied ?? []

export const selectRecipientFormIsEmpty = (state: RootState): boolean =>
  state.recipient.formIsEmpty ?? true
