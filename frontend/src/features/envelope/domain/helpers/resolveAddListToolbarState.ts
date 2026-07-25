import type { AddressFields } from '@shared/config/constants'
import type { AddressBookEntry } from '@envelope/addressBook/domain/types'
import { isAddressInList, normalizeAddressFields } from './isAddressInList'

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

export function resolveAddressAddToolbarState(params: {
  isAddressFormOpen: boolean
  formIsEmpty: boolean
  formIsComplete: boolean
}): {
  state: 'enabled' | 'disabled'
  options: { badge: number | null; badgeDot: boolean }
} {
  const { isAddressFormOpen, formIsEmpty, formIsComplete } = params
  if (isAddressFormOpen) {
    return { state: 'disabled', options: { badge: null, badgeDot: false } }
  }

  /** Dot only: draft exists but not all fields filled. No numeric badge. */
  const badgeDot = !formIsEmpty && !formIsComplete

  return { state: 'enabled', options: { badge: null, badgeDot } }
}
