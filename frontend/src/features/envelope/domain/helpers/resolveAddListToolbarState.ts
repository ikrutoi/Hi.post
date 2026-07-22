import type { AddressFields } from '@shared/config/constants'
import type { AddressBookEntry } from '@envelope/addressBook/domain/types'
import { getMatchingEntryId, isAddressInList, normalizeAddressFields } from './isAddressInList'

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

/** applyMedium на create-форме: полный адрес, которого ещё нет среди всех шаблонов.
 *  При правке существующего шаблона (mobile create-form edit) — enabled, если адрес полный
 *  и не совпадает с другим шаблоном. */
export function resolveApplyMediumToolbarState(
  isAddressComplete: boolean,
  draft: AddressFields,
  templateEntries: Pick<AddressBookEntry, 'id' | 'address'>[],
  editingTemplateId?: string | null,
): 'enabled' | 'disabled' {
  if (!isAddressComplete) return 'disabled'
  if (editingTemplateId) {
    const normalizedDraft = normalizeAddressFields(draft)
    const matchingId = getMatchingEntryId(
      normalizedDraft,
      templateEntries.map((e) => ({
        id: e.id,
        address: normalizeAddressFields(e.address ?? {}),
      })),
    )
    if (matchingId != null && matchingId !== editingTemplateId) return 'disabled'
    return 'enabled'
  }
  if (doesDraftMatchAnyTemplate(draft, templateEntries)) return 'disabled'
  return 'enabled'
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

  const badge = formIsComplete && !formIsEmpty ? 1 : null
  const badgeDot = !formIsEmpty && !formIsComplete

  return { state: 'enabled', options: { badge, badgeDot } }
}
