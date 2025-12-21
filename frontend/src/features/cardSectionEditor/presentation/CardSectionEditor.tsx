import React from 'react'
import clsx from 'clsx'
import { SectionEditorToolbar } from './SectionEditorToolbar/SectionEditorToolbar'
import { CardSectionRenderer } from './CardSectionRenderer/CardSectionRenderer'

import styles from './CardSectionEditor.module.scss'

export const CardSectionEditor: React.FC = () => {
  return (
    <div className={clsx(styles.cardSectionEditor)}>
      <SectionEditorToolbar />
      <CardSectionRenderer />
    </div>
  )
}
