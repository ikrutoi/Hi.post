import React from 'react'
import type { AddressBookEntry } from '@envelope/addressBook/domain'

type Props = {
  entry: AddressBookEntry
  onSelect: (entry: AddressBookEntry) => void
  onDelete: (id: string) => void
}

export const AddressEntry: React.FC<Props> = ({
  entry,
  onSelect,
  onDelete,
}) => {
  return (
    <div className="address-entry">
      <div className="address-entry__info" onClick={() => onSelect(entry)}>
        <strong>{entry.label ?? 'Без метки'}</strong>
        <div>
          {entry.address.name}, {entry.address.city}
        </div>
      </div>
      <button
        className="address-entry__delete"
        onClick={() => onDelete(entry.id)}
      >
        ✕
      </button>
    </div>
  )
}
