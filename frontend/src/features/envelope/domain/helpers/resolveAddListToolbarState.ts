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

/** applyLight на create-форме: полный адрес, которого ещё нет среди всех шаблонов. */
export function resolveApplyLightToolbarState(
  isAddressComplete: boolean,
  draft: AddressFields,
  templateEntries: Pick<AddressBookEntry, 'address'>[],
): 'enabled' | 'disabled' {
  if (!isAddressComplete) return 'disabled'
  if (doesDraftMatchAnyTemplate(draft, templateEntries)) return 'disabled'
  return 'enabled'
}

/** View показывает адрес из create-черновика (тот же шаблон, что и formDraft). */
export function isViewingFormDraftAddress(params: {
  view: string
  viewId: string | null
  formIsEmpty: boolean
  formDraft: AddressFields
  templateEntries: Pick<AddressBookEntry, 'id' | 'address'>[]
}): boolean {
  const { view, viewId, formIsEmpty, formDraft, templateEntries } = params
  if (formIsEmpty || viewId == null) return false
  if (view !== 'senderView' && view !== 'recipientView') return false
  const draftId = getMatchingEntryId(
    normalizeAddressFields(formDraft),
    templateEntries.map((e) => ({
      id: e.id,
      address: normalizeAddressFields(e.address ?? {}),
    })),
  )
  return draftId != null && draftId === viewId
}

export function resolveAddressAddToolbarState(params: {
  isAddressFormOpen: boolean
  formIsEmpty: boolean
  viewingFormDraftAddress: boolean
}): { state: 'enabled' | 'disabled'; options: { badge: number | null } } {
  const { isAddressFormOpen, formIsEmpty, viewingFormDraftAddress } = params
  if (isAddressFormOpen) {
    return { state: 'disabled', options: { badge: null } }
  }
  const badge = !formIsEmpty ? 1 : null
  if (viewingFormDraftAddress) {
    return { state: 'disabled', options: { badge } }
  }
  return { state: 'enabled', options: { badge } }
}
