import React from 'react'
import clsx from 'clsx'
import styles from './IconPanelDensity2.module.scss'

/** Четыре ступени кегля cardtext (слева крупный, справа мелкий). */
export type FontSizeStep = 1 | 2 | 3 | 4

type Props = React.SVGProps<SVGSVGElement> & {
  activeSize?: FontSizeStep
}

const STROKE_W = 5.90553

const SEGMENTS: { size: FontSizeStep; d: string }[] = [
  {
    size: 4,
    d: 'M320 1278H187c-101 0-185-84-185-185V187C2 86 86 2 187 2h133z',
  },
  {
    size: 3,
    d: 'M320 2h320v1276H320z',
  },
  {
    size: 2,
    d: 'M640 2h320v1276H640z',
  },
  {
    size: 1,
    d: 'M960 1278H1093c101 0 185-84 185-185V187c0-101-84-185-185-185H960z',
  },
]

export const IconFontSizeStep = ({
  activeSize = 3,
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
            data-font-size-step={size}
            d={d}
            className={active ? styles.segmentActive : styles.segmentInactive}
            strokeWidth={STROKE_W}
          />
        )
      })}
    </g>
  </svg>
)
