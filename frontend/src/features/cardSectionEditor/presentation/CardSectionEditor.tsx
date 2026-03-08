import React from 'react'
import clsx from 'clsx'
import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import { SectionEditorToolbar } from './SectionEditorToolbar/SectionEditorToolbar'
import { SectionEditorLeftInnerSidebar } from './SectionEditorLeftInnerSidebar/SectionEditorLeftInnerSidebar'
import { useSectionMenuFacade } from '@entities/sectionEditorMenu/application/facades'
import { useSizeFacade } from '@layout/application/facades'
import { CardSectionRenderer } from './CardSectionRenderer/CardSectionRenderer'
import styles from './CardSectionEditor.module.scss'

export const CardSectionEditor: React.FC = () => {
  const { sizeCard } = useSizeFacade()
  const { activeSection } = useSectionMenuFacade()
  const showLeftInnerSidebar =
    activeSection === 'cardphoto' || activeSection === 'cardtext'
  const width = sizeCard.height * CARD_SCALE_CONFIG.aspectRatio

  return (
    <div className={clsx(styles.cardSectionEditor)}>
      <div className={clsx(styles.editorToolbar)}>
        <SectionEditorToolbar />
      </div>
      <div className={styles.editorArea}>
        <div
          className={styles.editorAreaCenter}
          style={{
            width: `${width}px`,
            height: `${sizeCard.height}px`,
          }}
        >
          {showLeftInnerSidebar && (
            <div
              className={styles.workZoneLeft}
              style={{ height: `${sizeCard.height}px` }}
            >
              <SectionEditorLeftInnerSidebar />
            </div>
          )}
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
      </div>
    </div>
  )
}
