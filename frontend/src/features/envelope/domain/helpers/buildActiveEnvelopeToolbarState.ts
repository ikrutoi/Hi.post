import type { AddressFields } from '@shared/config/constants'
import type { AddressBookEntry } from '@envelope/addressBook/domain/types'
import type { SenderState } from '@envelope/sender/domain/types'
import type { RecipientState } from '@envelope/recipient/domain/types'
import type { EnvelopeToolbarState } from '@toolbar/domain/types'
import {
  buildSenderToolbarState,
  buildRecipientToolbarState,
  getAddressListToolbarFragment,
  isAddressDraftComplete,
  isAddressInList,
} from '@envelope/domain/helpers'

function hasAddressData(data: AddressFields): boolean {
  return Object.values(data).some((v) => (v ?? '').trim() !== '')
}

function formIsEmptyFlag(data: AddressFields): boolean {
  return !hasAddressData(data)
}

/**
 * Same builders + apply rules as `processEnvelopeVisuals`, but fed by archive
 * sandbox sender (right cart envelope). Address-book badge counts are shared.
 */
export function buildSandboxSenderToolbarState(input: {
  sender: SenderState
  addressListCount: number
  listOpen: boolean
  inListEntries: Pick<AddressBookEntry, 'address'>[]
}): EnvelopeToolbarState {
  const { sender, addressListCount, listOpen, inListEntries } = input
  const draft =
    sender.currentView === 'senderCreate' ? sender.formDraft : sender.viewDraft
  const draftComplete = isAddressDraftComplete(draft as AddressFields)
  const formDraft = sender.formDraft as AddressFields

  const base = buildSenderToolbarState({
    isComplete: draftComplete,
    hasData: hasAddressData(sender.viewDraft as AddressFields),
    addressListCount,
    isCurrentAddressInList: isAddressInList(
      sender.viewDraft as AddressFields,
      inListEntries,
    ),
    hasDraft: hasAddressData(sender.viewDraft as AddressFields),
    isAddressFormOpen: sender.currentView === 'senderCreate',
    formIsEmpty: formIsEmptyFlag(formDraft),
    formIsComplete: isAddressDraftComplete(formDraft),
    senderListPanelOpen: listOpen,
    isEnabled: sender.enabled,
  })

  const appliedIds = sender.applied ?? []
  const senderViewMatchesApplied =
    sender.currentView === 'senderView' &&
    sender.senderViewId != null &&
    appliedIds.length === 1 &&
    appliedIds[0] === sender.senderViewId

  const applyState: 'disabled' | 'selected' | 'enabled' =
    sender.currentView === 'senderCreate'
      ? 'disabled'
      : !sender.enabled
        ? sender.appliedLocked || appliedIds.length > 0
          ? 'selected'
          : 'enabled'
        : senderViewMatchesApplied
          ? 'selected'
          : draftComplete
            ? 'enabled'
            : 'disabled'

  return {
    ...base,
    apply: { state: applyState, options: {} },
    addressList: listOpen
      ? {
          state: 'active' as const,
          options: {
            badge: addressListCount > 0 ? addressListCount : null,
          },
        }
      : getAddressListToolbarFragment(addressListCount),
  }
}

/**
 * Same builders as left recipients toolbar; apply mirrors session rules with
 * single-view support (recipientViewId + complete draft) used by apply saga.
 */
export function buildSandboxRecipientsToolbarState(input: {
  recipient: RecipientState
  addressListCount: number
  listOpen: boolean
  inListEntries: Pick<AddressBookEntry, 'address'>[]
}): EnvelopeToolbarState {
  const { recipient, addressListCount, listOpen, inListEntries } = input
  const draft =
    recipient.currentView === 'recipientCreate'
      ? recipient.formDraft
      : recipient.viewDraft
  const draftComplete = isAddressDraftComplete(draft as AddressFields)
  const formDraft = recipient.formDraft as AddressFields

  const base = buildRecipientToolbarState({
    isComplete: draftComplete,
    hasData: hasAddressData(recipient.viewDraft as AddressFields),
    addressListCount,
    isCurrentAddressInList: isAddressInList(
      recipient.viewDraft as AddressFields,
      inListEntries,
    ),
    hasDraft: hasAddressData(recipient.viewDraft as AddressFields),
    isAddressFormOpen: recipient.currentView === 'recipientCreate',
    formIsEmpty: formIsEmptyFlag(formDraft),
    formIsComplete: isAddressDraftComplete(formDraft),
    recipientListPanelOpen: listOpen,
  })

  const viewIds =
    recipient.currentRecipientsList === 'second'
      ? (recipient.recipientsViewIdsSecondList ?? [])
      : (recipient.recipientsViewIdsFirstList ?? [])
  const appliedIds = recipient.applied ?? []
  const recipientViewId = recipient.recipientViewId
  const isFormOpen = recipient.currentView === 'recipientCreate'

  const recipientsViewIdsEqual =
    appliedIds.length === viewIds.length &&
    appliedIds.length > 0 &&
    appliedIds.every((id) => viewIds.includes(id)) &&
    viewIds.every((id) => appliedIds.includes(id))

  const singleViewMatchesApplied =
    viewIds.length === 0 &&
    recipientViewId != null &&
    appliedIds.length === 1 &&
    appliedIds[0] === recipientViewId

  let applyState: 'disabled' | 'selected' | 'enabled'
  if (isFormOpen) {
    applyState = 'disabled'
  } else if (recipientsViewIdsEqual || singleViewMatchesApplied) {
    applyState = 'selected'
  } else if (draftComplete && (viewIds.length > 0 || recipientViewId != null)) {
    applyState = 'enabled'
  } else if (draftComplete && viewIds.length === 0 && recipientViewId == null) {
    /** Empty list but full draft — same as prior sandbox edit toolbar. */
    applyState = 'enabled'
  } else {
    applyState = 'disabled'
  }

  return {
    ...base,
    apply: { state: applyState, options: {} },
    addressList: listOpen
      ? {
          state: 'active' as const,
          options: {
            badge: addressListCount > 0 ? addressListCount : null,
          },
        }
      : getAddressListToolbarFragment(addressListCount),
  }
}
