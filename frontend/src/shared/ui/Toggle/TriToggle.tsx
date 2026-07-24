import React, { useCallback, useRef } from 'react'
import clsx from 'clsx'
import styles from './Toggle.module.scss'

export type TriTogglePosition = 'left' | 'center' | 'right'

type TriToggleProps = {
  value: TriTogglePosition
  onChange: (value: TriTogglePosition) => void
  variant?: 'envelopeDual'
  disabled?: boolean
  ariaLabel?: string
}

function positionFromClientX(
  clientX: number,
  track: HTMLElement,
): TriTogglePosition {
  const rect = track.getBoundingClientRect()
  if (rect.width <= 0) return 'center'
  const ratio = (clientX - rect.left) / rect.width
  if (ratio < 1 / 3) return 'left'
  if (ratio > 2 / 3) return 'right'
  return 'center'
}

/**
 * Three-stop switch: tap any third of the track to jump there (no forced pass through center).
 */
export const TriToggle: React.FC<TriToggleProps> = ({
  value,
  onChange,
  variant = 'envelopeDual',
  disabled = false,
  ariaLabel,
}) => {
  const trackRef = useRef<HTMLSpanElement>(null)

  const handlePointer = useCallback(
    (clientX: number) => {
      if (disabled || trackRef.current == null) return
      onChange(positionFromClientX(clientX, trackRef.current))
    },
    [disabled, onChange],
  )

  return (
    <div
      className={clsx(
        styles.triToggle,
        variant === 'envelopeDual' && styles.triToggleEnvelopeDual,
        styles[`triToggle_${value}`],
        disabled && styles.toggleDisabled,
      )}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={2}
      aria-valuenow={value === 'left' ? 0 : value === 'center' ? 1 : 2}
      aria-valuetext={value}
      aria-label={ariaLabel}
      tabIndex={disabled ? -1 : 0}
      onClick={(event) => handlePointer(event.clientX)}
      onKeyDown={(event) => {
        if (disabled) return
        if (event.key === 'ArrowLeft') {
          event.preventDefault()
          onChange(value === 'right' ? 'center' : 'left')
        } else if (event.key === 'ArrowRight') {
          event.preventDefault()
          onChange(value === 'left' ? 'center' : 'right')
        } else if (event.key === 'Home') {
          event.preventDefault()
          onChange('left')
        } else if (event.key === 'End') {
          event.preventDefault()
          onChange('right')
        }
      }}
    >
      <span ref={trackRef} className={styles.triToggleTrack}>
        <span className={styles.triToggleThumb} aria-hidden />
      </span>
    </div>
  )
}
