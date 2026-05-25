import React from 'react'
import type { PostcardStatus } from '@entities/postcard'
import type { PanelDensity2Size } from '@shared/ui/icons'
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
  onPreviewImgError?: () => void
  isSelected?: boolean
  isFocused?: boolean
  /** Плотность сетки списка истории: 1 — 4 ячейки, 2 — 5 ячеек. */
  densityLevel?: PanelDensity2Size
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
  onPreviewImgError,
  isSelected = false,
  isFocused = false,
  densityLevel = 1,
}) => {
  const interactive = Boolean(onSelect)
  const labelForAria = detailLine ? `${dateLabel}, ${detailLine}` : dateLabel
  const recipientParts = parseListEntryRecipientDetail(detailLine)
  const recipientName = recipientParts?.name ?? detailLine ?? ''
  const recipientCountry = recipientParts?.region ?? ''

  return (
    <div
      className={styles.root}
      data-postcard-status={
        previewStatus === 'ready' ||
        previewStatus === 'sent' ||
        previewStatus === 'delivered' ||
        previewStatus === 'error'
          ? previewStatus
          : undefined
      }
      data-selected={isSelected ? 'true' : undefined}
      data-focused={isFocused ? 'true' : undefined}
      data-density-level={densityLevel}
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
            className={styles.statusIndicator}
            data-status={previewStatus}
            aria-hidden
          />
        ) : null}
      </div>
      <div className={styles.dateLine}>{dateLabel}</div>
      {recipientName ? (
        <div className={styles.detailBlock}>{recipientName}</div>
      ) : null}
      {densityLevel === 1 && recipientCountry ? (
        <div className={styles.countryLine}>{recipientCountry}</div>
      ) : null}
    </div>
  )
}
