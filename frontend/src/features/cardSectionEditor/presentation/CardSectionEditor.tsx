import React, { useMemo } from 'react'
import clsx from 'clsx'
import { useAppSelector } from '@app/hooks'
import { useSectionMenuFacade } from '@entities/sectionEditorMenu/application/facades'
import { useSizeFacade } from '@layout/application/facades'
import { useCardtextFacade } from '@cardtext/application/facades'
import { CardphotoListMobileSlot } from '@cardphoto/presentation/CardphotoListMobileSlot'
import { selectNotebookStripTab } from '@date/calendar/infrastructure/selectors'
import { selectCartListPanelOpen } from '@cart/infrastructure/selectors'
import { selectIsHistoryListPanelOpen } from '@date/calendar/infrastructure/selectors'
import { MobileCartListSlot } from '@layout/presentation/MobileAppShell/MobileCartListSlot'
import { MobileHistoryListSlot } from '@layout/presentation/MobileAppShell/MobileHistoryListSlot'
import { CardtextListMobileSlot } from '@cardtext/presentation/CardtextListMobileSlot'
import { AddressListMobileSlot } from '@envelope/addressBook/presentation/AddressListMobileSlot'
import { EnvelopeMobileAddressFocusProvider } from '@envelope/presentation/EnvelopeMobileAddressFocusContext'
import { useMobileFactoryListChrome } from '../application/hooks/useMobileFactoryListChrome'
import { CardSectionRenderer } from './CardSectionRenderer/CardSectionRenderer'
import { CardtextEditTitleInline } from '@cardtext/presentation/CardtextEditTitleInline/CardtextEditTitleInline'
import { NotebookPeekShell } from '@date/presentation/NotebookPeekShell'
import { SectionEditorNotebookTabsOuterProvider } from './SectionEditorNotebookTabsOuterContext'
import {
  MobileFactorySectionFrame,
  type MobileFactorySectionSurface,
} from './MobileFactorySectionFrame'
import {
  MobileFactoryToolbarShell,
  MobileScenarioToolbarProvider,
} from './MobileFactoryToolbar'
import styles from './CardSectionEditor.module.scss'

export const CardSectionEditor: React.FC = () => {
  const { sizeCard, isMobileLayout } = useSizeFacade()
  const { activeSection } = useSectionMenuFacade()
  const cartListPanelOpen = useAppSelector(selectCartListPanelOpen)
  const historyListPanelOpen = useAppSelector(selectIsHistoryListPanelOpen)
  const notebookStripTab = useAppSelector(selectNotebookStripTab)
  const { currentView: cardtextCurrentView } = useCardtextFacade()
  const {
    showMobileTemplateList,
    mobileFactoryChromePeek,
    mobileDateListChromePeek,
  } = useMobileFactoryListChrome()

  const mobileSectionSurface = useMemo((): MobileFactorySectionSurface => {
    if (cartListPanelOpen && !mobileDateListChromePeek) {
      return 'date-cart'
    }
    if (historyListPanelOpen && !mobileDateListChromePeek) {
      return 'date-history'
    }
    if (activeSection === 'date') {
      if (mobileFactoryChromePeek) {
        return 'date'
      }
      switch (notebookStripTab) {
        case 'cart':
          return 'date-cart'
        case 'history':
          return 'date-history'
        default:
          return 'date'
      }
    }
    switch (activeSection) {
      case 'cardphoto':
        return 'cardphoto'
      case 'cardtext':
        return 'cardtext'
      case 'envelope':
        return 'envelope'
      case 'aroma':
        return 'aroma'
      default:
        return 'neutral'
    }
  }, [
    activeSection,
    notebookStripTab,
    mobileFactoryChromePeek,
    mobileDateListChromePeek,
    cartListPanelOpen,
    historyListPanelOpen,
  ])

  const mobileTemplateList = useMemo(() => {
    if (cartListPanelOpen) {
      return <MobileCartListSlot />
    }
    if (historyListPanelOpen) {
      return <MobileHistoryListSlot />
    }
    switch (activeSection) {
      case 'cardphoto':
        return <CardphotoListMobileSlot />
      case 'cardtext':
        return <CardtextListMobileSlot />
      case 'envelope':
        return <AddressListMobileSlot />
      default:
        return null
    }
  }, [activeSection, cartListPanelOpen, historyListPanelOpen])

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

  const editorCenter = isMobileLayout ? (
    <MobileFactorySectionFrame
      surface={mobileSectionSurface}
      showTemplateList={showMobileTemplateList}
      templateList={mobileTemplateList}
      toolbar={<MobileFactoryToolbarShell />}
    >
      {activeSection === 'cardtext' && (
        <div className={styles.cardtextToolbarTop}>
          {cardtextCurrentView === 'view' ? <CardtextEditTitleInline /> : null}
        </div>
      )}
      <SectionEditorNotebookTabsOuterProvider value={notebookTabsOuter}>
        {factoryBody}
      </SectionEditorNotebookTabsOuterProvider>
    </MobileFactorySectionFrame>
  ) : (
    <div
      className={styles.editorAreaCenter}
      style={{
        width: sectionWidth,
        height: sectionHeight,
        maxHeight: useFluidLayout ? '100%' : undefined,
      }}
    >
      {activeSection === 'cardtext' && (
        <div className={styles.cardtextToolbarTop}>
          {cardtextCurrentView === 'view' ? <CardtextEditTitleInline /> : null}
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
