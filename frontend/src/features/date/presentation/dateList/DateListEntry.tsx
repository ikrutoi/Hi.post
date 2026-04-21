import React from 'react'
import { IconX } from '@shared/ui/icons'
import styles from './DateListEntry.module.scss'

export type DateListEntryVariant = 'default' | 'inactive'

export type DateListEntryProps = {
  dateLabel: string
  previewUrl?: string | null
  detailLine?: string
  variant?: DateListEntryVariant
  onSelect?: () => void
  onDelete?: () => void
  isSelected?: boolean
  isFocused?: boolean
}

export const DateListEntry: React.FC<DateListEntryProps> = ({
  dateLabel,
  previewUrl,
  detailLine,
  variant = 'default',
  onSelect,
  onDelete,
  isSelected = false,
  isFocused = false,
}) => {
  const interactive = Boolean(onSelect)
  const labelForAria = detailLine ? `${dateLabel}, ${detailLine}` : dateLabel
  const dateLineText = detailLine ? `${dateLabel} - ${detailLine}` : dateLabel

  return (
    <div
      className={styles.root}
      data-selected={isSelected ? 'true' : undefined}
      data-focused={isFocused ? 'true' : undefined}
      data-inactive={variant === 'inactive' ? 'true' : undefined}
      data-clickable={interactive ? 'true' : undefined}
      data-has-delete={onDelete ? 'true' : undefined}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? labelForAria : undefined}
      onClick={interactive ? () => onSelect?.() : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelect?.()
              }
            }
          : undefined
      }
    >
      <div className={styles.body}>
        <div className={styles.thumb} aria-hidden>
          {previewUrl ? (
            <img src={previewUrl} alt="" className={styles.thumbImg} />
          ) : null}
        </div>
        <div className={styles.meta}>
          <div className={styles.dateLine}>{dateLineText}</div>
        </div>
      </div>
      {onDelete ? (
        <button
          type="button"
          className={styles.deleteButton}
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          aria-label="Remove this postcard from the list"
          title="Remove this postcard from the list"
        >
          <IconX />
        </button>
      ) : null}
    </div>
  )
}
