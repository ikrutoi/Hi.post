import React from 'react'
import styles from './Header.module.scss'
import { HeaderLogo } from './HeaderLogo/HeaderLogo'
import { HeaderActions } from '@headerActions/presentation/HeaderActions'

export const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <HeaderLogo />
      <HeaderActions />
    </header>
  )
}
