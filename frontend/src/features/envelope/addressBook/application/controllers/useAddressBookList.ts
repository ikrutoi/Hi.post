import { useEffect, useState } from 'react'
import { senderAdapter, recipientAdapter } from '@db/adapters/storeAdapters'
import type { AddressBookEntry } from '@envelope/addressBook/domain/types'
import type { AddressTemplateItem } from '@entities/envelope/domain/types'

function toAddressBookEntry(
  item: AddressTemplateItem,
  role: 'sender' | 'recipient'
): AddressBookEntry {
  const address = item.address ?? {}
  return {
    id: String(item.id),
    role,
    address: {
      name: address.name ?? '',
      street: address.street ?? '',
      city: address.city ?? '',
      zip: address.zip ?? '',
      country: address.country ?? '',
    },
    label: undefined,
    createdAt: new Date().toISOString(),
  }
}

export const useAddressBookList = (role: 'sender' | 'recipient') => {
  const [entries, setEntries] = useState<AddressBookEntry[]>([])

  useEffect(() => {
    const fetch = async () => {
      try {
        const adapter = role === 'sender' ? senderAdapter : recipientAdapter
        const raw = await adapter.getAll()
        const list = Array.isArray(raw) ? raw.map((r) => toAddressBookEntry(r, role)) : []
        setEntries(list)
      } catch (e) {
        console.warn('useAddressBookList:', e)
        setEntries([])
      }
    }
    fetch()
  }, [role])

  return { entries }
}
