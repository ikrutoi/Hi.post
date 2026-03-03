import { useMemo } from 'react'
import { useAppSelector } from '@app/hooks'
import type { AddressBookEntry } from '@envelope/addressBook/domain/types'

function sortEntriesByName(
  entries: AddressBookEntry[],
  direction: 'asc' | 'desc',
): AddressBookEntry[] {
  const sorted = [...entries].sort((a, b) =>
    (a.address?.name ?? '').trim().localeCompare(
      (b.address?.name ?? '').trim(),
      undefined,
      { sensitivity: 'base' },
    ),
  )
  return direction === 'desc' ? sorted.reverse() : sorted
}

export const useAddressBookList = (role: 'sender' | 'recipient') => {
  const rawEntries: AddressBookEntry[] = useAppSelector((state) =>
    role === 'sender'
      ? (state.addressBook?.senderEntries ?? [])
      : (state.addressBook?.recipientEntries ?? []),
  )

  const sortOptions = useAppSelector((state) =>
    role === 'sender'
      ? state.sender?.sortOptions ?? { sortedBy: 'name', direction: 'asc' }
      : state.recipient?.sortOptions ?? { sortedBy: 'name', direction: 'asc' },
  )

  const entries = useMemo(
    () => sortEntriesByName(rawEntries, sortOptions.direction),
    [rawEntries, sortOptions.direction],
  )

  return { entries, sortOptions }
}
