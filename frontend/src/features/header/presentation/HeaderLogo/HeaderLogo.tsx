import React from 'react'
import clsx from 'clsx'
import { useLayoutFacade } from '@layout/application/facades'
import styles from './HeaderLogo.module.scss'

export const HeaderLogo: React.FC = () => {
  const { size } = useLayoutFacade()
  const { viewportSize } = size

  const logoSizeClass = viewportSize.viewportSize
    ? styles[`headerLogo--${viewportSize.viewportSize}`]
    : undefined

  return (
    <div className={clsx(styles.headerLogo, logoSizeClass)}>
      <span className={styles.headerLogoImage} />
    </div>
  )
}
