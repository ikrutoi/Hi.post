import React from 'react'
import type { AddressBookEntry } from '@envelope/addressBook/domain'

type Props = {
  entry: AddressBookEntry
  onSelect: (entry: AddressBookEntry) => void
  onDelete: (id: string) => void
  showRole?: boolean
}

export const AddressEntry: React.FC<Props> = ({
  entry,
  onSelect,
  onDelete,
  showRole = false,
}) => {
  return (
    <div className="address-entry">
      <div className="address-entry__info" onClick={() => onSelect(entry)}>
        {showRole && (
          <span className="address-entry__role">{entry.role === 'sender' ? 'Sender' : 'Recipient'}</span>
        )}
        {entry.label ? <strong>{entry.label}</strong> : null}
        <div>
          {[entry.address.name, entry.address.city].filter(Boolean).join(', ') || '—'}
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
