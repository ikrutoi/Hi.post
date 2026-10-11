import React from 'react'
import clsx from 'clsx'
import { getQualityColor } from '@cardphoto/application/helpers'
import { useCropQualityFill } from './useCropQualityFillColor'
import styles from './CropQualityMeter.module.scss'

type Props = {
  /** Кроп выключен или группа тулбара недоступна — пустая дорожка. */
  disabled?: boolean
  /** Parent sets width (e.g. central CardPie); meter track fills it. */
  fillWidth?: boolean
}

/**
 * Индикатор качества кропа для тулбара cardphoto: полоска-метр 0–100%.
 * Цвет заливки — та же шкала, что у ручек кропа на открытке.
 */
export const CropQualityMeter: React.FC<Props> = ({
  disabled = false,
  fillWidth = false,
}) => {
  const { progress, color: fillColor } = useCropQualityFill(disabled)
  const fillPercent = disabled ? 0 : progress
  const showMinQualityDot = !disabled && progress === 0

  const ariaLabel = disabled
    ? 'Качество печати: включите кроп для оценки'
    : `Качество печати, ${Math.round(progress)} процентов`

  return (
    <div
      className={clsx(
        styles.root,
        fillWidth && styles.rootFill,
        disabled && styles.rootDisabled,
      )}
      role="meter"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={disabled ? undefined : Math.round(progress)}
    >
      <div className={styles.track}>
        {showMinQualityDot ? (
          <span
            className={styles.minQualityDot}
            style={{ backgroundColor: getQualityColor(0) }}
            aria-hidden
          />
        ) : null}
        <div
          className={clsx(styles.fill, fillPercent <= 0 && styles.fillEmpty)}
          style={{
            width: `${fillPercent}%`,
            ...(fillColor ? { backgroundColor: fillColor } : {}),
          }}
        />
      </div>
    </div>
  )
}
