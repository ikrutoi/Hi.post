import React from 'react'
import clsx from 'clsx'
import type { AddressBookEntry } from '@envelope/addressBook/domain/types'
import styles from './AddressEntry.module.scss'
import { getToolbarIcon } from '@/shared/utils/icons'

type Props = {
  entry: AddressBookEntry
  onSelect: (entry: AddressBookEntry) => void
  onDelete: (id: string) => void
  /** 'delete' — удаление адреса (иконка корзины), 'removeFromList' — убрать из списка (иконка close/clear) */
  deleteAction?: 'delete' | 'removeFromList'
  isStarred?: boolean
  isSelected?: boolean
  onToggleStar?: () => void
  variant?: 'sender' | 'recipient'
}

export const AddressEntry: React.FC<Props> = ({
  entry,
  onSelect,
  onDelete,
  deleteAction = 'delete',
  isStarred = false,
  isSelected = false,
  onToggleStar,
  variant = 'recipient',
}) => {
  const isRemoveFromList = deleteAction === 'removeFromList'
  const actionIconKey = isRemoveFromList ? 'clearInput' : 'delete'
  const actionLabel = isRemoveFromList ? 'Remove from list' : 'Delete address'
  return (
    <div
      className={clsx(styles.root, variant === 'sender' && styles.rootSender)}
      data-selected={isSelected ? 'true' : undefined}
      data-no-star={!onToggleStar ? 'true' : undefined}
    >
      {onToggleStar && (
        <button
          type="button"
          className={styles.star}
          data-starred={isStarred ? 'true' : undefined}
          onClick={(e) => {
            e.stopPropagation()
            onToggleStar()
          }}
          aria-label={
            isStarred ? 'Remove from quick access' : 'Add to quick access'
          }
          title={isStarred ? 'Remove from quick access' : 'Add to quick access'}
        >
          ★
        </button>
      )}
      <div className={styles.field}>
        <div className={styles.info} onClick={() => onSelect(entry)}>
          {entry.label ? <strong>{entry.label}</strong> : null}
          <div>
            {[entry.address.name, entry.address.city]
              .filter(Boolean)
              .join(', ') || '—'}
          </div>
        </div>
      </div>
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
