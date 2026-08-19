import React from 'react'
import clsx from 'clsx'
import { AddressBookCell } from '../../addressBook/presentation/AddressBookCell'
import type { AddressBookEntry } from '@envelope/addressBook/domain/types'
import styles from './AddressView.module.scss'
import { ScrollArea } from '@/shared/ui/ScrollArea/ScrollArea'

export type RecipientsViewProps = {
  entries: AddressBookEntry[]
  /** Kept for call-site compatibility; clear-all lives on listClose toolbar. */
  onRemove?: (id: string) => void
  scrollbarPortalTarget?: React.RefObject<HTMLElement | null>
  onOpenRecipient: (entry: AddressBookEntry) => void
}

/** Multi recipients on the envelope: 4 square cells across the form. */
export const RecipientsView: React.FC<RecipientsViewProps> = ({
  entries,
  scrollbarPortalTarget,
  onOpenRecipient,
}) => {
  return (
    <div
      className={clsx(
        styles.savedAddressViewContainer,
        /** Без max-height: 90% — иначе скролл появляется при свободном месте снизу. */
        styles.savedAddressViewContainerFill,
      )}
      data-envelope-address-surface
    >
      <ScrollArea
        className={styles.savedAddressViewScrollSlot}
        scrollbarPortalTarget={scrollbarPortalTarget}
        selectionAccentThumb
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
