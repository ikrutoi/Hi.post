import React, { useMemo } from 'react'
import clsx from 'clsx'
import type { AddressBookEntry } from '../domain/types'
import { formatAddressSummaryLines } from './addressSummaryLines'
import { AddressSummaryContent } from './AddressSummaryContent'
import styles from './AddressListRow.module.scss'
import { getToolbarIcon } from '@/shared/utils/icons'

export type EnvelopeSenderRowProps = {
  entry: AddressBookEntry
  onOpen: (entry: AddressBookEntry) => void
  onRemove: (id: string) => void
}

/** Строка отправителя на конверте: открыть карточку, убрать с конверта. */
export const EnvelopeSenderRow: React.FC<EnvelopeSenderRowProps> = ({
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
      className={clsx(styles.root, styles.rootSender)}
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
        aria-label="Remove sender from envelope"
        title="Remove sender from envelope"
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
