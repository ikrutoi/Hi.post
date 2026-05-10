import React from 'react'
import clsx from 'clsx'
import type { PostcardStatus } from '@entities/postcard'
import { IconX } from '@shared/ui/icons'
import { parseListEntryRecipientDetail } from '@shared/utils/listEntryRecipientDetail'
import styles from './HistoryListEntry.module.scss'

export type HistoryListEntryVariant = 'default' | 'inactive'

export type HistoryListEntryProps = {
  dateLabel: string
  previewUrl?: string | null
  detailLine?: string
  showStatusIndicator?: boolean
  variant?: HistoryListEntryVariant
  previewStatus?: PostcardStatus
  previewIsProcessed?: boolean
  onSelect?: () => void
  onDelete?: () => void
  isSelected?: boolean
  isFocused?: boolean
}

export const HistoryListEntry: React.FC<HistoryListEntryProps> = ({
  dateLabel,
  previewUrl,
  detailLine,
  showStatusIndicator = true,
  variant = 'default',
  previewStatus,
  previewIsProcessed,
  onSelect,
  onDelete,
  isSelected = false,
  isFocused = false,
}) => {
  const interactive = Boolean(onSelect)
  const labelForAria = detailLine ? `${dateLabel}, ${detailLine}` : dateLabel
  const recipientParts = parseListEntryRecipientDetail(detailLine)

  return (
    <div
      className={styles.root}
      data-postcard-status={previewStatus === 'ready' ? 'ready' : undefined}
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
          {showStatusIndicator && previewStatus && !previewIsProcessed ? (
            <span
              className={clsx(styles.statusIndicator, styles[previewStatus])}
              aria-hidden
            />
          ) : null}
        </div>
        <div className={styles.meta}>
          <div className={styles.dateLine}>{dateLabel}</div>
          {recipientParts ? (
            <div className={styles.detailBlock}>
              {recipientParts.region ? (
                <>
                  <span className={styles.detailName}>{recipientParts.name}</span>
                  <span className={styles.detailSep}>, </span>
                  <span className={styles.detailRegion}>
                    {recipientParts.region}
                  </span>
                </>
              ) : (
                <span className={styles.detailName}>{recipientParts.name}</span>
              )}
            </div>
          ) : null}
        </div>
      </div>
      {onDelete ? (
        <button
          type="button"
          className={styles.deleteButton}
          onClick={(e) => {
            e.stopPropagation()
            onDelete?.()
          }}
          aria-label="Remove date from list"
          title="Remove date from list"
        >
          <IconX />
        </button>
      ) : null}
    </div>
  )
}
