import React from 'react'
import { Toolbar } from '@/features/toolbar/presentation/Toolbar'
import { AddressEntry } from '../../addressBook/presentation/AddressEntry'
import type { AddressBookEntry } from '@envelope/addressBook/domain/types'
import styles from './AddressView.module.scss'

export type RecipientsViewProps = {
  entries: AddressBookEntry[]
  onRemove: (id: string) => void
}

export const RecipientsView: React.FC<RecipientsViewProps> = ({
  entries,
  onRemove,
}) => {
  return (
    <div className={styles.savedAddressViewContainer}>
      {entries.length > 0 && (
        <div className={styles.savedAddressViewToolbar}>
          <Toolbar section="recipientsView" />
        </div>
      )}
      <div className={styles.recipientsViewList}>
        {entries.map((entry) => (
          <AddressEntry
            key={entry.id}
            entry={entry}
            onSelect={() => {}}
            onDelete={onRemove}
            deleteAction="removeFromList"
            isSelected={false}
          />
        ))}
      </div>
    </div>
  )
}
