import React from 'react'
import { IconX } from '@shared/ui/icons'
import { getToolbarIcon } from '@shared/utils/icons'
import styles from './CardPieListEntry.module.scss'

export type CardPieListEntryVariant = 'default' | 'inactive'

export type CardPieListEntryProps = {
  dateLabel: string
  previewUrl?: string | null
  detailLine?: string
  variant?: CardPieListEntryVariant
  onSelect?: () => void
  onDelete?: () => void
  isSelected?: boolean
  isFocused?: boolean
  isStarred?: boolean
  onToggleStar?: () => void
}

export const CardPieListEntry: React.FC<CardPieListEntryProps> = ({
  dateLabel,
  previewUrl,
  detailLine,
  variant = 'default',
  onSelect,
  onDelete,
  isSelected = false,
  isFocused = false,
  isStarred = false,
  onToggleStar,
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
        <div className={styles.favoriteSlot}>
          {onToggleStar ? (
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
              title={
                isStarred ? 'Remove from quick access' : 'Add to quick access'
              }
            >
              ★
            </button>
          ) : (
            <span className={styles.starStatic} aria-hidden>
              ★
            </span>
          )}
        </div>
        <div className={styles.thumb} aria-hidden>
          {previewUrl ? (
            <img src={previewUrl} alt="" className={styles.thumbImg} />
          ) : (
            <div className={styles.thumbPlaceholder}>
              {getToolbarIcon({ key: 'cardphoto' })}
            </div>
          )}
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
