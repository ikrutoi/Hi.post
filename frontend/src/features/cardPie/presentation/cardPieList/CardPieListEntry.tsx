import React from 'react'
import { getToolbarIcon } from '@shared/utils/icons'
import { parseListEntryRecipientDetail } from '@shared/utils/listEntryRecipientDetail'
import styles from './CardPieListEntry.module.scss'

export type CardPieListEntryVariant = 'default' | 'inactive'

export type CardPieListEntryProps = {
  dateLabel: string
  previewUrl?: string | null
  detailLine?: string
  priceLine?: string
  variant?: CardPieListEntryVariant
  onSelect?: () => void
  onDelete?: () => void
  isSelected?: boolean
  isFocused?: boolean
  onAddCart?: () => void
}

export const CardPieListEntry: React.FC<CardPieListEntryProps> = ({
  dateLabel,
  previewUrl,
  detailLine,
  priceLine,
  variant = 'default',
  onSelect,
  onDelete,
  isSelected = false,
  isFocused = false,
  onAddCart,
}) => {
  const interactive = Boolean(onSelect)
  const inactive = variant === 'inactive'
  const hasDate = dateLabel.trim().length > 0
  const labelForAria = [
    detailLine ? (hasDate ? `${dateLabel}, ${detailLine}` : detailLine) : dateLabel,
    priceLine,
  ]
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
      {onDelete ? (
        <button
          type="button"
          className={styles.semicircleUp}
          aria-label={inactive ? undefined : 'Remove postcard row'}
          title={inactive ? undefined : 'Remove postcard row'}
          disabled={inactive}
          onClick={(e) => {
            e.stopPropagation()
            if (!inactive) onDelete()
          }}
        >
          {getToolbarIcon({ key: 'delete' })}
        </button>
      ) : (
        <div
          className={styles.semicircleUp}
          aria-hidden
          onClick={(e) => e.stopPropagation()}
        >
          {getToolbarIcon({ key: 'delete' })}
        </div>
      )}
      <div className={styles.body}>
        <div className={styles.favoriteSlot}>
          <button
            type="button"
            className={styles.addCartBtn}
            disabled={!onAddCart || inactive}
            onClick={(e) => {
              e.stopPropagation()
              onAddCart?.()
            }}
            aria-label={
              onAddCart && !inactive ? 'Add to cart' : undefined
            }
            title={
              onAddCart && !inactive ? 'Add to cart' : undefined
            }
          >
            {getToolbarIcon({ key: 'addCart' })}
          </button>
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
          {hasDate ? (
            <div className={styles.dateLine}>{dateLabel}</div>
          ) : (
            <div className={styles.dateLine} aria-hidden>
              {'\u00A0'}
            </div>
          )}
          <div className={styles.detailBlock} aria-hidden={!recipientParts}>
            {recipientParts ? (
              recipientParts.region ? (
                <>
                  <span className={styles.detailName}>{recipientParts.name}</span>
                  <span className={styles.detailSep}>, </span>
                  <span className={styles.detailRegion}>
                    {recipientParts.region}
                  </span>
                </>
              ) : (
                <span className={styles.detailName}>{recipientParts.name}</span>
              )
            ) : (
              '\u00A0'
            )}
          </div>
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
