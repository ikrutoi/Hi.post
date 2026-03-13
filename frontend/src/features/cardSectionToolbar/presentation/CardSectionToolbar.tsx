import React from 'react'
import { useSectionMenuFacade } from '@entities/sectionEditorMenu/application/facades'
import { Toolbar } from '@features/toolbar/presentation/Toolbar'
import styles from './CardSectionToolbar.module.scss'

export const CardSectionToolbar: React.FC = () => {
  const { activeSection } = useSectionMenuFacade()

  return (
    <div className={styles.cardSectionToolbar}>
      {activeSection === 'cardphoto' && <Toolbar section="cardphoto" />}
    </div>
  )
}
