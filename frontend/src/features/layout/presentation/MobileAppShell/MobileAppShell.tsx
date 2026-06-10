import React from 'react'
import { MarkStampYearDevProvider } from '@envelope/application/MarkStampYearDevContext'
import { IconLogo } from '@shared/ui/icons'
import { SectionEditorSidebar } from '@features/cardSectionEditor/presentation/SectionEditorSidebar/SectionEditorSidebar'
import { SectionEditorRightSidebar } from '@features/cardSectionEditor/presentation/SectionEditorRightSidebar/SectionEditorRightSidebar'
import { CardPie } from '@features/cardPie/presentation/CardPie'
import { EditorPieListCardPieBadgeSync } from '@features/cardPie/presentation/EditorPieListCardPieBadgeSync'
import { MiniSectionsSlot } from '@cardPanel/presentation/MiniSectionsSlot'
import { RightListArchiveMiniProvider } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { CardSectionToolbar } from '@features/cardSectionToolbar/presentation/CardSectionToolbar'
import { CardSectionEditor } from '@features/cardSectionEditor/presentation/CardSectionEditor'
import { DateToolbarListDateBadgeSync } from '@date/presentation/DateToolbarListDateBadgeSync'
import { RightSidebarHistoryBadgeSync } from '@toolbar/presentation/RightSidebarHistoryBadgeSync'
import { CalendarModeToolbarBadgesSync } from '@toolbar/presentation/CalendarModeToolbarBadgesSync'
import { CartListPanel } from '@cart/presentation/CartListPanel'
import { HistoryListRightSlot } from '@date/presentation/HistoryListRightSlot'
import { UserLoginRightSlot } from '@features/auth/presentation/UserLoginRightSlot'
import type { MobileAppShellProps } from './mobileAppShell.types'
import styles from './MobileAppShell.module.scss'

export const MobileAppShell: React.FC<MobileAppShellProps> = ({
  formRef,
  cardPanelRef,
  sizeCard,
  onAppClick,
  onSectionEditorMenuAction,
  suppressSectionMenuActiveHighlight,
  pinActiveTab,
  activePieSide,
  showTopCardStripFullSpan,
  onBeforeLeftPieInteraction,
  onLeftPieCenterClick,
  centerStripMirrorValue,
  onPanelMiniSectionsToolbarAction,
  onBeforeOpenMiniSection,
  onActivateSectionPeekNoToolbar,
  hideSectionToolbar,
  listPanelOpen,
  onCartListSelectEntry,
  onCartListDateEditEntry,
  onHistoryListSelectEntry,
}) => {
  const cardWidthStyle =
    sizeCard?.width != null
      ? ({ '--card-width': `${sizeCard.width}px` } as React.CSSProperties)
      : undefined

  return (
    <div className={styles.mobileShell} onClick={onAppClick}>
      <MarkStampYearDevProvider>
        <div className={styles.mobileSubstrate}>
          <header className={styles.mobileHeader}>
            <div className={styles.mobileHeaderLogo} aria-hidden>
              <IconLogo />
            </div>
            <SectionEditorRightSidebar
              variant="headerBar"
              pinActiveTab={pinActiveTab}
            />
          </header>

          <div className={styles.mobileBody} style={cardWidthStyle}>
            <EditorPieListCardPieBadgeSync />
            <DateToolbarListDateBadgeSync />
            <RightSidebarHistoryBadgeSync />
            <CalendarModeToolbarBadgesSync />

            <section className={styles.mobilePieSection} aria-label="Card pie">
              <div className={styles.mobilePieWrap}>
                <CardPie
                  isProcessed
                  fillContainer
                  station="left"
                  onBeforeLeftPieSectorClick={onBeforeLeftPieInteraction}
                  onLeftPieCenterClick={onLeftPieCenterClick}
                  leftPieCenterClickable={
                    activePieSide === 'right' && !showTopCardStripFullSpan
                  }
                />
              </div>
            </section>

            <section
              className={styles.mobileMiniSection}
              aria-label="Mini card sections"
            >
              <RightListArchiveMiniProvider value={centerStripMirrorValue}>
                <MiniSectionsSlot
                  ref={cardPanelRef}
                  embedded
                  rightModeActive={activePieSide === 'right'}
                  cardPieCopyStripActive={showTopCardStripFullSpan}
                  onBeforeOpenMiniSection={onBeforeOpenMiniSection}
                  onPanelMiniSectionsToolbarAction={
                    onPanelMiniSectionsToolbarAction
                  }
                  onActivateSectionPeekNoToolbar={onActivateSectionPeekNoToolbar}
                />
              </RightListArchiveMiniProvider>
            </section>

            <section
              className={styles.mobileEditorSection}
              aria-label="Section editor"
            >
              <div className={styles.mobileSectionToolbar}>
                {!hideSectionToolbar ? <CardSectionToolbar /> : null}
              </div>
              <div ref={formRef} className={styles.mobileForm}>
                <CardSectionEditor />
              </div>
            </section>
          </div>

          <SectionEditorSidebar
            variant="footer"
            onSectionEditorMenuAction={onSectionEditorMenuAction}
            suppressSectionMenuActiveHighlight={suppressSectionMenuActiveHighlight}
          />
        </div>

        <div className={styles.mobilePanels}>
          {listPanelOpen ? (
            <CartListPanel
              onSelectEntry={onCartListSelectEntry}
              onDateEditEntry={onCartListDateEditEntry}
            />
          ) : null}
          <HistoryListRightSlot onSelectEntry={onHistoryListSelectEntry} />
        </div>

        <div className={styles.mobileUserPanel}>
          <UserLoginRightSlot />
        </div>
      </MarkStampYearDevProvider>
    </div>
  )
}
