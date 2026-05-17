import React from 'react'
import { Toolbar } from '@/features/toolbar/presentation/Toolbar'
import { EnvelopeRecipientRow } from '../../addressBook/presentation/EnvelopeRecipientRow'
import type { AddressBookEntry } from '@envelope/addressBook/domain/types'
import styles from './AddressView.module.scss'
import { ScrollArea } from '@/shared/ui/ScrollArea/ScrollArea'

export type RecipientsViewProps = {
  entries: AddressBookEntry[]
  onRemove: (id: string) => void
  scrollbarPortalTarget?: React.RefObject<HTMLElement | null>
  onOpenRecipient: (entry: AddressBookEntry) => void
}

export const RecipientsView: React.FC<RecipientsViewProps> = ({
  entries,
  onRemove,
  scrollbarPortalTarget,
  onOpenRecipient,
}) => {
  return (
    <div className={styles.savedAddressViewContainer} data-envelope-address-surface>
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
            <EnvelopeRecipientRow
              key={entry.id}
              entry={entry}
              onOpen={onOpenRecipient}
              onRemove={onRemove}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
