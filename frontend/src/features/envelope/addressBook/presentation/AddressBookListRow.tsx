import React, { useMemo } from 'react'
import clsx from 'clsx'
import type { AddressBookEntry } from '../domain/types'
import { formatAddressSummaryLines } from './addressSummaryLines'
import { AddressSummaryContent } from './AddressSummaryContent'
import styles from './AddressListRow.module.scss'
import { getToolbarIcon } from '@/shared/utils/icons'

export type AddressBookListRowProps = {
  entry: AddressBookEntry
  onSelect: (entry: AddressBookEntry) => void
  onEdit?: (entry: AddressBookEntry) => void
  onDelete?: (id: string) => void
  isSelected?: boolean
  isFocused?: boolean
  variant?: 'sender' | 'recipient'
}

/** Строка в панели адресной книги: выбор, подсветка selected/focused. */
export const AddressBookListRow: React.FC<AddressBookListRowProps> = ({
  entry,
  onSelect,
  onEdit,
  onDelete,
  isSelected = false,
  isFocused = false,
  variant = 'recipient',
}) => {
  const { nameLine, cityCountryLine } = useMemo(
    () => formatAddressSummaryLines(entry),
    [entry],
  )

  const showRowActions = onEdit != null || onDelete != null

  return (
    <div
      className={clsx(styles.root, variant === 'sender' && styles.rootSender)}
      data-address-book-entry
      data-selected={isSelected ? 'true' : undefined}
      data-focused={isFocused ? 'true' : undefined}
      data-has-row-actions={showRowActions ? 'true' : undefined}
    >
      <div className={styles.field} onClick={() => onSelect(entry)}>
        <AddressSummaryContent
          nameLine={nameLine}
          cityCountryLine={cityCountryLine}
        />
      </div>
      {showRowActions && (
        <div
          className={styles.rowActions}
          onClick={(e) => e.stopPropagation()}
        >
          {onEdit != null && (
            <button
              type="button"
              className={styles.rowActionButton}
              aria-label="Edit address"
              title="Edit address"
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
              className={clsx(
                styles.rowActionButton,
                styles.rowActionButtonDelete,
              )}
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
  )
}
