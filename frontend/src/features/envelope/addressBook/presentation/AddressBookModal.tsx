import React from 'react'
import { useAddressBookList } from '@envelope/addressBook/application/controllers'
import { AddressEntry } from './AddressEntry'
import type { AddressBookEntry } from '@envelope/addressBook/domain'

type Props = {
  role: 'sender' | 'recipient'
  onSelect: (entry: AddressBookEntry) => void
  onClose: () => void
}

export const AddressBookModal: React.FC<Props> = ({
  role,
  onSelect,
  onClose,
}) => {
  const { entries } = useAddressBookList(role)

  return (
    <div className="address-book">
      <div className="address-book__header">
        <h3>Address book: {role === 'sender' ? 'Sender' : 'Recipient'}</h3>
        <button onClick={onClose}>Close</button>
      </div>

      <div className="address-book__list">
        {entries.map((entry) => (
          <AddressEntry
            key={entry.id}
            entry={entry}
            onSelect={onSelect}
            onDelete={(id) => console.log('Delete', id)}
          />
        ))}
      </div>
    </div>
  )
}
