import React from 'react'
import LogoMark from '@shared/assets/logo/logo.svg?react'
import LogoFull from '@shared/assets/logo/logoFull.svg?react'
import styles from './SectionEditorSidebar.module.scss'

export const SectionEditorSidebar: React.FC = () => {
  return (
    <div className={styles.sectionEditorSidebar}>
      <div className={styles.sectionEditorSidebarLogo}>
        <LogoMark aria-hidden />
      </div>
      <div className={styles.sectionEditorSidebarLogoFull}>
        <LogoFull aria-hidden />
      </div>
    </div>
  )
}
