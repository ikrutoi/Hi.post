import React from 'react'
import { useSectionMenuFacade } from '@entities/sectionEditorMenu/application/facades'
import { Toolbar } from '@features/toolbar/presentation/Toolbar'
import styles from './SectionEditorLeftInnerSidebar.module.scss'

export const SectionEditorLeftInnerSidebar: React.FC = () => {
  const { activeSection } = useSectionMenuFacade()
  const show = activeSection === 'cardphoto'

  if (!show) return null

  return (
    <div className={styles.innerSidebar}>
      <Toolbar section={activeSection} />
    </div>
  )
}
