import React from 'react'
import clsx from 'clsx'
import { useSectionMenuFacade } from '@entities/sectionEditorMenu/application/facades'
import { useSizeFacade } from '@layout/application/facades'
import { useCardtextFacade } from '@cardtext/application/facades'
import { CardSectionRenderer } from './CardSectionRenderer/CardSectionRenderer'
import { CardtextEditTitleInline } from '@cardtext/presentation/CardtextEditTitleInline/CardtextEditTitleInline'
import { NotebookPeekShell } from '@date/presentation/NotebookPeekShell'
import { SectionEditorNotebookTabsOuterProvider } from './SectionEditorNotebookTabsOuterContext'
import styles from './CardSectionEditor.module.scss'

export const CardSectionEditor: React.FC = () => {
  const { sizeCard, isMobileLayout } = useSizeFacade()
  const { activeSection } = useSectionMenuFacade()
  const { currentView: cardtextCurrentView } = useCardtextFacade()
  const width = sizeCard.width
  const height = sizeCard.height
  const useFluidMobileLayout =
    isMobileLayout && (height <= 0 || width <= 0)
  const sectionWidth =
    width > 0 ? `${width}px` : useFluidMobileLayout ? '100%' : '0px'
  const sectionHeight = isMobileLayout
    ? '100%'
    : height > 0
      ? `${height}px`
      : useFluidMobileLayout
        ? '100%'
        : '0px'
  /** Закладки Date / Cart / History всегда над фабрикой; внутренние секции не дублируют `NotebookPeekShell`. */
  const notebookTabsOuter = true

  const editorSection = (
    <div
      className={styles.editorSection}
      style={{
        width: sectionWidth,
        height: sectionHeight,
        maxHeight: isMobileLayout ? '100%' : undefined,
      }}
    >
      <CardSectionRenderer />
    </div>
  )

  return (
    <div className={clsx(styles.cardSectionEditor)}>
      <div className={styles.editorArea}>
        <div
          className={styles.editorAreaCenter}
          style={{
            width: sectionWidth,
            height: sectionHeight,
            maxHeight: isMobileLayout ? '100%' : undefined,
          }}
        >
          {activeSection === 'cardtext' && (
            <div className={styles.cardtextToolbarTop}>
              {cardtextCurrentView === 'view' ? (
                <CardtextEditTitleInline />
              ) : null}
            </div>
          )}
          {/* {activeSection === 'cardphoto' && (
            <div className={styles.cardphotoToolbarTop}>
              <Toolbar section="cardphoto" />
            </div>
          )} */}
          {/* {showLeftInnerSidebar && (
            <div
              className={styles.workZoneLeft}
              style={{ height: `${sizeCard.height}px` }}
            >
              <SectionEditorLeftInnerSidebar />
            </div>
          )} */}
          <SectionEditorNotebookTabsOuterProvider value={notebookTabsOuter}>
            <NotebookPeekShell>{editorSection}</NotebookPeekShell>
          </SectionEditorNotebookTabsOuterProvider>
        </div>
      </div>
    </div>
  )
}
