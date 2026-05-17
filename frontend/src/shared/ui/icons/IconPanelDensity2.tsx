import React from 'react'
import clsx from 'clsx'
import styles from './IconPanelDensity2.module.scss'

/** Две ступени плотности панели (две колонки слева направо). */
export type PanelDensity2Size = 1 | 2

type Props = React.SVGProps<SVGSVGElement> & {
  activeSize?: PanelDensity2Size
}

const STROKE_W = 5.90553

const SEGMENTS: { size: PanelDensity2Size; d: string }[] = [
  {
    size: 1,
    d: 'M640 1278H187c-101 0-185-84-185-185V187C2 86 86 2 187 2h453z',
  },
  {
    size: 2,
    d: 'M640 1278h453c101 0 185-84 185-185V187c0-101-84-185-185-185H640z',
  },
]

export const IconPanelDensity2 = ({
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
      {SEGMENTS.map(({ size, d }) => {
        const active = size === activeSize
        return (
          <path
            key={size}
            data-density-size={size}
            d={d}
            className={active ? styles.segmentActive : styles.segmentInactive}
            strokeWidth={STROKE_W}
          />
        )
      })}
    </g>
  </svg>
)
