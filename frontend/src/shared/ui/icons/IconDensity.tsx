import React from 'react'
import clsx from 'clsx'
import styles from './IconDensity.module.scss'

export type CardphotoListDensityCols = 4 | 5 | 6 | 7

type Props = React.SVGProps<SVGSVGElement> & {
  activeCols?: CardphotoListDensityCols
}

const STROKE_W = 5.90553

const SEGMENTS: { cols: CardphotoListDensityCols; d: string }[] = [
  {
    cols: 4,
    d: 'M321 1278H187c-101 0-185-84-185-185V187C2 86 86 2 187 2h134z',
  },
  {
    cols: 5,
    d: 'M321 2h319v1275H321z',
  },
  {
    cols: 6,
    d: 'M640 2h319v1275H640z',
  },
  {
    cols: 7,
    d: 'M959 1278h134c101 0 185-84 185-185V187c0-101-84-185-185-185H959z',
  },
]

export const IconDensity = ({
  activeCols = 5,
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
      {SEGMENTS.map(({ cols, d }) => {
        const active = cols === activeCols
        return (
          <path
            key={cols}
            data-cols={cols}
            d={d}
            className={active ? styles.segmentActive : styles.segmentInactive}
            strokeWidth={STROKE_W}
          />
        )
      })}
    </g>
  </svg>
)
