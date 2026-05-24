import React, { useMemo } from 'react'
import clsx from 'clsx'
import type { PanelDensity2Size } from '@shared/ui/icons'
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
  density?: PanelDensity2Size
}

/** Строка в панели адресной книги: выбор, подсветка selected/focused. */
export const AddressBookListRow: React.FC<AddressBookListRowProps> = ({
  entry,
  onSelect,
  isSelected = false,
  isFocused = false,
  variant = 'recipient',
  density = 1,
}) => {
  const { nameLine, cityCountryLine } = useMemo(
    () => formatAddressSummaryLines(entry),
    [entry],
  )

  const handleRowMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    e.preventDefault()
    onSelect(entry)
  }

  return (
    <div
      className={clsx(styles.root, variant === 'sender' && styles.rootSender)}
      data-address-book-entry
      data-density-level={density}
      data-selected={isSelected ? 'true' : undefined}
      data-focused={isFocused ? 'true' : undefined}
      onMouseDown={handleRowMouseDown}
    >
      <div className={styles.body}>
        <div className={styles.field}>
          <AddressSummaryContent
            nameLine={nameLine}
            cityCountryLine={cityCountryLine}
          />
        </div>
      </div>
    </div>
  )
}
