import React from 'react'
import clsx from 'clsx'
import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import { SectionEditorToolbar } from './SectionEditorToolbar/SectionEditorToolbar'
import { useSizeFacade } from '@layout/application/facades'
import { CardSectionRenderer } from './CardSectionRenderer/CardSectionRenderer'

import styles from './CardSectionEditor.module.scss'

export const CardSectionEditor: React.FC = () => {
  const { sizeCard, sizeToolbarContour } = useSizeFacade()
  const width = sizeCard.height * CARD_SCALE_CONFIG.aspectRatio

  return (
    <div className={clsx(styles.cardSectionEditor)}>
      <div
        className={clsx(styles.editorToolbar)}
        style={{
          width: `${sizeToolbarContour.width}px`,
          height: `${sizeToolbarContour.height}px`,
        }}
      >
        <SectionEditorToolbar />
      </div>
      <div
        className={clsx(styles.editorSection)}
        style={{
          width: `${width}px`,
          height: `${sizeCard.height}px`,
        }}
      >
        <CardSectionRenderer />
      </div>
    </div>
  )
}
