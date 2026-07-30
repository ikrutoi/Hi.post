import React, { useMemo } from 'react'
import { expandAndShuffleForBg } from '@features/cardPie/domain/pieScatteredBackground'
import styles from './Date.module.scss'

type PeekScatterSlot = {
  /** % от ширины контейнера (0–100). */
  left: number
  /** % от высоты контейнера (0–100). */
  top: number
  /** Размер шрифта в cqw. */
  fontSizeCqw: number
  rotate: number
}

/** Детерминированный LCG по seed — хаотичные, но стабильные позиции. */
function hashSeed(seed: string): number {
  let h = 2166136261
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed: number): () => number {
  let t = seed >>> 0
  return () => {
    t = (Math.imul(t, 1103515245) + 12345) >>> 0
    return (t >>> 0) / 4294967296
  }
}

const DATE_PEEK_SCATTER_COUNT = 24
/** Отрицательный pad — центры могут уходить за край, цифра обрезается частично. */
const PAD_X = -6
const PAD_Y = -8
const MIN_DIST = 9

/**
 * 24 хаотичных слота по всей площади (без рядов/сетки).
 * Крайние цифры могут частично выходить за границы секции.
 * Позиции фиксированы относительно layout-seed, не от выбранных дат.
 */
const DATE_PEEK_SCATTER_SLOTS: PeekScatterSlot[] = (() => {
  const rand = mulberry32(hashSeed('date-peek-scatter-layout-v4'))
  const sizes = [17, 19, 21, 23, 25, 20, 22, 18, 24, 21]
  const slots: PeekScatterSlot[] = []

  let attempts = 0
  const maxAttempts = DATE_PEEK_SCATTER_COUNT * 80

  while (slots.length < DATE_PEEK_SCATTER_COUNT && attempts < maxAttempts) {
    attempts += 1
    const left = PAD_X + rand() * (100 - 2 * PAD_X)
    const top = PAD_Y + rand() * (100 - 2 * PAD_Y)
    const tooClose = slots.some((s) => {
      const dx = s.left - left
      const dy = s.top - top
      return Math.hypot(dx, dy) < MIN_DIST
    })
    if (tooClose) continue

    slots.push({
      left,
      top,
      fontSizeCqw: sizes[slots.length % sizes.length] ?? 10,
      rotate: Math.round((rand() * 70 - 35) * 10) / 10,
    })
  }

  /** Если Poisson недобрал — добить случайными точками. */
  while (slots.length < DATE_PEEK_SCATTER_COUNT) {
    slots.push({
      left: PAD_X + rand() * (100 - 2 * PAD_X),
      top: PAD_Y + rand() * (100 - 2 * PAD_Y),
      fontSizeCqw: sizes[slots.length % sizes.length] ?? 10,
      rotate: Math.round((rand() * 70 - 35) * 10) / 10,
    })
  }

  return slots
})()

type DatePeekMultiBackgroundProps = {
  dayLabels: string[]
  seed: string
}

/**
 * Фон из цифр дней: хаотично по всей площади центральной секции даты (24 слота).
 */
export const DatePeekMultiBackground: React.FC<DatePeekMultiBackgroundProps> = ({
  dayLabels,
  seed,
}) => {
  const labels = useMemo(
    () =>
      expandAndShuffleForBg(dayLabels, DATE_PEEK_SCATTER_SLOTS.length, seed),
    [dayLabels, seed],
  )

  if (labels.length === 0) return null

  return (
    <div className={styles.peekMultiScatter} aria-hidden>
      {DATE_PEEK_SCATTER_SLOTS.map((slot, i) => {
        const label = labels[i]
        if (label == null || label === '') return null
        return (
          <span
            key={`${slot.left.toFixed(2)}-${slot.top.toFixed(2)}-${i}`}
            className={styles.peekMultiScatterItem}
            style={
              {
                left: `${slot.left}%`,
                top: `${slot.top}%`,
                fontSize: `${slot.fontSizeCqw}cqw`,
                '--peek-scatter-rotate': `${slot.rotate}deg`,
              } as React.CSSProperties
            }
          >
            {label}
          </span>
        )
      })}
    </div>
  )
}
