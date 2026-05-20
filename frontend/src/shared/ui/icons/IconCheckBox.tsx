import React from 'react'
import styles from './IconCheckBox.module.scss'

export type IconCheckBoxProps = React.SVGProps<SVGSVGElement> & {
  checked?: boolean
}

/** Квадрат (календарная рамка) + галочка; обводка как у иконок toolbar (~106 / 162). */
export const IconCheckBox = ({ checked = false, ...props }: IconCheckBoxProps) => (
  <svg
    className={styles.root}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1280 1280"
    fill="none"
    fillRule="evenodd"
    clipRule="evenodd"
    shapeRendering="geometricPrecision"
    textRendering="geometricPrecision"
    imageRendering="optimizeQuality"
    {...props}
  >
    <path
      className={styles.box}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={106.666}
      d="M1093 665v428c0 72-58 129-130 129l-776 1c-72-1-130-58-130-130V316c0-71 58-129 130-129h425M57 744V316c0-71 58-129 130-129h776c72 0 130 58 130 129v777c0 72-58 130-130 130H538"
    />
    {checked ? (
      <path
        className={styles.check}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={162.5}
        d="m259 694 218 218 414-415"
      />
    ) : null}
  </svg>
)
