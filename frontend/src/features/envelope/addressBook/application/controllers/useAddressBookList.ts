import { useEffect, useState } from 'react'
import { getAllRecordsAddresses } from '@utils/cardFormNav/indexDB/indexDb'
import type { AddressBookEntry } from '@envelope/addressBook/domain'

export const useAddressBookList = (role: 'sender' | 'recipient') => {
  const [entries, setEntries] = useState<AddressBookEntry[]>([])

  useEffect(() => {
    const fetch = async () => {
      const raw = await getAllRecordsAddresses(role)
      setEntries(raw ?? [])
    }
    fetch()
  }, [role])

  return { entries }
}
