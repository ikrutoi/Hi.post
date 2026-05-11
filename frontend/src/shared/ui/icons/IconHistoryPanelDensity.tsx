import React from 'react'
import clsx from 'clsx'
import styles from './IconHistoryPanelDensity.module.scss'

/** Три ступени «плотности» строки истории (как три колонки превью слева направо). */
export type HistoryPanelDensitySize = 1 | 2 | 3

type Props = React.SVGProps<SVGSVGElement> & {
  /** Какой сегмент подсвечен: 1 — крупнее всего (как строка корзины), далее 2 и 3. */
  activeSize?: HistoryPanelDensitySize
}

const STROKE_MAIN = 5.90553
const STROKE_LEFT = 4.999

const SEGMENTS: {
  size: HistoryPanelDensitySize
  d: string
  strokeWidth: number
}[] = [
  {
    size: 1,
    d: 'M428 2v1275H186c-101 0-184-82-184-183V186C2 85 85 2 186 2z',
    strokeWidth: STROKE_LEFT,
  },
  {
    size: 2,
    d: 'M428 2h424v1275H428z',
    strokeWidth: STROKE_MAIN,
  },
  {
    size: 3,
    d: 'M853 2h241c101 0 183 83 183 184v908c0 101-82 183-183 183H853z',
    strokeWidth: STROKE_MAIN,
  },
]

export const IconHistoryPanelDensity = ({
  activeSize = 1,
  className,
  ...props
}: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1280 1280"
    fillRule="evenodd"
    clipRule="evenodd"
    className={clsx(styles.svg, className)}
    {...props}
  >
    <g>
      {SEGMENTS.map(({ size, d, strokeWidth }) => {
        const active = size === activeSize
        return (
          <path
            key={size}
            data-density-size={size}
            d={d}
            className={active ? styles.segmentActive : styles.segmentInactive}
            strokeWidth={strokeWidth}
          />
        )
      })}
    </g>
  </svg>
)
