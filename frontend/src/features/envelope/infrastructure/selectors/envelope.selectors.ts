import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@app/state'
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
import {
  getMatchingEntryId,
  getAddressListToolbarFragment,
} from '../../domain/helpers'

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
    activeAddressList?: 'sender' | 'recipient' | 'recipients' | null
    recipientListPanelOpen: boolean
    senderListPanelOpen: boolean
    senderViewEditMode?: boolean
    recipientViewEditMode?: boolean
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
      role === 'sender' ? senderCount > 0 : recipientCount > 0,
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

export const selectSenderViewEditMode = createSelector(
  [selectEnvelopeSelectionState],
  (s) => s.senderViewEditMode ?? false,
)

export const selectRecipientViewEditMode = createSelector(
  [selectEnvelopeSelectionState],
  (s) => s.recipientViewEditMode ?? false,
)

export const selectRecipientsList = selectRecipientsListState

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
        ? recipient.formDraft
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

export const selectRecipientsToolbarStateWithLiveAddressList = createSelector(
  [
    (s: RootState) => s.toolbar?.recipients ?? {},
    (s: RootState) => s.envelopeSelection?.activeAddressList ?? null,
    (s: RootState) => s.addressBook?.recipientEntries?.length ?? 0,
  ],
  (base, activeAddressList, recipientCount) => {
    // Список открыт: либо уже 'recipients', либо переход с 'recipient' (без мигания иконки)
    const listOpen =
      activeAddressList === 'recipient' || activeAddressList === 'recipients'
    const addressList = listOpen
      ? {
          state: 'active' as const,
          options: {
            badge: recipientCount > 0 ? recipientCount : null,
          },
        }
      : getAddressListToolbarFragment(recipientCount)
    return { ...base, addressList }
  },
)
