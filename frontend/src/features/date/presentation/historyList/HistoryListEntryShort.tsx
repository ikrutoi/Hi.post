import React from 'react'
import clsx from 'clsx'
import { parseListEntryRecipientDetail } from '@shared/utils/listEntryRecipientDetail'
import styles from './HistoryListEntryShort.module.scss'
import type { HistoryListEntryProps } from './HistoryListEntry'

export type { HistoryListEntryVariant } from './HistoryListEntry'
export type { HistoryListEntryProps as HistoryListEntryShortProps } from './HistoryListEntry'

export const HistoryListEntryShort: React.FC<HistoryListEntryProps> = ({
  dateLabel,
  previewUrl,
  detailLine,
  showStatusIndicator = true,
  variant = 'default',
  previewStatus,
  previewIsProcessed,
  onSelect,
  onPreviewImgError,
  isSelected = false,
  isFocused = false,
  densityLevel = 1,
}) => {
  const interactive = Boolean(onSelect)
  const labelForAria = detailLine ? `${dateLabel}, ${detailLine}` : dateLabel
  const recipientParts = parseListEntryRecipientDetail(detailLine)

  return (
    <div
      className={styles.root}
      data-density-level={densityLevel}
      data-postcard-status={
        previewStatus && !previewIsProcessed ? previewStatus : undefined
      }
      data-selected={isSelected ? 'true' : undefined}
      data-focused={isFocused ? 'true' : undefined}
      data-inactive={variant === 'inactive' ? 'true' : undefined}
      data-clickable={interactive ? 'true' : undefined}
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
            <img
              src={previewUrl}
              alt=""
              className={styles.thumbImg}
              onError={onPreviewImgError}
            />
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
    </div>
  )
}
