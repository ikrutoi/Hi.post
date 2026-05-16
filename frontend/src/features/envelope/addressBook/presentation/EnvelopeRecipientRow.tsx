import React, { useMemo } from 'react'
import clsx from 'clsx'
import type { AddressBookEntry } from '../domain/types'
import { formatAddressSummaryLines } from './addressSummaryLines'
import { AddressSummaryContent } from './AddressSummaryContent'
import styles from './AddressListRow.module.scss'
import { getToolbarIcon } from '@/shared/utils/icons'

export type EnvelopeRecipientRowProps = {
  entry: AddressBookEntry
  onOpen: (entry: AddressBookEntry) => void
  onRemove: (id: string) => void
}

/** Строка получателя на конверте: открыть карточку, убрать из списка на конверте. */
export const EnvelopeRecipientRow: React.FC<EnvelopeRecipientRowProps> = ({
  entry,
  onOpen,
  onRemove,
}) => {
  const { nameLine, cityCountryLine } = useMemo(
    () => formatAddressSummaryLines(entry),
    [entry],
  )

  return (
    <div
      className={styles.root}
      data-address-book-entry
      data-has-remove="true"
    >
      <div className={styles.field} onClick={() => onOpen(entry)}>
        <AddressSummaryContent
          nameLine={nameLine}
          cityCountryLine={cityCountryLine}
        />
      </div>
      <button
        type="button"
        className={styles.removeFromListButton}
        aria-label="Remove from recipients list"
        title="Remove from recipients list"
        onClick={(e) => {
          e.stopPropagation()
          onRemove(entry.id)
        }}
      >
        {getToolbarIcon({ key: 'clearInput' })}
      </button>
    </div>
  )
}
