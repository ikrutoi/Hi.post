import { createSelector } from '@reduxjs/toolkit'
import type { PanelDensity2Size } from '@shared/ui/icons'
import type { AddressFields } from '@shared/config/constants'
import type { RootState } from '@app/state'
import {
  selectSenderState,
  selectSenderViewId,
  selectSenderEntriesState,
} from '../../sender/infrastructure/selectors'
import {
  selectRecipientState,
  selectRecipientViewId,
  selectRecipientEntriesState,
} from '../../recipient/infrastructure/selectors'
import type { EnvelopeSessionRecord } from '../../domain/types'
import type { RecipientState } from '../../recipient/domain/types'
import {
  getMatchingEntryId,
  getAddressListToolbarFragment,
  listStatusIsInQuickAddressBook,
} from '../../domain/helpers'

import type { AddressBookEntry } from '../../addressBook/domain/types'
import type { AddressCreateEditContext, AddressEditSession } from '../../domain/types'

const EMPTY_RECIPIENT_STATE_LIST: RecipientState[] = []

const selectEnvelopeSelectionState = (state: {
  envelopeSelection: {
    recipientsPendingIds: string[]
    activeAddressList?: 'sender' | 'recipients' | null
    recipientListPanelOpen: boolean
    senderListPanelOpen: boolean
    activeAddressEdit?: AddressEditSession | null
    addressCreateEditContext?: AddressCreateEditContext | null
    showAddressFormView?: boolean
    addressFormViewRole?: 'sender' | 'recipient' | null
    senderAddressListPanelDensity?: PanelDensity2Size
    recipientAddressListPanelDensity?: PanelDensity2Size
    addressListPanelDensity?: PanelDensity2Size
    mobileAddressFocusClearSeq?: number
  }
}) => state.envelopeSelection

const selectRecipientsListState = (state: RootState): RecipientState[] =>
  state.envelopeRecipients ?? EMPTY_RECIPIENT_STATE_LIST

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

export const selectMobileAddressFocusClearSeq = createSelector(
  [selectEnvelopeSelectionState],
  (s) => s.mobileAddressFocusClearSeq ?? 0,
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

export const selectAddressCreateEditContext = createSelector(
  [selectEnvelopeSelectionState],
  (s): AddressCreateEditContext | null => s.addressCreateEditContext ?? null,
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
    if (senderViewId) {
      const entry = entries.find((e) => e.id === senderViewId)
      if (entry?.address) return entry.address as AddressFields
      return sender.viewDraft
    }
    const appliedId = sender.applied?.[0] ?? null
    if (appliedId) {
      const entry = entries.find((e) => e.id === appliedId)
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
    const senderApplied =
      Boolean(sender.appliedLocked) || (sender.applied?.length ?? 0) > 0
    const recipientApplied = (recipient.applied?.length ?? 0) > 0
    /** Apply нужен всегда, в т.ч. для выключенного/пустого отправителя. */
    const isComplete = senderApplied && recipientApplied

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

export const selectSenderInListEntries = createSelector(
  [selectSenderEntriesState],
  (entries): AddressBookEntry[] =>
    entries.filter((e) => listStatusIsInQuickAddressBook(e.listStatus)),
)

export const selectRecipientInListEntries = createSelector(
  [selectRecipientEntriesState],
  (entries): AddressBookEntry[] =>
    entries.filter((e) => listStatusIsInQuickAddressBook(e.listStatus)),
)

export const selectSenderToolbarStateWithLiveAddressList = createSelector(
  [
    (s: RootState) => s.toolbar?.sender ?? {},
    (s: RootState) => s.envelopeSelection?.activeAddressList ?? null,
    selectSenderInListEntries,
  ],
  (base, activeAddressList, senderInListEntries) => {
    const senderInListEntriesCount = senderInListEntries.length
    const listOpen = activeAddressList === 'sender'
    const addressList = listOpen
      ? {
          state: 'active' as const,
          options: {
            badge:
              senderInListEntriesCount > 0 ? senderInListEntriesCount : null,
          },
        }
      : getAddressListToolbarFragment(senderInListEntriesCount)
    return { ...base, addressList }
  },
)

export const selectRecipientsToolbarStateWithLiveAddressList = createSelector(
  [
    (s: RootState) => s.toolbar?.recipients ?? {},
    (s: RootState) => s.envelopeSelection?.activeAddressList ?? null,
    selectRecipientInListEntries,
  ],
  (base, activeAddressList, recipientInListEntries) => {
    const recipientInListEntriesCount = recipientInListEntries.length
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
