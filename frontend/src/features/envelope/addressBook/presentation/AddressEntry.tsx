import React from 'react'
import clsx from 'clsx'
import type { AddressBookEntry } from '@envelope/addressBook/domain/types'
import styles from './AddressEntry.module.scss'
import { getToolbarIcon } from '@/shared/utils/icons'

type Props = {
  entry: AddressBookEntry
  onSelect: (entry: AddressBookEntry) => void
  onDelete: (id: string) => void
  deleteAction?: 'delete' | 'removeFromList'
  onEdit?: (entry: AddressBookEntry) => void
  isSelected?: boolean
  isFocused?: boolean
  variant?: 'sender' | 'recipient'
}

export const AddressEntry: React.FC<Props> = ({
  entry,
  onSelect,
  onDelete,
  deleteAction = 'delete',
  onEdit,
  isSelected = false,
  isFocused = false,
  variant = 'recipient',
}) => {
  const isRemoveFromList = deleteAction === 'removeFromList'
  const actionIconKey = isRemoveFromList ? 'clearInput' : 'delete'
  const actionLabel = isRemoveFromList ? 'Remove from list' : 'Delete address'
  return (
    <div
      className={clsx(styles.root, variant === 'sender' && styles.rootSender)}
      data-selected={isSelected ? 'true' : undefined}
      data-focused={isFocused ? 'true' : undefined}
      data-has-edit={onEdit ? 'true' : undefined}
    >
      <div className={styles.field}>
        <div className={styles.info} onClick={() => onSelect(entry)}>
          <strong>
            {entry.label ?? (entry.address.name || '—')}
          </strong>
          <div>
            {entry.label
              ? [entry.address.name, entry.address.city, entry.address.country]
                  .filter(Boolean)
                  .join(', ') || '—'
              : [entry.address.city, entry.address.country]
                  .filter(Boolean)
                  .join(', ') || '—'}
          </div>
        </div>
      </div>
      {onEdit && (
        <button
          type="button"
          className={styles.editButton}
          onClick={(e) => {
            e.stopPropagation()
            onEdit(entry)
          }}
          aria-label="Edit address"
          title="Edit address"
        >
          {getToolbarIcon({ key: 'edit' })}
        </button>
      )}
      <button
        type="button"
        className={styles.deleteButton}
        onClick={(e) => {
          e.stopPropagation()
          onDelete(entry.id)
        }}
        aria-label={actionLabel}
        title={actionLabel}
      >
        {getToolbarIcon({ key: actionIconKey })}
      </button>
    </div>
  )
}
