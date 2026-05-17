import type { AddressFields } from '@shared/config/constants'
import type { AddressBookEntry } from '@envelope/addressBook/domain/types'
import { isAddressInList } from './isAddressInList'

/** Состояние иконки addList: только при полном адресе, которого ещё нет в inList. */
export function resolveAddListToolbarState(
  isAddressComplete: boolean,
  draft: AddressFields,
  inListEntries: Pick<AddressBookEntry, 'address'>[],
): 'enabled' | 'disabled' {
  if (!isAddressComplete) return 'disabled'
  if (isAddressInList(draft, inListEntries)) return 'disabled'
  return 'enabled'
}
