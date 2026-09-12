import { useMemo } from 'react'
import { useAppSelector } from '@app/hooks'
import type { AddressBookEntry } from '@envelope/addressBook/domain/types'
import { listStatusIsInQuickAddressBook } from '@envelope/domain/helpers'
import { selectRecipientEntriesState } from '@envelope/recipient/infrastructure/selectors'
import { selectSenderEntriesState } from '@envelope/sender/infrastructure/selectors'

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
  const rawEntriesFromStore: AddressBookEntry[] = useAppSelector(
    role === 'sender' ? selectSenderEntriesState : selectRecipientEntriesState,
  )

  const rawEntries = useMemo(
    () =>
      rawEntriesFromStore.filter((e) =>
        listStatusIsInQuickAddressBook(e.listStatus),
      ),
    [rawEntriesFromStore],
  )

  const sortOptions = useAppSelector((state) =>
    role === 'sender' ? state.sender.sortOptions : state.recipient.sortOptions,
  )

  const entries = useMemo(
    () => sortEntriesByName(rawEntries, sortOptions.direction),
    [rawEntries, sortOptions.direction],
  )

  return { entries, sortOptions }
}
