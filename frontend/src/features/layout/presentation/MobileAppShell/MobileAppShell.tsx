import React, { useCallback, useRef } from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { store } from '@app/state/store'
import { openCardphotoFromMiniStripRequested } from '@cardphoto/infrastructure/state'
import { setActiveSection } from '@entities/sectionEditorMenu/infrastructure/state'
import {
  setCardPieListPanelOpen,
} from '@date/calendar/infrastructure/state'
import { selectIsCardPieListPanelOpen } from '@date/calendar/infrastructure/selectors'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import type { CardSection } from '@shared/config/constants'
import { selectUserLoginPanelOpen } from '@features/auth/infrastructure/selectors/authSelectors'
import { MarkStampYearDevProvider } from '@envelope/application/MarkStampYearDevContext'
import { IconLogo } from '@shared/ui/icons'
import { SectionEditorRightSidebar } from '@features/cardSectionEditor/presentation/SectionEditorRightSidebar/SectionEditorRightSidebar'
import { CardPie } from '@features/cardPie/presentation/CardPie'
import { CardPieLeftSlot } from '@features/cardPie/presentation/CardPieLeftSlot'
import { EditorPieListCardPieBadgeSync } from '@features/cardPie/presentation/EditorPieListCardPieBadgeSync'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { CardSectionToolbar } from '@features/cardSectionToolbar/presentation/CardSectionToolbar'
import { CardSectionEditor } from '@features/cardSectionEditor/presentation/CardSectionEditor'
import { DateToolbarListDateBadgeSync } from '@date/presentation/DateToolbarListDateBadgeSync'
import { RightSidebarHistoryBadgeSync } from '@toolbar/presentation/RightSidebarHistoryBadgeSync'
import { CalendarModeToolbarBadgesSync } from '@toolbar/presentation/CalendarModeToolbarBadgesSync'
import { CartListPanel } from '@cart/presentation/CartListPanel'
import { HistoryListRightSlot } from '@date/presentation/HistoryListRightSlot'
import { UserLoginRightSlot } from '@features/auth/presentation/UserLoginRightSlot'
import { CalendarNotebookTabs } from '@date/presentation/CalendarNotebookTabs'
import { useDateStripSectionForNotebookTabs } from '@date/presentation/useDateStripSectionForNotebookTabs'
import { useMobileVisualViewport } from '@layout/application/hooks/useMobileVisualViewport'
import type { MobileAppShellProps } from './mobileAppShell.types'
import styles from './MobileAppShell.module.scss'

export const MobileAppShell: React.FC<MobileAppShellProps> = ({
  formRef,
  sizeCard,
  onAppClick,
  pinActiveTab,
  activePieSide,
  showTopCardStripFullSpan,
  onBeforeLeftPieInteraction,
  onLeftPieCenterClick,
  hideSectionToolbar,
  envelopeAddressCreateMode = false,
  listPanelOpen,
  cardPieListPanelOpen,
  onEditorPieToolbarAction,
  onCartListSelectEntry,
  onCartListDateEditEntry,
  onHistoryListSelectEntry,
}) => {
  const dispatch = useAppDispatch()
  const shellRef = useRef<HTMLDivElement>(null)
  useMobileVisualViewport(shellRef)
  const userLoginPanelOpen = useAppSelector(selectUserLoginPanelOpen)
  const notebookStripSection = useDateStripSectionForNotebookTabs()

  const handleLeftPieSectorClick = useCallback(
    (section: CardSection) => {
      onBeforeLeftPieInteraction()
      if (selectIsCardPieListPanelOpen(store.getState())) {
        dispatch(setCardPieListPanelOpen(false))
        dispatch(
          updateToolbarIcon({
            section: 'editorPie',
            key: 'cardPie',
            value: 'enabled',
          }),
        )
        dispatch(
          updateToolbarIcon({
            section: 'date',
            key: 'cardPie',
            value: 'enabled',
          }),
        )
      }
      if (section === 'cardphoto') {
        dispatch(openCardphotoFromMiniStripRequested())
      }
      dispatch(setActiveSection(section))
    },
    [dispatch, onBeforeLeftPieInteraction],
  )
  const cardWidthStyle =
    sizeCard?.width != null && sizeCard.width > 0
      ? ({
          '--card-width': `${sizeCard.width}px`,
          '--card-work-zone-side': `${sizeCard.width}px`,
          ...(sizeCard.height > 0
            ? { '--card-height': `${sizeCard.height}px` }
            : {}),
        } as React.CSSProperties)
      : undefined

  return (
    <div
      ref={shellRef}
      className={styles.mobileShell}
      data-envelope-address-create={
        envelopeAddressCreateMode ? 'true' : undefined
      }
      onClick={onAppClick}
    >
      <MarkStampYearDevProvider>
        <div className={styles.mobileHeaderTabsOverlay}>
          <CalendarNotebookTabs
            variant="header"
            section={notebookStripSection}
          />
        </div>
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

          <div className={styles.mobileMain}>
            <div className={styles.mobileBody} style={cardWidthStyle}>
              <EditorPieListCardPieBadgeSync />
              <DateToolbarListDateBadgeSync />
              <RightSidebarHistoryBadgeSync />
              <CalendarModeToolbarBadgesSync />

              <section className={styles.mobilePieSection} aria-label="Card pie">
                <div className={styles.mobilePieStage}>
                  <div className={styles.mobilePieWrap}>
                    <CardPie
                      isProcessed
                      fillContainer
                      station="left"
                      onLeftPieSectorClick={handleLeftPieSectorClick}
                      onLeftPieCenterClick={onLeftPieCenterClick}
                      leftPieCenterClickable={
                        activePieSide === 'right' && !showTopCardStripFullSpan
                      }
                    />
                  </div>
                  <div className={styles.mobilePieToolbar}>
                    <Toolbar
                      section="editorPie"
                      onActionClick={onEditorPieToolbarAction}
                    />
                  </div>
                </div>
              </section>

              <section
                className={styles.mobileEditorSection}
                aria-label="Section editor"
              >
                <div className={styles.mobileSectionToolbar}>
                  {!hideSectionToolbar && !cardPieListPanelOpen ? (
                    <CardSectionToolbar />
                  ) : null}
                </div>
                <div
                  ref={formRef}
                  className={clsx(
                    styles.mobileForm,
                    cardPieListPanelOpen && styles.mobileFormCardPieList,
                  )}
                >
                  {cardPieListPanelOpen ? (
                    <CardPieLeftSlot />
                  ) : (
                    <CardSectionEditor />
                  )}
                </div>
              </section>
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
          </div>
        </div>

        {userLoginPanelOpen ? (
          <div className={styles.mobileUserPanel}>
            <UserLoginRightSlot />
          </div>
        ) : null}
      </MarkStampYearDevProvider>
    </div>
  )
}
