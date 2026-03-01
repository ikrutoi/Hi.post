import { RootState } from '@app/state'
import { createSelector } from '@reduxjs/toolkit'
import type { AddressFields } from '@shared/config/constants'
import type { RecipientState, RecipientView } from '../../domain/types'
import type { RecipientState as RecipientStateFull } from '@envelope/domain/types'
import { getMatchingEntryId } from '../../../domain/helpers'

const selectEnvelopeRecipientsState = (
  state: RootState,
): RecipientStateFull[] => state.envelopeRecipients ?? []

const selectEnvelopeSelectionState = (state: RootState) =>
  state.envelopeSelection ?? {}

const selectRecipientEntriesState = (state: RootState) =>
  state.addressBook?.recipientEntries ?? []

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
  state.recipient.mode === 'recipients'

export const selectRecipientViewId = (state: RootState): string | null =>
  state.recipient.recipientViewId

// export const selectPreviousRecipientViewId = (
//   state: RootState,
// ): string | null => state.recipient.previousRecipientViewId

export const selectRecipientsViewIds = (state: RootState): string[] =>
  state.recipient.recipientsViewIds ?? []

export const selectRecipientApplied = (state: RootState): string[] =>
  state.recipient.applied ?? []

export const selectRecipientListPanelOpen = createSelector(
  [selectEnvelopeSelectionState],
  (s) => s.recipientListPanelOpen ?? false,
)

export const selectRecipientDraft = createSelector(
  [selectEnvelopeSelectionState],
  (s): Record<string, string> | null => s.recipientDraft ?? null,
)

export const selectRecipientListPendingIds = createSelector(
  [
    (s: RootState) => selectEnvelopeSelectionState(s).recipientsPendingIds,
    selectRecipientState,
    selectRecipientEntriesState,
    selectRecipientEnabled,
  ],
  (recipientsPendingIds, recipient, recipientEntries, recipientEnabled) => {
    if (recipientEnabled) return recipientsPendingIds ?? []
    const addressForMatch: AddressFields =
      recipient.currentView === 'addressFormRecipientView'
        ? recipient.addressFormData
        : recipient.recipientViewId
          ? ((recipientEntries.find((e) => e.id === recipient.recipientViewId)
              ?.address as AddressFields) ?? ({} as AddressFields))
          : ({} as AddressFields)
    const singleId = getMatchingEntryId(addressForMatch, recipientEntries)
    return singleId ? [singleId] : []
  },
)

export const selectSelectedRecipientEntriesInOrder = createSelector(
  [
    (s: RootState) => selectEnvelopeSelectionState(s).recipientsPendingIds,
    selectRecipientEntriesState,
  ],
  (ids, entries) =>
    (ids ?? [])
      .map((id) => entries.find((e) => e.id === id))
      .filter((e): e is NonNullable<typeof e> => e != null),
)

export const selectRecipientsDisplayList = createSelector(
  [
    selectEnvelopeRecipientsState,
    selectSelectedRecipientEntriesInOrder,
    selectRecipientEnabled,
  ],
  (envelopeRecipients, selectedEntriesInOrder, recipientEnabled) => {
    if (!recipientEnabled) return []
    if (envelopeRecipients.length > 0) {
      return envelopeRecipients.map((r, i) => ({
        id: `recipient-${i}`,
        role: 'recipient' as const,
        address: { ...r.addressFormData },
        createdAt: new Date().toISOString(),
      }))
    }
    return selectedEntriesInOrder
  },
)
