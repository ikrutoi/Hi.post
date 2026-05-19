import React, { useMemo } from 'react'
import clsx from 'clsx'
import { getToolbarIcon } from '@/shared/utils/icons'
import type { PanelDensity2Size } from '@shared/ui/icons'
import type { AddressBookEntry } from '../domain/types'
import { formatAddressGridCellLines } from './addressSummaryLines'
import styles from './AddressBookCell.module.scss'

export type AddressBookCellProps = {
  entry: AddressBookEntry
  onSelect: (entry: AddressBookEntry) => void
  onEdit?: (entry: AddressBookEntry) => void
  onDelete?: (id: string) => void
  isSelected?: boolean
  isFocused?: boolean
  isEditActive?: boolean
  variant?: 'sender' | 'recipient'
  density?: PanelDensity2Size
}

/** Квадратная ячейка адреса в сетке адресной книги. */
export const AddressBookCell: React.FC<AddressBookCellProps> = ({
  entry,
  onSelect,
  onEdit,
  onDelete,
  isSelected = false,
  isFocused = false,
  isEditActive = false,
  variant = 'recipient',
  density = 1,
}) => {
  const { nameLine, cityLine, countryLine } = useMemo(
    () => formatAddressGridCellLines(entry),
    [entry],
  )

  const showActions = onEdit != null || onDelete != null

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    if ((e.target as HTMLElement).closest('button')) return
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
        {showActions && (
          <div
            className={styles.actions}
            onClick={(e) => e.stopPropagation()}
          >
            {onEdit != null && (
              <button
                type="button"
                className={clsx(
                  styles.actionButton,
                  isEditActive && styles.actionButtonActive,
                )}
                aria-label="Edit address"
                title="Edit address"
                aria-pressed={isEditActive}
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(entry)
                }}
              >
                {getToolbarIcon({ key: 'edit' })}
              </button>
            )}
            {onDelete != null && (
              <button
                type="button"
                className={styles.actionButton}
                aria-label="Delete address"
                title="Delete address"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(entry.id)
                }}
              >
                {getToolbarIcon({ key: 'delete' })}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
