import React from 'react'
import clsx from 'clsx'
import { Price } from './Price'
import styles from './AssemblyPieCornerFrame.module.scss'

type AssemblyPieCornerFrameProps = {
  /** `mini` — 50% ширины левого мини-пая, `miniMobile` — 65%. */
  size?: 'central' | 'mini' | 'miniMobile'
}

/** Знак цены на пае собранной открытки. */
export const AssemblyPieCornerFrame: React.FC<AssemblyPieCornerFrameProps> = ({
  size = 'central',
}) => (
  <div
    className={clsx(
      styles.frame,
      size === 'mini' && styles.frameMini,
      size === 'miniMobile' && styles.frameMiniMobile,
    )}
  >
    <Price className={styles.price} />
  </div>
)
