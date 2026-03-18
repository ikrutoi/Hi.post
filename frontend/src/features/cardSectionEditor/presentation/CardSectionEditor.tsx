import React from 'react'
import clsx from 'clsx'
import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import { SectionEditorToolbar } from './SectionEditorToolbar/SectionEditorToolbar'
import { SectionEditorLeftInnerSidebar } from './SectionEditorLeftInnerSidebar/SectionEditorLeftInnerSidebar'
import { useSectionMenuFacade } from '@entities/sectionEditorMenu/application/facades'
import { useSizeFacade } from '@layout/application/facades'
import { useCardtextFacade } from '@cardtext/application/facades'
import { useAppSelector } from '@app/hooks'
import { CardSectionRenderer } from './CardSectionRenderer/CardSectionRenderer'
import { CardtextEditTitleInline } from '@cardtext/presentation/CardtextEditTitleInline/CardtextEditTitleInline'
import styles from './CardSectionEditor.module.scss'

export const CardSectionEditor: React.FC = () => {
  const { sizeCard } = useSizeFacade()
  const { activeSection } = useSectionMenuFacade()
  const { currentView: cardtextCurrentView } = useCardtextFacade()
  const width = sizeCard.height * CARD_SCALE_CONFIG.aspectRatio

  return (
    <div className={clsx(styles.cardSectionEditor)}>
      <div className={styles.editorArea}>
        <div
          className={styles.editorAreaCenter}
          style={{
            width: `${width}px`,
            height: `${sizeCard.height}px`,
          }}
        >
          {activeSection === 'cardtext' && (
            <div className={styles.cardtextToolbarTop}>
              {cardtextCurrentView === 'cardtextView' ? (
                <CardtextEditTitleInline />
              ) : null}
            </div>
          )}
          {/* {showLeftInnerSidebar && (
            <div
              className={styles.workZoneLeft}
              style={{ height: `${sizeCard.height}px` }}
            >
              <SectionEditorLeftInnerSidebar />
            </div>
          )} */}
          <div
            className={styles.editorSection}
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
