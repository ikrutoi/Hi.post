import React from 'react'
import clsx from 'clsx'
import type { CardtextTemplate } from '@entities/templates/domain/types/cardtextTemplate.types'
import styles from './CardtextListEntry.module.scss'
import { getToolbarIcon } from '@/shared/utils/icons'

type Props = {
  entry: CardtextTemplate
  onSelect: (entry: CardtextTemplate) => void
  onDelete: (id: string) => void
  isSelected?: boolean
  isFocused?: boolean
}

export const CardtextListEntry: React.FC<Props> = ({
  entry,
  onSelect,
  onDelete,
  isSelected = false,
  isFocused = false,
}) => {
  return (
    <div
      className={styles.root}
      data-selected={isSelected ? 'true' : undefined}
      data-focused={isFocused ? 'true' : undefined}
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
        {getToolbarIcon({ key: 'listDelete' })}
      </button>
    </div>
  )
}
