import React from 'react'
import { AddressBookCell } from '../../addressBook/presentation/AddressBookCell'
import type { AddressBookEntry } from '@envelope/addressBook/domain/types'
import styles from './AddressView.module.scss'
import { ScrollArea } from '@/shared/ui/ScrollArea/ScrollArea'

export type RecipientsViewProps = {
  entries: AddressBookEntry[]
  /** Kept for call-site compatibility; clear-all lives on listDelete toolbar. */
  onRemove?: (id: string) => void
  scrollbarPortalTarget?: React.RefObject<HTMLElement | null>
  onOpenRecipient: (entry: AddressBookEntry) => void
}

/** Multi recipients on the envelope: template-list cells at compact density. */
export const RecipientsView: React.FC<RecipientsViewProps> = ({
  entries,
  scrollbarPortalTarget,
  onOpenRecipient,
}) => {
  return (
    <div className={styles.savedAddressViewContainer} data-envelope-address-surface>
      <ScrollArea
        className={styles.savedAddressViewScrollSlot}
        scrollbarPortalTarget={scrollbarPortalTarget}
      >
        <div className={styles.recipientsViewGrid} data-density-level={2}>
          {entries.map((entry) => (
            <AddressBookCell
              key={entry.id}
              entry={entry}
              onSelect={onOpenRecipient}
              variant="recipient"
              density={2}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
