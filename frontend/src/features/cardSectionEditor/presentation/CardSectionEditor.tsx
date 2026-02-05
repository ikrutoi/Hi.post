import React from 'react'
import clsx from 'clsx'
import { useSectionMenuFacade } from '@entities/sectionEditorMenu/application/facades'
import { SectionEditorToolbar } from './SectionEditorToolbar/SectionEditorToolbar'
import { CardSectionRenderer } from './CardSectionRenderer/CardSectionRenderer'

import styles from './CardSectionEditor.module.scss'

export const CardSectionEditor: React.FC = () => {
  const { state: sectionMenuState } = useSectionMenuFacade()
  const { isHydrated } = sectionMenuState

  if (!isHydrated) {
    return <div className={styles.loader}>Loading Session...</div>
  }

  return (
    <div className={clsx(styles.cardSectionEditor)}>
      <SectionEditorToolbar />
      <CardSectionRenderer />
    </div>
  )
}
