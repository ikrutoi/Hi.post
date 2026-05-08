import React from 'react'
import type { PostcardStatus } from '@entities/postcard'
import { parseListEntryRecipientDetail } from '@shared/utils/listEntryRecipientDetail'
import styles from './CartListEntry.module.scss'

export type CartListEntryVariant = 'default' | 'inactive'

export type CartListEntryProps = {
  dateLabel: string
  previewUrl?: string | null
  detailLine?: string
  priceLine?: string
  variant?: CartListEntryVariant
  previewStatus?: PostcardStatus
  previewIsProcessed?: boolean
  onSelect?: () => void
  onDelete?: () => void
  isSelected?: boolean
  isFocused?: boolean
}

export const CartListEntry: React.FC<CartListEntryProps> = ({
  dateLabel,
  previewUrl,
  detailLine,
  priceLine,
  variant = 'default',
  previewStatus,
  previewIsProcessed,
  onSelect,
  onDelete,
  isSelected = false,
  isFocused = false,
}) => {
  const interactive = Boolean(onSelect)
  const inactive = variant === 'inactive'
  void onDelete
  const labelForAria = [detailLine ? `${dateLabel}, ${detailLine}` : dateLabel, priceLine]
    .filter(Boolean)
    .join(', ')
  const recipientParts = parseListEntryRecipientDetail(detailLine)

  return (
    <div
      className={styles.root}
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
      {/* Temporary: delete icon/action removed from list entry; use CardPie toolbar */}
      <div className={styles.body}>
        <div className={styles.thumb} aria-hidden>
          {previewUrl ? (
            <img src={previewUrl} alt="" className={styles.thumbImg} />
          ) : null}
          {previewStatus && !previewIsProcessed ? (
            <span
              className={styles.statusIndicator}
              data-status={previewStatus}
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
        {priceLine ? (
          <div className={styles.priceLine} aria-label={`Price ${priceLine}`}>
            {priceLine}
          </div>
        ) : null}
      </div>
    </div>
  )
}
