import React from 'react'
import { IconLogo, IconLogoFull } from '@shared/ui/icons'
import styles from './SectionEditorSidebar.module.scss'

export const SectionEditorSidebar: React.FC = () => {
  return (
    <div className={styles.sectionEditorSidebar}>
      <div className={styles.sectionEditorSidebarLogo}>
        <IconLogo aria-hidden />
      </div>
      <div className={styles.sectionEditorSidebarLogoFull}>
        <IconLogoFull aria-hidden />
      </div>
    </div>
  )
}
