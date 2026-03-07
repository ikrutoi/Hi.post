import React from 'react'
import { useSectionMenuFacade } from '@entities/sectionEditorMenu/application/facades'
import { Toolbar } from '@features/toolbar/presentation/Toolbar'
import styles from './SectionEditorSidebar.module.scss'

/**
 * Левая полоса: иконки секций, разделитель, под ним — тулбар Фото/Текст (cardphoto/cardtext).
 */
export const SectionEditorSidebar: React.FC = () => {
  const { activeSection } = useSectionMenuFacade()
  const showSectionToolbar =
    activeSection === 'cardphoto' || activeSection === 'cardtext'

  return (
    <div className={styles.sectionEditorSidebar}>
      <Toolbar section="sectionEditorMenu" />
      <div className={styles.sidebarDivider} aria-hidden />
      {showSectionToolbar && (
        <div className={styles.sidebarSectionToolbar}>
          <Toolbar section={activeSection} />
        </div>
      )}
    </div>
  )
}
