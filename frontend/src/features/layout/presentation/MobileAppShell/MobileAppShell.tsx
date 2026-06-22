import React, { useCallback, useMemo, useRef } from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { store } from '@app/state/store'
import { openCardphotoFromMiniStripRequested } from '@cardphoto/infrastructure/state'
import { setCartListPanelOpen } from '@cart/infrastructure/state'
import { selectCartListPanelOpen } from '@cart/infrastructure/selectors'
import { setActiveSection } from '@entities/sectionEditorMenu/infrastructure/state'
import {
  setCardPieListPanelOpen,
  setHistoryListPanelOpen,
  setNotebookStripDateOverCart,
  setNotebookStripDateOverHistory,
  setNotebookStripTab,
} from '@date/calendar/infrastructure/state'
import {
  selectIsCardPieListPanelOpen,
  selectIsHistoryListPanelOpen,
  selectNotebookStripTab,
} from '@date/calendar/infrastructure/selectors'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import type { CardSection } from '@shared/config/constants'
import { selectUserLoginPanelOpen } from '@features/auth/infrastructure/selectors/authSelectors'
import { CardphotoListMobileSlot } from '@cardphoto/presentation/CardphotoListMobileSlot'
import { CardtextListMobileSlot } from '@cardtext/presentation/CardtextListMobileSlot'
import { AddressListMobileSlot } from '@envelope/addressBook/presentation/AddressListMobileSlot'
import { selectIsListPanelOpen } from '@cardphoto/infrastructure/selectors'
import { selectIsCardtextListPanelOpen } from '@cardtext/infrastructure/selectors'
import {
  selectRecipientListPanelOpen,
  selectSenderListPanelOpen,
} from '@envelope/infrastructure/selectors'
import { MarkStampYearDevProvider } from '@envelope/application/MarkStampYearDevContext'
import { IconLogo } from '@shared/ui/icons'
import { SectionEditorRightSidebar } from '@features/cardSectionEditor/presentation/SectionEditorRightSidebar/SectionEditorRightSidebar'
import { CardPie } from '@features/cardPie/presentation/CardPie'
import { CardPieLeftSlot } from '@features/cardPie/presentation/CardPieLeftSlot'
import { EditorPieListCardPieBadgeSync } from '@features/cardPie/presentation/EditorPieListCardPieBadgeSync'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { CardSectionEditor } from '@features/cardSectionEditor/presentation/CardSectionEditor'
import { DateToolbarListDateBadgeSync } from '@date/presentation/DateToolbarListDateBadgeSync'
import { RightSidebarHistoryBadgeSync } from '@toolbar/presentation/RightSidebarHistoryBadgeSync'
import { CalendarModeToolbarBadgesSync } from '@toolbar/presentation/CalendarModeToolbarBadgesSync'
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
  envelopeAddressCreateMode = false,
  cardPieListPanelOpen,
  onEditorPieToolbarAction,
}) => {
  const dispatch = useAppDispatch()
  const shellRef = useRef<HTMLDivElement>(null)
  useMobileVisualViewport(shellRef)
  const userLoginPanelOpen = useAppSelector(selectUserLoginPanelOpen)
  const cardphotoListPanelOpen = useAppSelector(selectIsListPanelOpen)
  const cardtextListPanelOpen = useAppSelector(selectIsCardtextListPanelOpen)
  const senderListPanelOpen = useAppSelector(selectSenderListPanelOpen)
  const recipientListPanelOpen = useAppSelector(selectRecipientListPanelOpen)
  const addressListPanelOpen = senderListPanelOpen || recipientListPanelOpen
  const notebookStripSection = useDateStripSectionForNotebookTabs()

  /** Mobile: только список CardPie перекрывает центр; Cart/History — календарь в фабрике. */
  const mobileCentralListPanel = useMemo(
    () => (cardPieListPanelOpen ? 'cardPie' : null),
    [cardPieListPanelOpen],
  )

  const handleLeftPieSectorClick = useCallback(
    (section: CardSection) => {
      onBeforeLeftPieInteraction()
      const state = store.getState()
      const notebookStripTab = selectNotebookStripTab(state)
      if (selectIsCardPieListPanelOpen(state)) {
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
      if (selectCartListPanelOpen(state)) {
        dispatch(setCartListPanelOpen(false))
      }
      if (selectIsHistoryListPanelOpen(state)) {
        dispatch(setHistoryListPanelOpen(false))
      }
      if (notebookStripTab === 'cart') {
        dispatch(setNotebookStripDateOverCart(true))
        dispatch(setNotebookStripTab('date'))
      } else if (notebookStripTab === 'history') {
        dispatch(setNotebookStripDateOverHistory(true))
        dispatch(setNotebookStripTab('date'))
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
      style={cardWidthStyle}
      data-envelope-address-create={
        envelopeAddressCreateMode ? 'true' : undefined
      }
      data-cardphoto-list-open={cardphotoListPanelOpen ? 'true' : undefined}
      data-cardtext-list-open={cardtextListPanelOpen ? 'true' : undefined}
      data-address-list-open={addressListPanelOpen ? 'true' : undefined}
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
              variant="headerStack"
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
                <div
                  ref={formRef}
                  className={clsx(
                    styles.mobileForm,
                    mobileCentralListPanel != null && styles.mobileFormListPanel,
                  )}
                >
                  <div
                    className={styles.mobileFormEditorLayer}
                    aria-hidden={mobileCentralListPanel != null}
                  >
                    <CardSectionEditor />
                  </div>
                  {mobileCentralListPanel === 'cardPie' ? (
                    <div className={styles.mobileFormListOverlay}>
                      <CardPieLeftSlot />
                    </div>
                  ) : null}
                </div>
              </section>
            </div>
          </div>
        </div>

        {userLoginPanelOpen ? (
          <div className={styles.mobileUserPanel}>
            <UserLoginRightSlot />
          </div>
        ) : null}
        {cardphotoListPanelOpen ? (
          <div className={styles.mobileCardphotoListPanel}>
            <CardphotoListMobileSlot />
          </div>
        ) : null}
        {cardtextListPanelOpen ? (
          <div className={styles.mobileCardtextListPanel}>
            <CardtextListMobileSlot />
          </div>
        ) : null}
        {addressListPanelOpen ? (
          <div className={styles.mobileAddressListPanel}>
            <AddressListMobileSlot />
          </div>
        ) : null}
      </MarkStampYearDevProvider>
    </div>
  )
}
