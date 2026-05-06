import React from 'react'
import clsx from 'clsx'
import { useSectionMenuFacade } from '@entities/sectionEditorMenu/application/facades'
import { useSizeFacade } from '@layout/application/facades'
import { useCardtextFacade } from '@cardtext/application/facades'
import { CardSectionRenderer } from './CardSectionRenderer/CardSectionRenderer'
import { CardtextEditTitleInline } from '@cardtext/presentation/CardtextEditTitleInline/CardtextEditTitleInline'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { NotebookPeekShell } from '@date/presentation/NotebookPeekShell'
import { SectionEditorNotebookTabsOuterProvider } from './SectionEditorNotebookTabsOuterContext'
import styles from './CardSectionEditor.module.scss'

export const CardSectionEditor: React.FC = () => {
  const { sizeCard } = useSizeFacade()
  const { activeSection } = useSectionMenuFacade()
  const { currentView: cardtextCurrentView } = useCardtextFacade()
  const { activePieSide } = useRightListArchiveMini()
  const width = sizeCard.width
  const notebookTabsOuter = activePieSide === 'left'

  const editorSection = (
    <div
      className={styles.editorSection}
      style={{
        width: `${width}px`,
        height: `${sizeCard.height}px`,
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
            width: `${width}px`,
            height: `${sizeCard.height}px`,
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
            {notebookTabsOuter ? (
              <NotebookPeekShell>{editorSection}</NotebookPeekShell>
            ) : (
              editorSection
            )}
          </SectionEditorNotebookTabsOuterProvider>
        </div>
      </div>
    </div>
  )
}
