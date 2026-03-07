import React from 'react'
import { Toolbar } from '@features/toolbar/presentation/Toolbar'
import styles from './SectionEditorSidebar.module.scss'

/**
 * Левая полоса (сайдбар) с фоном #efeae7: только иконки выбора секции (sectionEditorMenu).
 */
export const SectionEditorSidebar: React.FC = () => {
  return (
    <div className={styles.sectionEditorSidebar}>
      <Toolbar section="sectionEditorMenu" />
    </div>
  )
}
