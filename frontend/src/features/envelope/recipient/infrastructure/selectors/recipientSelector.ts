import { RootState } from '@app/state'
import { createSelector } from '@reduxjs/toolkit'
import type { AddressFields } from '@shared/config/constants'
import { initialSection } from '../../../addressForm/domain/models'
import type { AddressBookEntry } from '../../../addressBook/domain/types'
import type {
  RecipientState,
  RecipientView,
  SortDirection,
} from '../../domain/types'

const selectEnvelopeRecipientsList = (state: RootState): RecipientState[] =>
  state.envelopeRecipients ?? []

const selectRecipientsPendingIds = (state: RootState): string[] =>
  state.envelopeSelection?.recipientsPendingIds ?? []

const selectRecipientEntriesState = (state: RootState): AddressBookEntry[] =>
  state.addressBook?.recipientEntries ?? []

const selectSelectedRecipientEntriesInOrder = createSelector(
  [selectRecipientsPendingIds, selectRecipientEntriesState],
  (ids, entries): AddressBookEntry[] =>
    ids
      .map((id) => entries.find((e) => e.id === id))
      .filter((e): e is AddressBookEntry => e != null),
)

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

export const selectRecipientDisplayAddress = createSelector(
  [
    selectRecipientState,
    (s: RootState) => s.addressBook?.recipientEntries ?? [],
    (s: RootState) => s.envelopeSelection?.recipientViewEditMode ?? false,
  ],
  (recipient, entries, recipientViewEditMode): Readonly<AddressFields> => {
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

const isAddressComplete = (
  address: Record<string, string> | undefined,
): boolean =>
  !!address && Object.values(address).every((v) => (v ?? '').trim() !== '')

export const selectIsRecipientComplete = createSelector(
  [selectRecipientState, selectRecipientEntriesState],
  (recipient, entries): boolean => {
    if (recipient.mode === 'recipient' && recipient.recipientViewId) {
      const entry = entries.find((e) => e.id === recipient.recipientViewId)
      if (
        entry?.address &&
        isAddressComplete(entry.address as Record<string, string>)
      ) {
        return true
      }
    }
    return recipient.formIsComplete
  },
)

export const selectRecipientEnabled = (state: RootState): boolean =>
  state.recipient.mode === 'recipients'

export const selectRecipientViewId = (state: RootState): string | null =>
  state.recipient.recipientViewId

export const selectRecipientsViewIds = (state: RootState): string[] =>
  state.recipient.recipientsViewIdsFirstList ?? []

export const selectRecipientApplied = (state: RootState): string[] =>
  state.recipient.applied ?? []

export const selectAppliedRecipientDisplayAddress = createSelector(
  [
    selectRecipientState,
    (s: RootState) => s.addressBook?.recipientEntries ?? [],
  ],
  (recipient, entries): Readonly<AddressFields> => {
    if (recipient.appliedData != null) return recipient.appliedData
    const appliedId = recipient.applied?.[0]
    if (appliedId) {
      const entry = entries.find((e: { id: string }) => e.id === appliedId)
      if (entry?.address) return entry.address as AddressFields
    }
    return { ...initialSection.data }
  },
)

export const selectRecipientFormIsEmpty = (state: RootState): boolean =>
  state.recipient.formIsEmpty ?? true

export const selectRecipientsViewSortDirection = createSelector(
  [selectRecipientState],
  (recipient): SortDirection => recipient?.recipientsViewSortDirection ?? 'asc',
)

const selectRecipientsViewSortDirectionRaw = (
  state: RootState,
): SortDirection => state.recipient?.recipientsViewSortDirection ?? 'asc'

/** Id списка получателей для текущего вида (first или second). */
const selectCurrentRecipientsViewIds = (state: RootState): string[] => {
  const r = state.recipient
  if (!r) return []
  return r.currentRecipientsList === 'second'
    ? (r.recipientsViewIdsSecondList ?? [])
    : (r.recipientsViewIdsFirstList ?? [])
}

/** Записи для RecipientsView: по текущему списку id, адрес из envelope или адресной книги. */
const selectRecipientsDisplayEntriesFromViewIds = createSelector(
  [
    selectEnvelopeRecipientsList,
    selectRecipientEntriesState,
    (s: RootState) => selectCurrentRecipientsViewIds(s),
  ],
  (
    envelopeRecipients,
    recipientEntries,
    viewIds,
  ): AddressBookEntry[] =>
    viewIds.flatMap((templateId) => {
      const fromEnvelope = envelopeRecipients.find(
        (r) => r.recipientViewId === templateId,
      )
      const fromBook = recipientEntries.find((e) => e.id === templateId)
      const address = fromEnvelope?.viewDraft ?? fromBook?.address
      if (!address) return []
      return [
        {
          id: templateId,
          role: 'recipient' as const,
          address: { ...address },
          createdAt: fromBook?.createdAt ?? new Date().toISOString(),
        } as AddressBookEntry,
      ]
    }),
)

export const selectRecipientsDisplayList = createSelector(
  [
    selectRecipientsDisplayEntriesFromViewIds,
    selectRecipientsViewSortDirectionRaw,
    selectRecipientEnabled,
  ],
  (
    baseEntries,
    recipientsViewSortDirection,
    recipientEnabled,
  ): AddressBookEntry[] => {
    if (!recipientEnabled) return []

    const direction = recipientsViewSortDirection
    const sorted = [...baseEntries].sort((a, b) => {
      const nameA = (a.address?.name ?? '').trim().toLowerCase()
      const nameB = (b.address?.name ?? '').trim().toLowerCase()
      const cmp = nameA.localeCompare(nameB, undefined, {
        sensitivity: 'base',
      })
      if (direction === 'asc') return cmp
      if (direction === 'desc') return -cmp
      return cmp
    })

    return sorted
  },
)
