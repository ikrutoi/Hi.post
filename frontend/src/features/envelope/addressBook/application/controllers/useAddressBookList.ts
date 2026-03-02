import { useMemo } from 'react'
import { useAppSelector } from '@app/hooks'
import type { AddressBookEntry } from '@envelope/addressBook/domain/types'

/** Массив в сторе: старые → новые (push). Для отображения отдаём с конца (новые сверху). */
export const useAddressBookList = (role: 'sender' | 'recipient') => {
  const rawEntries: AddressBookEntry[] = useAppSelector((state) =>
    role === 'sender'
      ? (state.addressBook?.senderEntries ?? [])
      : (state.addressBook?.recipientEntries ?? []),
  )

  const entries = useMemo(
    () => [...rawEntries].reverse(),
    [rawEntries],
  )

  return { entries }
}
