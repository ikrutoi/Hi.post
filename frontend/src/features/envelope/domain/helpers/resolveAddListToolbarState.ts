import type { AddressFields } from '@shared/config/constants'
import type { AddressBookEntry } from '@envelope/addressBook/domain/types'
import { listStatusIsInQuickAddressBook } from './addressBookQuickList'
import {
  getMatchingEntryId,
  isAddressInList,
  normalizeAddressFields,
} from './isAddressInList'

export function isAddressDraftComplete(draft: AddressFields): boolean {
  return Object.values(draft).every((v) => (v ?? '').trim() !== '')
}

/** Полное совпадение черновика с записью inList (состояние listCheck на create-форме). */
export function doesDraftMatchInList(
  draft: AddressFields,
  inListEntries: Pick<AddressBookEntry, 'address'>[],
): boolean {
  if (!isAddressDraftComplete(draft)) return false
  return isAddressInList(draft, inListEntries)
}

/** Состояние иконки addList: только при полном адресе, которого ещё нет в inList. */
export function resolveAddListToolbarState(
  isAddressComplete: boolean,
  draft: AddressFields,
  inListEntries: Pick<AddressBookEntry, 'address'>[],
): 'enabled' | 'disabled' {
  if (!isAddressComplete) return 'disabled'
  if (doesDraftMatchInList(draft, inListEntries)) return 'disabled'
  return 'enabled'
}

/** Полное совпадение черновика с любым шаблоном (inList + outList). */
export function doesDraftMatchAnyTemplate(
  draft: AddressFields,
  templateEntries: Pick<AddressBookEntry, 'address'>[],
): boolean {
  if (!isAddressDraftComplete(draft)) return false
  const normalizedDraft = normalizeAddressFields(draft)
  return isAddressInList(
    normalizedDraft,
    templateEntries.map((e) => ({
      address: normalizeAddressFields(e.address ?? {}),
    })),
  )
}

export function isAddressDraftEmpty(draft: AddressFields): boolean {
  return Object.values(draft).every((v) => (v ?? '').trim() === '')
}

/** applyMedium на create-форме: enabled только если заполнены все поля. */
export function resolveApplyMediumToolbarState(
  draft: AddressFields,
): 'enabled' | 'disabled' {
  return isAddressDraftComplete(draft) ? 'enabled' : 'disabled'
}

/** @deprecated use resolveApplyMediumToolbarState */
export const resolveApplyLightToolbarState = resolveApplyMediumToolbarState

/**
 * Flags for addressAdd badge `1`: address is outside the quick template list
 * and not applied (create draft and/or current view card).
 */
export function buildAddressAddPendingFlags(input: {
  formDraft: AddressFields
  viewDraft: AddressFields
  /** `senderView` / `recipientView` — focused address card */
  isAddressViewOpen: boolean
  viewId: string | null
  appliedIds: string[]
  appliedData: AddressFields | null | undefined
  entries: Pick<AddressBookEntry, 'id' | 'address' | 'listStatus'>[]
}): {
  formDraftInQuickList: boolean
  formDraftIsApplied: boolean
  viewAddressPendingBadge: boolean
} {
  const {
    formDraft,
    viewDraft,
    isAddressViewOpen,
    viewId,
    appliedIds,
    appliedData,
    entries,
  } = input

  const normalizedForm = normalizeAddressFields(formDraft)
  const inListEntries = entries
    .filter((e) => listStatusIsInQuickAddressBook(e.listStatus))
    .map((e) => ({ address: normalizeAddressFields(e.address ?? {}) }))

  const formDraftInQuickList = doesDraftMatchInList(
    normalizedForm,
    inListEntries,
  )

  const formMatchId = getMatchingEntryId(
    normalizedForm,
    entries.map((e) => ({
      id: e.id,
      address: normalizeAddressFields(e.address ?? {}),
    })),
  )
  const formDraftIsApplied =
    (formMatchId != null && appliedIds.includes(formMatchId)) ||
    (appliedData != null &&
      isAddressInList(normalizedForm, [
        { address: normalizeAddressFields(appliedData) },
      ]))

  const viewEntry =
    viewId != null ? entries.find((e) => e.id === viewId) : undefined
  const viewInQuickList =
    viewEntry != null &&
    listStatusIsInQuickAddressBook(viewEntry.listStatus)
  const viewIsApplied = viewId != null && appliedIds.includes(viewId)
  const viewAddressPendingBadge =
    isAddressViewOpen &&
    viewId != null &&
    isAddressDraftComplete(viewDraft) &&
    !viewInQuickList &&
    !viewIsApplied

  return {
    formDraftInQuickList,
    formDraftIsApplied,
    viewAddressPendingBadge,
  }
}

export function resolveAddressAddToolbarState(params: {
  isAddressFormOpen: boolean
  formIsEmpty: boolean
  formIsComplete: boolean
  /** Complete formDraft already in the quick template list */
  formDraftInQuickList?: boolean
  /** Complete formDraft is the applied postcard address */
  formDraftIsApplied?: boolean
  /**
   * Focused view address is complete, not in the quick template list,
   * and not applied.
   */
  viewAddressPendingBadge?: boolean
}): {
  state: 'enabled' | 'disabled'
  options: { badge: number | null; badgeDot: boolean }
} {
  const {
    isAddressFormOpen,
    formIsEmpty,
    formIsComplete,
    formDraftInQuickList = false,
    formDraftIsApplied = false,
    viewAddressPendingBadge = false,
  } = params
  if (isAddressFormOpen) {
    return { state: 'disabled', options: { badge: null, badgeDot: false } }
  }

  /**
   * Partial create draft → reminder dot.
   * Complete address not in quick templates and not applied → badge `1`.
   * View address after star-off (pending badge) → icon disabled, badge stays.
   */
  const formDraftPendingBadge =
    !formIsEmpty &&
    formIsComplete &&
    !formDraftInQuickList &&
    !formDraftIsApplied
  const badge = formDraftPendingBadge || viewAddressPendingBadge ? 1 : null
  const badgeDot = !formIsEmpty && !formIsComplete

  return {
    state: viewAddressPendingBadge ? 'disabled' : 'enabled',
    options: { badge, badgeDot },
  }
}
