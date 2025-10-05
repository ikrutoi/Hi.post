import React from 'react'
import styles from './HeaderLogo.module.scss'

export const HeaderLogo: React.FC = () => {
  return (
    <div className={styles.headerLogo__container}>
      <span className={styles.headerLogo__image} />
    </div>
  )
}
