import React from 'react'
import {
  expandAndShuffleForBg,
  expandEnvelopeRecipientsForBg,
  truncateScatterLabel,
  type PieScatterSlot,
} from '../domain/pieScatteredBackground'
import styles from './CardPie.module.scss'

type ExpandForBg = (
  items: string[],
  slotCount: number,
  seed: string,
) => string[]

type PieScatteredBackgroundTextProps = {
  items: string[]
  slots: PieScatterSlot[]
  seed: string
  className?: string
  truncate?: boolean
  expand?: ExpandForBg
}

export const PieScatteredBackgroundText: React.FC<
  PieScatteredBackgroundTextProps
> = ({
  items,
  slots,
  seed,
  className,
  truncate = false,
  expand = expandAndShuffleForBg,
}) => {
  const labels = React.useMemo(
    () => expand(items, slots.length, seed),
    [expand, items, slots.length, seed],
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
