import React from 'react'
import {
  expandAndShuffleForBg,
  truncateScatterLabel,
  type PieScatterSlot,
} from '../domain/pieScatteredBackground'
import styles from './CardPie.module.scss'

type PieScatteredBackgroundTextProps = {
  items: string[]
  slots: PieScatterSlot[]
  seed: string
  className?: string
  truncate?: boolean
}

export const PieScatteredBackgroundText: React.FC<
  PieScatteredBackgroundTextProps
> = ({ items, slots, seed, className, truncate = false }) => {
  const labels = React.useMemo(
    () => expandAndShuffleForBg(items, slots.length, seed),
    [items, slots.length, seed],
  )

  if (labels.length === 0) return null

  return (
    <g className={className} aria-hidden>
      {slots.map((slot, i) => {
        const raw = labels[i]
        if (raw == null || raw === '') return null
        const label = truncate ? truncateScatterLabel(raw) : raw
        return (
          <text
            key={`${slot.x}-${slot.y}-${i}`}
            x={slot.x}
            y={slot.y}
            fontSize={slot.fontSize}
            textAnchor="middle"
            dominantBaseline="middle"
            transform={
              slot.rotate != null
                ? `rotate(${slot.rotate} ${slot.x} ${slot.y})`
                : undefined
            }
            className={styles.pieTextBase}
          >
            {label}
          </text>
        )
      })}
    </g>
  )
}
