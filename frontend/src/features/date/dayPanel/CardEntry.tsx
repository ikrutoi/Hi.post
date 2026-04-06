import React from 'react'
import clsx from 'clsx'
import type { CalendarCardItem } from '@entities/card/domain/types'
import { selectCalendarPreviewDisplayUrl } from '@entities/card/infrastructure/selectors'
import { useAppSelector } from '@app/hooks'
import styles from './CardEntry.module.scss'

type Props = {
  item: CalendarCardItem
  isSelected?: boolean
  isFocused?: boolean
  onSelect: (item: CalendarCardItem) => void
}

const STATUS_LABEL: Record<CalendarCardItem['status'], string> = {
  processed: 'In progress',
  cart: 'Cart',
  ready: 'Ready',
  sent: 'Sent',
  delivered: 'Delivered',
  error: 'Error',
  favorite: 'Favorite',
}

export const CardEntry: React.FC<Props> = ({
  item,
  isSelected = false,
  isFocused = false,
  onSelect,
}) => {
  const displayUrl = useAppSelector(selectCalendarPreviewDisplayUrl(item.cardId))

  const handleClick = () => onSelect(item)

  return (
    <div
      className={styles.root}
      role="option"
      data-selected={isSelected ? 'true' : undefined}
      data-focused={isFocused ? 'true' : undefined}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(item)
        }
      }}
      tabIndex={0}
    >
      <div className={styles.thumb}>
        {(displayUrl ?? item.previewUrl) ? (
          <img
            src={displayUrl ?? item.previewUrl}
            alt=""
            className={styles.thumbImg}
          />
        ) : null}
      </div>
      {item.status !== 'processed' ? (
        <>
          <span
            className={clsx(styles.indicator, styles[item.status])}
            aria-hidden
          />
          <span className={styles.statusLabel}>
            {STATUS_LABEL[item.status]}
          </span>
        </>
      ) : null}
    </div>
  )
}
