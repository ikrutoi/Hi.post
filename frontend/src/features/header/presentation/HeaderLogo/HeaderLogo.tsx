import React from 'react'
import clsx from 'clsx'
import styles from './HeaderLogo.module.scss'

interface HeaderLogoProps {
  compact?: boolean
  align?: 'left' | 'center' | 'right'
}

export const HeaderLogo: React.FC<HeaderLogoProps> = ({
  compact = false,
  align = 'left',
}) => {
  return (
    <div
      className={clsx(styles.headerLogo, styles[`headerLogo--${align}`], {
        [styles.compact]: compact,
      })}
    >
      <span className={styles.headerLogo__image} />
    </div>
  )
}
