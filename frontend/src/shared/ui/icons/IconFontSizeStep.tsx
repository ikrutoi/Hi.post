import React from 'react'
import clsx from 'clsx'
import styles from './IconPanelDensity2.module.scss'

/** Пять ступеней кегля cardtext (как колонки `panelDensity2`). */
export type FontSizeStep = 1 | 2 | 3 | 4 | 5

type Props = React.SVGProps<SVGSVGElement> & {
  activeSize?: FontSizeStep
}

const STROKE_W = 5.90553

const SEGMENTS: { size: FontSizeStep; d: string }[] = [
  {
    size: 1,
    d: 'M257 1278H187c-101 0-185-84-185-185V187C2 86 86 2 187 2h70z',
  },
  {
    size: 2,
    d: 'M257 2h255v1276H257z',
  },
  {
    size: 3,
    d: 'M512 2h256v1276H512z',
  },
  {
    size: 4,
    d: 'M768 2h255v1276H768z',
  },
  {
    size: 5,
    d: 'M1023 1278h70c101 0 185-84 185-185V187c0-101-84-185-185-185H1023z',
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
