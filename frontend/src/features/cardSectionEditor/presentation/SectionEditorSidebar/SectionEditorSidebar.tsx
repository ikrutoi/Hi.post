import React from 'react'
import { Toolbar } from '@features/toolbar/presentation/Toolbar'
import styles from './SectionEditorSidebar.module.scss'

/**
 * Левая полоса: только иконки секций (Дата, Кардфото, Кардтекст, Конверт, Аромат).
 * Тематический тулбар для Кардфото/Кардтекст — в левом внутреннем сайдбаре (workZoneLeft).
 */
export const SectionEditorSidebar: React.FC = () => {
  return (
    <div className={styles.sectionEditorSidebar}>
      <Toolbar section="sectionEditorMenu" />
    </div>
  )
}
