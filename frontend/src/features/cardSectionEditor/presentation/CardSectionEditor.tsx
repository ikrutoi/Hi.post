import React from 'react'
import clsx from 'clsx'
import { useSectionMenuFacade } from '@entities/sectionEditorMenu/application/facades'
import { useSizeFacade } from '@layout/application/facades'
import { useCardtextFacade } from '@cardtext/application/facades'
import { EnvelopeMobileAddressFocusProvider } from '@envelope/presentation/EnvelopeMobileAddressFocusContext'
import { CardSectionRenderer } from './CardSectionRenderer/CardSectionRenderer'
import { CardtextEditTitleInline } from '@cardtext/presentation/CardtextEditTitleInline/CardtextEditTitleInline'
import { NotebookPeekShell } from '@date/presentation/NotebookPeekShell'
import { SectionEditorNotebookTabsOuterProvider } from './SectionEditorNotebookTabsOuterContext'
import {
  MobileFactoryToolbarShell,
  MobileScenarioToolbarProvider,
} from './MobileFactoryToolbar'
import styles from './CardSectionEditor.module.scss'

export const CardSectionEditor: React.FC = () => {
  const { sizeCard, isMobileLayout } = useSizeFacade()
  const { activeSection } = useSectionMenuFacade()
  const { currentView: cardtextCurrentView } = useCardtextFacade()
  const width = sizeCard.width
  const height = sizeCard.height
  const useFluidLayout = height <= 0 || width <= 0
  const sectionWidth = width > 0 ? `${width}px` : '100%'
  const sectionHeight = height > 0 ? `${height}px` : '100%'
  /** Desktop: закладки над фабрикой. Mobile: закладки в хедере — inner sections не дублируют shell. */
  const notebookTabsOuter = true

  const editorSection = (
    <div
      className={styles.editorSection}
      style={
        isMobileLayout
          ? {
              width: '100%',
              height: '100%',
              maxHeight: '100%',
              minHeight: 0,
            }
          : {
              width: sectionWidth,
              height: sectionHeight,
              maxHeight: useFluidLayout ? '100%' : undefined,
            }
      }
    >
      <CardSectionRenderer />
    </div>
  )

  const factoryBody = isMobileLayout ? (
    editorSection
  ) : (
    <NotebookPeekShell>{editorSection}</NotebookPeekShell>
  )

  const editorCenter = (
    <div
      className={styles.editorAreaCenter}
      style={{
        width: sectionWidth,
        height: isMobileLayout ? undefined : sectionHeight,
        maxHeight: isMobileLayout || useFluidLayout ? '100%' : undefined,
      }}
    >
      {isMobileLayout ? <MobileFactoryToolbarShell /> : null}
      {activeSection === 'cardtext' && (
        <div className={styles.cardtextToolbarTop}>
          {cardtextCurrentView === 'view' ? (
            <CardtextEditTitleInline />
          ) : null}
        </div>
      )}
      <SectionEditorNotebookTabsOuterProvider value={notebookTabsOuter}>
        {factoryBody}
      </SectionEditorNotebookTabsOuterProvider>
    </div>
  )

  const editorLayout = (
    <div className={clsx(styles.cardSectionEditor)}>
      <div className={styles.editorArea}>{editorCenter}</div>
    </div>
  )

  return (
    <MobileScenarioToolbarProvider>
      {isMobileLayout && activeSection === 'envelope' ? (
        <EnvelopeMobileAddressFocusProvider>{editorLayout}</EnvelopeMobileAddressFocusProvider>
      ) : (
        editorLayout
      )}
    </MobileScenarioToolbarProvider>
  )
}
