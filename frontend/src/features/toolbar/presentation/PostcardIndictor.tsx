import React, { useCallback, useState } from 'react'
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

type TogglePulse = {
  status: PostcardStatus
  direction: 'on' | 'off'
}

export const PostcardIndicator: React.FC<PostcardIndicatorProps> = ({
  interactive = false,
}) => {
  const { postcardStatuses, togglePostcardStatus } = useCalendarFacade()
  const [togglePulse, setTogglePulse] = useState<TogglePulse | null>(null)

  const handleToggle = useCallback(
    (status: PostcardStatus, currentlyActive: boolean) => {
      togglePostcardStatus(status)
      setTogglePulse({
        status,
        direction: currentlyActive ? 'off' : 'on',
      })
    },
    [togglePostcardStatus],
  )

  const handlePulseEnd = useCallback((status: PostcardStatus) => {
    setTogglePulse((prev) => (prev?.status === status ? null : prev))
  }, [])

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
        const pulse =
          togglePulse?.status === status ? togglePulse.direction : null
        const dotClassName = clsx(
          styles.postcardIndicator,
          className,
          active && styles.postcardIndicatorOn,
          interactive && !active && styles.postcardIndicatorOff,
          !interactive && !active && styles.postcardIndicatorHidden,
          pulse === 'on' && styles.postcardIndicatorAnimEnable,
          pulse === 'off' && styles.postcardIndicatorAnimDisable,
        )

        if (interactive) {
          return (
            <button
              key={status}
              type="button"
              className={styles.postcardIndicatorHit}
              aria-pressed={active}
              aria-label={ariaLabel}
              onClick={() => handleToggle(status, active)}
            >
              <span
                className={dotClassName}
                aria-hidden={!interactive && !active}
                onAnimationEnd={() => handlePulseEnd(status)}
              />
            </button>
          )
        }

        return (
          <span
            key={status}
            className={dotClassName}
            aria-hidden={!interactive && !active}
          />
        )
      })}
    </div>
  )
}
