import React, { useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import { useAppSelector } from '@app/hooks'
import { selectCropQualityProgress } from '@cardphoto/infrastructure/selectors'
import { getQualityColor } from '@cardphoto/application/helpers'
import styles from './CropQualityDots.module.scss'

const DOT_COUNT = 6

/** Сколько точек «зажато»: от 1 (минимум) до 6 (максимум). */
function progressToLitCount(progress: number): number {
  const p = Math.max(0, Math.min(100, progress))
  return Math.max(1, Math.min(DOT_COUNT, Math.ceil((p / 100) * DOT_COUNT)))
}

type Props = {
  /** Кроп выключен или группа тулбара недоступна — все точки «пустые», без цвета качества. */
  disabled?: boolean
}

/**
 * Индикатор качества кропа для тулбара cardphoto (6 точек, стилистика как у размера шрифта).
 * Активные точки одного цвета из той же шкалы, что и ручки кропа.
 */
export const CropQualityDots: React.FC<Props> = ({ disabled = false }) => {
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

  const progress = liveProgress ?? reduxProgress
  const litCount = useMemo(
    () => (disabled ? 0 : progressToLitCount(progress)),
    [disabled, progress],
  )
  const activeColor = useMemo(
    () => (disabled ? undefined : getQualityColor(progress)),
    [disabled, progress],
  )

  const ariaLabel = disabled
    ? 'Качество печати: включите кроп для оценки'
    : `Качество печати, ${progress} процентов`

  return (
    <div className={styles.root} role="img" aria-label={ariaLabel}>
      {Array.from({ length: DOT_COUNT }, (_, i) => {
        const index = i + 1
        const isLit = !disabled && index <= litCount
        const isCurrent = isLit && index === litCount

        return (
          <div
            key={index}
            className={clsx(
              styles.dotWrap,
              isLit && styles.lit,
              isCurrent && styles.current,
            )}
            style={
              isLit && activeColor
                ? ({
                    '--quality-dot-color': activeColor,
                  } as React.CSSProperties)
                : undefined
            }
          >
            <span className={styles.dot} aria-hidden />
          </div>
        )
      })}
    </div>
  )
}
