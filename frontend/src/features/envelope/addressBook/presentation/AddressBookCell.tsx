import React, { useMemo } from 'react'
import clsx from 'clsx'
import type { PanelDensity2Size } from '@shared/ui/icons'
import type { AddressBookEntry } from '../domain/types'
import { formatAddressGridCellLines } from './addressSummaryLines'
import styles from './AddressBookCell.module.scss'

export type AddressBookCellProps = {
  entry: AddressBookEntry
  onSelect: (entry: AddressBookEntry) => void
  isSelected?: boolean
  isFocused?: boolean
  variant?: 'sender' | 'recipient'
  density?: PanelDensity2Size
}

/** Квадратная ячейка адреса в сетке адресной книги. */
export const AddressBookCell: React.FC<AddressBookCellProps> = ({
  entry,
  onSelect,
  isSelected = false,
  isFocused = false,
  variant = 'recipient',
  density = 1,
}) => {
  const { nameLine, cityLine, countryLine } = useMemo(
    () => formatAddressGridCellLines(entry),
    [entry],
  )

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
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
      onMouseDown={handleMouseDown}
    >
      <div className={styles.body}>
        <div className={styles.text}>
          <div className={styles.nameLine}>{nameLine}</div>
          <div className={styles.cityLine}>{cityLine}</div>
          <div className={styles.countryLine}>{countryLine}</div>
        </div>
      </div>
    </div>
  )
}
