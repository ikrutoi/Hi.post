import React from 'react'
import type { CardtextTemplate } from '@cardtext/domain/types'
import styles from './CardtextListEntry.module.scss'
import { getToolbarIcon } from '@/shared/utils/icons'

type Props = {
  entry: CardtextTemplate
  onSelect: (entry: CardtextTemplate) => void
  onDelete: (id: string) => void
  onEdit?: (entry: CardtextTemplate) => void
  isStarred?: boolean
  onToggleStar?: () => void
  isSelected?: boolean
  isFocused?: boolean
}

export const CardtextListEntry: React.FC<Props> = ({
  entry,
  onSelect,
  onDelete,
  onEdit,
  isStarred = false,
  onToggleStar,
  isSelected = false,
  isFocused = false,
}) => {
  return (
    <div
      className={styles.root}
      data-selected={isSelected ? 'true' : undefined}
      data-focused={isFocused ? 'true' : undefined}
      data-has-edit={onEdit ? 'true' : undefined}
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
          aria-label={isStarred ? 'Remove from quick access' : 'Add to quick access'}
          title={isStarred ? 'Remove from quick access' : 'Add to quick access'}
        >
          ★
        </button>
      )}
      <div className={styles.field}>
        <div className={styles.info} onClick={() => onSelect(entry)}>
          {entry.title ? <strong>{entry.title}</strong> : null}
          <div>
            {entry.plainText
              ? entry.plainText.trim().slice(0, 80) +
                (entry.plainText.length > 80 ? '…' : '')
              : '—'}
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
          aria-label="Edit template"
          title="Edit template"
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
        aria-label="Delete template"
        title="Delete template"
      >
        {getToolbarIcon({ key: 'delete' })}
      </button>
    </div>
  )
}
