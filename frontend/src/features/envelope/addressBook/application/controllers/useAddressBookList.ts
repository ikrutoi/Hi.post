import { useAppSelector } from '@app/hooks'
import type { AddressBookEntry } from '@envelope/addressBook/domain/types'

/**
 * Список адресов — единственный источник правды в Redux (addressBookSlice).
 * Синхронизация с БД через addressBookSyncSaga по incrementAddressBookReloadVersion.
 */
export const useAddressBookList = (role: 'sender' | 'recipient') => {
  const entries: AddressBookEntry[] = useAppSelector((state) =>
    role === 'sender'
      ? state.addressBook?.senderEntries ?? []
      : state.addressBook?.recipientEntries ?? [],
  )

  return { entries }
}
