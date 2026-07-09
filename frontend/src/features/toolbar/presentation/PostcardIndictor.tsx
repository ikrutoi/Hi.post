import React from 'react'
import clsx from 'clsx'
import type { PostcardStatus } from '@entities/postcard'
import { useCalendarFacade } from '@/features/date/calendar/application/facades/useCalendarFacade'
import styles from './PostcardIndicator.module.scss'

type IndicatorItem = {
  status: PostcardStatus
  className: string
  isActive: (statuses: ReturnType<typeof useCalendarFacade>['postcardStatuses']) => boolean
  ariaLabel: string
}

const INDICATOR_ITEMS: IndicatorItem[] = [
  {
    status: 'cart',
    className: styles.cart,
    isActive: (statuses) => statuses.cart || statuses.cartBlocked,
    ariaLabel: 'Cart status filter',
  },
  {
    status: 'ready',
    className: styles.ready,
    isActive: (statuses) => statuses.ready,
    ariaLabel: 'Ready status filter',
  },
  {
    status: 'sent',
    className: styles.sent,
    isActive: (statuses) => statuses.sent,
    ariaLabel: 'Sent status filter',
  },
  {
    status: 'delivered',
    className: styles.delivered,
    isActive: (statuses) => statuses.delivered,
    ariaLabel: 'Delivered status filter',
  },
  {
    status: 'error',
    className: styles.error,
    isActive: (statuses) => statuses.error,
    ariaLabel: 'Not delivered status filter',
  },
]

type PostcardIndicatorProps = {
  interactive?: boolean
}

export const PostcardIndicator: React.FC<PostcardIndicatorProps> = ({
  interactive = false,
}) => {
  const { postcardStatuses, togglePostcardStatus } = useCalendarFacade()

  return (
    <div
      data-postcard-indicator=""
      data-interactive={interactive ? 'true' : undefined}
      className={clsx(
        styles.postcardIndicatorContainer,
        interactive && styles.postcardIndicatorContainerInteractive,
      )}
    >
      {INDICATOR_ITEMS.map(({ status, className, isActive, ariaLabel }) => {
        const active = isActive(postcardStatuses)
        const dotClassName = clsx(
          styles.postcardIndicator,
          className,
          !active && styles.postcardIndicatorHidden,
        )

        if (interactive) {
          return (
            <button
              key={status}
              type="button"
              className={styles.postcardIndicatorHit}
              aria-pressed={active}
              aria-label={ariaLabel}
              onClick={() => togglePostcardStatus(status)}
            >
              <span className={dotClassName} aria-hidden={!active} />
            </button>
          )
        }

        return (
          <span
            key={status}
            className={dotClassName}
            aria-hidden={!active}
          />
        )
      })}
    </div>
  )
}
