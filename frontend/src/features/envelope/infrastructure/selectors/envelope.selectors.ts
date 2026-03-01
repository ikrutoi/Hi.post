import { createSelector } from '@reduxjs/toolkit'
import type { AddressBookEntry } from '../../addressBook/domain/types'
import {
  selectSenderState,
  selectSenderViewId,
} from '../../sender/infrastructure/selectors'
import {
  selectRecipientState,
  selectRecipientViewId,
  selectRecipientEnabled,
} from '../../recipient/infrastructure/selectors'
import type { EnvelopeSessionRecord } from '../../domain/types'
import type { RecipientState } from '../../recipient/domain/types'
import type { AddressFields } from '@shared/config/constants'
import { getMatchingEntryId } from '../../domain/helpers'

const emptyAddressFields: AddressFields = {
  name: '',
  street: '',
  city: '',
  zip: '',
  country: '',
}

const selectEnvelopeSelectionState = (state: {
  envelopeSelection: {
    recipientsPendingIds: string[]
    recipientListPanelOpen: boolean
    senderListPanelOpen: boolean
    senderViewEditMode?: boolean
    recipientViewEditMode?: boolean
    senderDraft?: Record<string, string> | null
    recipientDraft?: Record<string, string> | null
    showAddressFormView?: boolean
    addressFormViewRole?: 'sender' | 'recipient' | null
  }
}) => state.envelopeSelection

const selectRecipientsListState = (state: {
  envelopeRecipients: RecipientState[]
}) => state.envelopeRecipients ?? []

const selectRecipientEntriesState = (state: {
  addressBook?: { recipientEntries: AddressBookEntry[] }
}) => state.addressBook?.recipientEntries ?? []

const selectSenderEntriesState = (state: {
  addressBook?: { senderEntries: AddressBookEntry[] }
}) => state.addressBook?.senderEntries ?? []

export const selectRecipientsPendingIds = createSelector(
  [selectEnvelopeSelectionState],
  (s) => s.recipientsPendingIds,
)

export const selectRecipientListPanelOpen = createSelector(
  [selectEnvelopeSelectionState],
  (s) => s.recipientListPanelOpen,
)

export const selectSenderListPanelOpen = createSelector(
  [selectEnvelopeSelectionState],
  (s) => s.senderListPanelOpen,
)

export const selectRecipientMode = createSelector(
  [selectRecipientState],
  (recipient) => recipient.mode ?? 'recipient',
)

export const selectRecipientTemplateId = selectRecipientViewId

export const selectSenderTemplateId = selectSenderViewId

export const selectShowAddressFormView = createSelector(
  [selectEnvelopeSelectionState],
  (s) => s.showAddressFormView ?? false,
)

export const selectAddressFormViewRole = createSelector(
  [selectEnvelopeSelectionState],
  (s) => s.addressFormViewRole ?? null,
)

export const selectRecipientDraft = createSelector(
  [selectEnvelopeSelectionState],
  (s) => s.recipientDraft ?? null,
)

export const selectSenderDraft = createSelector(
  [selectEnvelopeSelectionState],
  (s) => s.senderDraft ?? null,
)

export const selectSenderViewEditMode = createSelector(
  [selectEnvelopeSelectionState],
  (s) => s.senderViewEditMode ?? false,
)

export const selectRecipientViewEditMode = createSelector(
  [selectEnvelopeSelectionState],
  (s) => s.recipientViewEditMode ?? false,
)

export const selectRecipientsList = selectRecipientsListState

export const selectRecipientEntries = selectRecipientEntriesState

export const selectSelectedRecipientEntriesInOrder = createSelector(
  [selectRecipientsPendingIds, selectRecipientEntriesState],
  (ids, entries): AddressBookEntry[] =>
    ids
      .map((id) => entries.find((e) => e.id === id))
      .filter((e): e is AddressBookEntry => e != null),
)

export const selectRecipientListPendingIds = createSelector(
  [
    selectRecipientsPendingIds,
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
              ?.address as AddressFields) ?? emptyAddressFields)
          : emptyAddressFields
    const singleId = getMatchingEntryId(addressForMatch, recipientEntries)
    return singleId ? [singleId] : []
  },
)

export const selectSenderSelectedId = createSelector(
  [selectSenderState, selectSenderEntriesState],
  (sender, senderEntries) =>
    sender.currentView === 'senderView' && sender.senderViewId
      ? sender.senderViewId
      : getMatchingEntryId(sender.addressFormData, senderEntries),
)

export const selectRecipientsDisplayList = createSelector(
  [
    selectRecipientsListState,
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

export const selectEnvelopeSessionRecord = createSelector(
  [selectSenderState, selectRecipientState],
  (sender, recipient): EnvelopeSessionRecord => {
    const senderApplied = (sender.applied?.length ?? 0) > 0
    const recipientApplied = (recipient.applied?.length ?? 0) > 0
    const isComplete = sender.enabled
      ? senderApplied && recipientApplied
      : recipientApplied

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
