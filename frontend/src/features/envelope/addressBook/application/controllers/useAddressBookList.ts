import { useAppSelector } from '@app/hooks'
import type { AddressBookEntry } from '@envelope/addressBook/domain/types'

export const useAddressBookList = (role: 'sender' | 'recipient') => {
  const entries: AddressBookEntry[] = useAppSelector((state) =>
    role === 'sender'
      ? (state.addressBook?.senderEntries ?? [])
      : (state.addressBook?.recipientEntries ?? []),
  )

  return { entries }
}
