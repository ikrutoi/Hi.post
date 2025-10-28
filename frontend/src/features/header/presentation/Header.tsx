import React from 'react'
import clsx from 'clsx'
import { HeaderActions } from '@headerActions/presentation/HeaderActions'
import { HeaderLogo } from './HeaderLogo/HeaderLogo'
import styles from './Header.module.scss'

interface HeaderProps {
  isSticky?: boolean
  hasShadow?: boolean
}

export const Header: React.FC<HeaderProps> = ({
  isSticky = false,
  hasShadow = false,
}) => {
  return (
    <header
      className={clsx(styles.header, {
        [styles.sticky]: isSticky,
        [styles.shadow]: hasShadow,
      })}
    >
      <HeaderLogo />
      <HeaderActions />
    </header>
  )
}
