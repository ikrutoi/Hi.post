import React from 'react'
import type { CardtextTemplate } from '@entities/templates/domain/types/cardtextTemplate.types'
import styles from './CardtextListEntry.module.scss'
import { getToolbarIcon } from '@/shared/utils/icons'

type Props = {
  entry: CardtextTemplate
  onSelect: (entry: CardtextTemplate) => void
  onDelete: (id: string) => void
  onEdit?: (entry: CardtextTemplate) => void
  isSelected?: boolean
  isFocused?: boolean
}

export const CardtextListEntry: React.FC<Props> = ({
  entry,
  onSelect,
  onDelete,
  onEdit,
  isSelected = false,
  isFocused = false,
}) => {
  return (
    <div
      className={styles.root}
      data-selected={isSelected ? 'true' : undefined}
      data-focused={isFocused ? 'true' : undefined}
      data-has-edit={onEdit ? 'true' : undefined}
    >
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
