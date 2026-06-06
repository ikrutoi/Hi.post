import React, { useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import { useAppSelector } from '@app/hooks'
import { selectCropQualityProgress } from '@cardphoto/infrastructure/selectors'
import { getQualityColor } from '@cardphoto/application/helpers'
import styles from './CropQualityMeter.module.scss'

type Props = {
  /** Кроп выключен или группа тулбара недоступна — пустая дорожка. */
  disabled?: boolean
}

function clampProgress(progress: number): number {
  return Math.max(0, Math.min(100, progress))
}

/**
 * Индикатор качества кропа для тулбара cardphoto: полоска-метр 0–100%.
 * Цвет заливки — та же шкала, что у ручек кропа на открытке.
 */
export const CropQualityMeter: React.FC<Props> = ({ disabled = false }) => {
  const reduxProgress = useAppSelector(selectCropQualityProgress)
  const [liveProgress, setLiveProgress] = useState<number | null>(null)

  useEffect(() => {
    if (disabled) return
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ progress: number }>
      if (typeof ce.detail?.progress === 'number') {
        setLiveProgress(ce.detail.progress)
      }
    }
    window.addEventListener('crop-quality-change', handler)
    return () => window.removeEventListener('crop-quality-change', handler)
  }, [disabled])

  useEffect(() => {
    setLiveProgress(null)
  }, [reduxProgress])

  const progress = clampProgress(liveProgress ?? reduxProgress)
  const fillPercent = disabled ? 0 : progress
  const showMinQualityDot = !disabled && progress === 0
  const fillColor = useMemo(
    () => (disabled ? undefined : getQualityColor(progress)),
    [disabled, progress],
  )

  const ariaLabel = disabled
    ? 'Качество печати: включите кроп для оценки'
    : `Качество печати, ${Math.round(progress)} процентов`

  return (
    <div
      className={clsx(styles.root, disabled && styles.rootDisabled)}
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
