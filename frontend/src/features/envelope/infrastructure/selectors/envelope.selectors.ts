import { createSelector } from '@reduxjs/toolkit'
import type { AddressBookEntry } from '../../addressBook/domain/types'
import { selectSenderState } from '../../sender/infrastructure/selectors'
import { selectRecipientState } from '../../recipient/infrastructure/selectors'
import { selectRecipientEnabled } from '../../recipient/infrastructure/selectors'
import { EnvelopeSessionRecord } from '../../domain/types'
import { getMatchingEntryId } from '../../domain/helpers'

const selectEnvelopeSelectionState = (state: {
  envelopeSelection: {
    selectedRecipientIds: string[]
    recipientListPanelOpen: boolean
    senderListPanelOpen: boolean
    recipientMode: EnvelopeSessionRecord['recipientMode']
    recipientTemplateId: string | null
    senderTemplateId: string | null
  }
}) => state.envelopeSelection

const selectRecipientsListState = (state: {
  envelopeRecipients: EnvelopeSessionRecord['recipients']
}) => state.envelopeRecipients ?? []

const selectRecipientEntriesState = (state: {
  addressBook?: { recipientEntries: AddressBookEntry[] }
}) => state.addressBook?.recipientEntries ?? []

const selectSenderEntriesState = (state: {
  addressBook?: { senderEntries: AddressBookEntry[] }
}) => state.addressBook?.senderEntries ?? []

export const selectSelectedRecipientIds = createSelector(
  [selectEnvelopeSelectionState],
  (s) => s.selectedRecipientIds,
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
  [selectEnvelopeSelectionState],
  (s) => s.recipientMode,
)

export const selectRecipientTemplateId = createSelector(
  [selectEnvelopeSelectionState],
  (s) => s.recipientTemplateId ?? null,
)

export const selectSenderTemplateId = createSelector(
  [selectEnvelopeSelectionState],
  (s) => s.senderTemplateId ?? null,
)

export const selectRecipientsList = selectRecipientsListState

export const selectRecipientEntries = selectRecipientEntriesState

export const selectSelectedRecipientEntriesInOrder = createSelector(
  [selectSelectedRecipientIds, selectRecipientEntriesState],
  (ids, entries): AddressBookEntry[] =>
    ids
      .map((id) => entries.find((e) => e.id === id))
      .filter((e): e is AddressBookEntry => e != null),
)

export const selectListSelectedIds = createSelector(
  [
    selectSelectedRecipientIds,
    selectRecipientState,
    selectRecipientEntriesState,
    selectRecipientEnabled,
  ],
  (selectedRecipientIds, recipient, recipientEntries, recipientEnabled) => {
    if (recipientEnabled) return selectedRecipientIds
    const singleId = getMatchingEntryId(recipient.data, recipientEntries)
    return singleId ? [singleId] : []
  },
)

export const selectSenderSelectedId = createSelector(
  [selectSenderState, selectSenderEntriesState],
  (sender, senderEntries) => getMatchingEntryId(sender.data, senderEntries),
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
        address: { ...r.data },
        createdAt: new Date().toISOString(),
      }))
    }
    return selectedEntriesInOrder
  },
)

export const selectEnvelopeSessionRecord = createSelector(
  [
    selectSenderState,
    selectRecipientState,
    selectRecipientMode,
    selectRecipientsListState,
  ],
  (sender, recipient, recipientMode, recipients): EnvelopeSessionRecord => {
    const isComplete = sender.enabled
      ? sender.applied && recipient.applied
      : recipient.applied

    return {
      sender,
      recipient,
      recipients,
      recipientMode,
      isComplete,
    }
  },
)

export const selectIsEnvelopeReady = createSelector(
  [selectEnvelopeSessionRecord],
  (envelope) => envelope.isComplete,
)
