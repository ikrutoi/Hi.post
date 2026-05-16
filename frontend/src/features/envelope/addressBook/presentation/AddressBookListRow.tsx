import React, { useMemo } from 'react'
import clsx from 'clsx'
import type { AddressBookEntry } from '../domain/types'
import { formatAddressSummaryLines } from './addressSummaryLines'
import { AddressSummaryContent } from './AddressSummaryContent'
import styles from './AddressListRow.module.scss'

export type AddressBookListRowProps = {
  entry: AddressBookEntry
  onSelect: (entry: AddressBookEntry) => void
  isSelected?: boolean
  isFocused?: boolean
  variant?: 'sender' | 'recipient'
}

/** Строка в панели адресной книги: выбор, подсветка selected/focused. */
export const AddressBookListRow: React.FC<AddressBookListRowProps> = ({
  entry,
  onSelect,
  isSelected = false,
  isFocused = false,
  variant = 'recipient',
}) => {
  const { nameLine, cityCountryLine } = useMemo(
    () => formatAddressSummaryLines(entry),
    [entry],
  )

  return (
    <div
      className={clsx(styles.root, variant === 'sender' && styles.rootSender)}
      data-address-book-entry
      data-selected={isSelected ? 'true' : undefined}
      data-focused={isFocused ? 'true' : undefined}
    >
      <div className={styles.field} onClick={() => onSelect(entry)}>
        <AddressSummaryContent
          nameLine={nameLine}
          cityCountryLine={cityCountryLine}
        />
      </div>
    </div>
  )
}
