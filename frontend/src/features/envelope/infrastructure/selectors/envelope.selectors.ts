import { createSelector } from '@reduxjs/toolkit'
import type { PanelDensity2Size } from '@shared/ui/icons'
import type { AddressFields } from '@shared/config/constants'
import type { RootState } from '@app/state'
import type { AddressBookEntry } from '../../addressBook/domain/types'
import type { AddressEditSession } from '../../domain/types'
import {
  selectSenderState,
  selectSenderViewId,
} from '../../sender/infrastructure/selectors'
import {
  selectRecipientState,
  selectRecipientViewId,
} from '../../recipient/infrastructure/selectors'
import type { EnvelopeSessionRecord } from '../../domain/types'
import type { RecipientState } from '../../recipient/domain/types'
import {
  getMatchingEntryId,
  getAddressListToolbarFragment,
} from '../../domain/helpers'

const selectEnvelopeSelectionState = (state: {
  envelopeSelection: {
    recipientsPendingIds: string[]
    activeAddressList?: 'sender' | 'recipients' | null
    recipientListPanelOpen: boolean
    senderListPanelOpen: boolean
    activeAddressEdit?: AddressEditSession | null
    showAddressFormView?: boolean
    addressFormViewRole?: 'sender' | 'recipient' | null
    senderAddressListPanelDensity?: PanelDensity2Size
    recipientAddressListPanelDensity?: PanelDensity2Size
    addressListPanelDensity?: PanelDensity2Size
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

export const selectSenderEntriesCount = createSelector(
  [selectSenderEntriesState],
  (entries) => entries.length,
)

export const selectRecipientEntriesCount = createSelector(
  [selectRecipientEntriesState],
  (entries) => entries.length,
)

export const selectShowAddressFormCloseButton = createSelector(
  [
    selectSenderEntriesCount,
    selectRecipientEntriesCount,
  ],
  (senderCount, recipientCount) =>
    (role: 'sender' | 'recipient') =>
      role === 'sender' ? senderCount >= 0 : recipientCount >= 0,
)

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

export const selectActiveAddressList = createSelector(
  [selectEnvelopeSelectionState],
  (s) => s.activeAddressList ?? null,
)

export const selectSenderAddressListPanelDensity = createSelector(
  [selectEnvelopeSelectionState],
  (s): PanelDensity2Size =>
    s.senderAddressListPanelDensity ?? s.addressListPanelDensity ?? 1,
)

export const selectRecipientAddressListPanelDensity = createSelector(
  [selectEnvelopeSelectionState],
  (s): PanelDensity2Size =>
    s.recipientAddressListPanelDensity ?? s.addressListPanelDensity ?? 1,
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

export const selectActiveAddressEdit = createSelector(
  [selectEnvelopeSelectionState],
  (s): AddressEditSession | null => s.activeAddressEdit ?? null,
)

export const selectSenderViewEditMode = createSelector(
  [selectActiveAddressEdit],
  (session) => session?.role === 'sender',
)

export const selectRecipientViewEditMode = createSelector(
  [selectActiveAddressEdit],
  (session) => session?.role === 'recipient',
)

export const selectSenderCardAddress = createSelector(
  [
    selectActiveAddressEdit,
    selectSenderState,
    selectSenderEntriesState,
    selectSenderViewId,
  ],
  (editSession, sender, entries, senderViewId): Readonly<AddressFields> => {
    if (editSession?.role === 'sender') {
      return editSession.draft
    }
    const displayId = senderViewId ?? sender.applied?.[0] ?? null
    if (displayId) {
      const entry = entries.find((e) => e.id === displayId)
      if (entry?.address) return entry.address as AddressFields
    }
    if (sender.appliedData) return sender.appliedData
    return sender.viewDraft
  },
)

export const selectRecipientCardAddress = createSelector(
  [
    selectActiveAddressEdit,
    selectRecipientState,
    selectRecipientEntriesState,
    selectRecipientViewId,
    selectRecipientsListState,
  ],
  (
    editSession,
    recipient,
    entries,
    recipientViewId,
    envelopeRecipients,
  ): Readonly<AddressFields> => {
    if (editSession?.role === 'recipient') {
      return editSession.draft
    }
    if (recipient.currentView === 'recipientView' && recipientViewId) {
      const entry = entries.find((e) => e.id === recipientViewId)
      if (entry?.address) return entry.address as AddressFields
      const fromEnvelope = envelopeRecipients.find(
        (r) => r.recipientViewId === recipientViewId,
      )
      if (fromEnvelope?.viewDraft) return fromEnvelope.viewDraft
    }
    if (recipient.appliedData) return recipient.appliedData
    return recipient.viewDraft
  },
)

export const selectRecipientsList = selectRecipientsListState

export const selectSelectedRecipientEntriesInOrder = createSelector(
  [selectRecipientsPendingIds, selectRecipientEntriesState],
  (ids, entries): AddressBookEntry[] =>
    ids
      .map((id) => entries.find((e) => e.id === id))
      .filter((e): e is AddressBookEntry => e != null),
)

export const selectRecipientListPendingIds = selectRecipientsPendingIds

export const selectSenderSelectedId = createSelector(
  [selectSenderState, selectSenderEntriesState],
  (sender, senderEntries) =>
    sender.currentView === 'senderView' && sender.senderViewId
      ? sender.senderViewId
      : getMatchingEntryId(sender.viewDraft, senderEntries),
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

/** True if mini-card / clear control should allow clearing envelope (any applied address). */
export const selectHasEnvelopeAppliedContent = createSelector(
  [selectSenderState, selectRecipientState],
  (sender, recipient) =>
    (sender.applied?.length ?? 0) > 0 || (recipient.applied?.length ?? 0) > 0,
)

export const selectRecipientsToolbarStateWithLiveAddressList = createSelector(
  [
    (s: RootState) => s.toolbar?.recipients ?? {},
    (s: RootState) => s.envelopeSelection?.activeAddressList ?? null,
    (s: RootState) => s.addressBook?.recipientEntries?.length ?? 0,
  ],
  (base, activeAddressList, recipientInListEntriesCount) => {
    const listOpen = activeAddressList === 'recipients'
    const addressList = listOpen
      ? {
          state: 'active' as const,
          options: {
            badge:
              recipientInListEntriesCount > 0
                ? recipientInListEntriesCount
                : null,
          },
        }
      : getAddressListToolbarFragment(recipientInListEntriesCount)
    return { ...base, addressList }
  },
)
