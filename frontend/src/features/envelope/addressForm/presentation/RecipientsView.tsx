import React from 'react'
import { Toolbar } from '@/features/toolbar/presentation/Toolbar'
import { AddressEntry } from '../../addressBook/presentation/AddressEntry'
import type { AddressBookEntry } from '@envelope/addressBook/domain/types'
import styles from './AddressView.module.scss'
import { ScrollArea } from '@/shared/ui/ScrollArea/ScrollArea'

export type RecipientsViewProps = {
  entries: AddressBookEntry[]
  scrollbarPortalTarget?: React.RefObject<HTMLElement | null>
  onEdit: (entry: AddressBookEntry) => void
}

export const RecipientsView: React.FC<RecipientsViewProps> = ({
  entries,
  scrollbarPortalTarget,
  onEdit,
}) => {
  return (
    <div className={styles.savedAddressViewContainer}>
      {entries.length > 0 && (
        <div className={styles.savedAddressViewToolbar}>
          <Toolbar section="recipientsView" />
        </div>
      )}
      <ScrollArea
        className={styles.savedAddressViewScrollSlot}
        scrollbarPortalTarget={scrollbarPortalTarget}
      >
        <div className={styles.recipientsViewList}>
          {entries.map((entry) => (
            <AddressEntry
              key={entry.id}
              entry={entry}
              onSelect={(e) => onEdit(e)}
              isSelected={false}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
