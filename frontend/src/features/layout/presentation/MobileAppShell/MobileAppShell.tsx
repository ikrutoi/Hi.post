import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { store } from '@app/state/store'
import { openCardphotoFromMiniStripRequested } from '@cardphoto/infrastructure/state'
import { setCartListPanelOpen } from '@cart/infrastructure/state'
import { selectCartListPanelOpen, selectActiveCartPostcardCount, selectBlockedCartPostcardCount } from '@cart/infrastructure/selectors'
import { setActiveSection } from '@entities/sectionEditorMenu/infrastructure/state'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import {
  notebookTabHistoryClicked,
} from '@date/calendar/application/orchestration/notebookOrchestration.events'
import {
  setCardPieListPanelOpen,
  setHistoryListPanelOpen,
  setNotebookStripDateOverCart,
  setNotebookStripDateOverHistory,
  setNotebookStripTab,
  updateLastViewedCalendarDate,
} from '@date/calendar/infrastructure/state'
import {
  selectIsCardPieListPanelOpen,
  selectIsHistoryListPanelOpen,
  selectNotebookStripTab,
} from '@date/calendar/infrastructure/selectors'
import { addEditorPiePlanToCart } from '@date/infrastructure/state'
import { dispatchCardPieToolbarIconState } from '@toolbar/application/syncCardPieToolbarIcons'
import type { CardSection, IconKey } from '@shared/config/constants'
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
import { MobileCardPieGutterMinis } from './MobileCardPieGutterMinis'
import { MobileCartListSlot } from './MobileCartListSlot'
import { useMobilePlanCardPies } from './useMobilePlanCardPies'
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
  onCartListSelectEntry,
  onCartListDateEditEntry,
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
  const cartListPanelOpen = useAppSelector(selectCartListPanelOpen)
  const notebookStripSection = useDateStripSectionForNotebookTabs()
  const activeSection = useAppSelector(selectActiveSection)
  const activeCartPostcardCount = useAppSelector(selectActiveCartPostcardCount)
  const blockedCartPostcardCount = useAppSelector(selectBlockedCartPostcardCount)
  const cartSlotVisualMode = useMemo(() => {
    if (activeCartPostcardCount > 0 && blockedCartPostcardCount > 0) {
      return 'mixed' as const
    }
    if (activeCartPostcardCount === 0 && blockedCartPostcardCount > 0) {
      return 'blockedOnly' as const
    }
    return 'activeOnly' as const
  }, [activeCartPostcardCount, blockedCartPostcardCount])

  /** Mobile: CardPie list overlay только на вкладке «Дата»; сам CardPie всегда виден для переключения секций. */
  const showMobileCardPieListInFactory =
    notebookStripSection === 'date' && cardPieListPanelOpen

  useEffect(() => {
    if (!showMobileCardPieListInFactory && cardPieListPanelOpen) {
      dispatch(setCardPieListPanelOpen(false))
      dispatchCardPieToolbarIconState(dispatch, false)
    }
  }, [showMobileCardPieListInFactory, cardPieListPanelOpen, dispatch])

  useEffect(() => {
    if (
      activeSection != null &&
      activeSection !== 'date' &&
      cardPieListPanelOpen
    ) {
      dispatch(setCardPieListPanelOpen(false))
      dispatchCardPieToolbarIconState(dispatch, false)
    }
  }, [activeSection, cardPieListPanelOpen, dispatch])

  const mobileCentralListPanel = useMemo((): 'cardPie' | 'cart' | null => {
    if (showMobileCardPieListInFactory) return 'cardPie'
    if (cartListPanelOpen) return 'cart'
    return null
  }, [showMobileCardPieListInFactory, cartListPanelOpen])
  const { planPies, selectedPlanPie, selectedPlanPieId, selectPlanPie, cyclePlanPie } =
    useMobilePlanCardPies()

  const canCyclePlanPies = planPies.length > 0

  const handleLeftPieCenterPress = useCallback(() => {
    if (canCyclePlanPies) {
      const nextPlanPieId = cyclePlanPie()
      if (nextPlanPieId == null) return

      const pie = planPies.find((entry) => entry.id === nextPlanPieId)
      if (pie?.dispatchDate != null) {
        dispatch(
          updateLastViewedCalendarDate({
            year: pie.dispatchDate.year,
            month: pie.dispatchDate.month,
          }),
        )
      }
      return
    }

    onLeftPieCenterClick()
  }, [canCyclePlanPies, cyclePlanPie, planPies, dispatch, onLeftPieCenterClick])

  const handleSelectPlanPie = useCallback(
    (id: string) => {
      const pie = planPies.find((entry) => entry.id === id)
      if (pie == null) return

      selectPlanPie(id)

      const state = store.getState()
      const notebookStripTab = selectNotebookStripTab(state)
      if (notebookStripTab !== 'cart' && notebookStripTab !== 'history') {
        return
      }

      if (selectIsCardPieListPanelOpen(state)) {
        dispatch(setCardPieListPanelOpen(false))
        dispatchCardPieToolbarIconState(dispatch, false)
      }
      if (selectCartListPanelOpen(state)) {
        dispatch(setCartListPanelOpen(false))
      }
      if (selectIsHistoryListPanelOpen(state)) {
        dispatch(setHistoryListPanelOpen(false))
      }

      if (notebookStripTab === 'cart') {
        dispatch(setNotebookStripDateOverCart(true))
      } else {
        dispatch(setNotebookStripDateOverHistory(true))
      }
      dispatch(setNotebookStripTab('date'))
      dispatch(setActiveSection('date'))

      if (pie.dispatchDate != null) {
        dispatch(
          updateLastViewedCalendarDate({
            year: pie.dispatchDate.year,
            month: pie.dispatchDate.month,
          }),
        )
      }
    },
    [dispatch, planPies, selectPlanPie],
  )

  const handleLeftPieSectorClick = useCallback(
    (section: CardSection) => {
      onBeforeLeftPieInteraction()
      const state = store.getState()
      const notebookStripTab = selectNotebookStripTab(state)
      if (selectIsCardPieListPanelOpen(state)) {
        dispatch(setCardPieListPanelOpen(false))
        dispatchCardPieToolbarIconState(dispatch, false)
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

  const handleEditorPieToolbarAction = useCallback(
    (key: IconKey) => {
      if (key === 'addCart') {
        const branchKeys = selectedPlanPie?.dispatchBranchKey
          ? [selectedPlanPie.dispatchBranchKey]
          : planPies
              .map((pie) => pie.dispatchBranchKey)
              .filter((branchKey): branchKey is string => Boolean(branchKey))

        dispatch(
          addEditorPiePlanToCart({
            branchKeys,
            clearEditorAfterAdd: planPies.length === 1,
          }),
        )
        return false
      }

      return onEditorPieToolbarAction?.(key)
    },
    [dispatch, onEditorPieToolbarAction, planPies, selectedPlanPie],
  )

  const handleCartSlotClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation()
      const isOpen = selectCartListPanelOpen(store.getState())
      if (isOpen) {
        dispatch(setCartListPanelOpen(false))
        return
      }
      dispatch(setNotebookStripTab('cart'))
      dispatch(setActiveSection('date'))
      dispatch(setCartListPanelOpen(true))
    },
    [dispatch],
  )

  const handleHistorySlotClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation()
      const state = store.getState()
      if (selectNotebookStripTab(state) === 'history') {
        dispatch(setNotebookStripDateOverHistory(true))
        dispatch(setNotebookStripTab('date'))
        dispatch(setActiveSection('date'))
        dispatch(setHistoryListPanelOpen(false))
        return
      }
      dispatch(notebookTabHistoryClicked())
    },
    [dispatch],
  )

  const historyStripActive = notebookStripSection === 'history'

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
            <div className={styles.mobileHeaderLeft}>
              <div className={styles.mobileHeaderLogo} aria-hidden>
                <IconLogo />
              </div>
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
                <div className={styles.mobilePieSectionRow}>
                  <MobileCardPieGutterMinis
                    planPies={planPies}
                    selectedPlanPieId={selectedPlanPieId}
                    onSelectPlanPie={handleSelectPlanPie}
                  />
                  <div className={styles.mobilePieStage}>
                  <div className={styles.mobilePieWrap}>
                      <CardPie
                        fillContainer
                        station="left"
                        {...(selectedPlanPie != null
                          ? {
                              pieInner: selectedPlanPie.inner,
                              pieSections: selectedPlanPie.sections,
                            }
                          : { isProcessed: true })}
                        onLeftPieSectorClick={handleLeftPieSectorClick}
                        onLeftPieCenterClick={handleLeftPieCenterPress}
                        leftPieCenterPlanCycle={canCyclePlanPies}
                        leftPieCenterClickable={
                          canCyclePlanPies ||
                          (activePieSide === 'right' && !showTopCardStripFullSpan)
                        }
                      />
                  </div>
                    <div className={styles.mobilePieToolbar}>
                      <Toolbar
                        section="editorPie"
                        onActionClick={handleEditorPieToolbarAction}
                      />
                    </div>
                  </div>
                    <div className={styles.mobilePieRightSlot}>
                      <div className={styles.mobilePieRightSlotCartShell}>
                        <button
                          type="button"
                          className={clsx(
                            styles.mobilePieRightSlotItemCart,
                            cartSlotVisualMode === 'activeOnly' &&
                              styles.mobilePieRightSlotItemCartModeActiveOnly,
                            cartSlotVisualMode === 'mixed' &&
                              styles.mobilePieRightSlotItemCartModeMixed,
                            cartSlotVisualMode === 'blockedOnly' &&
                              styles.mobilePieRightSlotItemCartModeBlockedOnly,
                          )}
                          aria-label="Cart postcards"
                          aria-pressed={cartListPanelOpen}
                          onClick={handleCartSlotClick}
                        >
                          <div
                            className={clsx(
                              styles.mobilePieRightSlotCartHalf,
                              styles.mobilePieRightSlotCartActive,
                            )}
                          />
                          <div
                            className={clsx(
                              styles.mobilePieRightSlotCartHalf,
                              styles.mobilePieRightSlotCartBlocked,
                            )}
                          />
                        </button>
                        <div
                          className={styles.mobilePieRightSlotCartCover}
                          aria-hidden
                        />
                        {activeCartPostcardCount > 0 ? (
                          <span
                            className={clsx(
                              styles.mobilePieRightSlotCartCount,
                              styles.mobilePieRightSlotCartCountActive,
                            )}
                            aria-hidden
                          >
                            {activeCartPostcardCount}
                          </span>
                        ) : null}
                        {blockedCartPostcardCount > 0 ? (
                          <span
                            className={clsx(
                              styles.mobilePieRightSlotCartCount,
                              styles.mobilePieRightSlotCartCountBlocked,
                            )}
                            aria-hidden
                          >
                            {blockedCartPostcardCount}
                          </span>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        className={clsx(
                          styles.mobilePieRightSlotItem,
                          styles.mobilePieRightSlotItemHistory,
                        )}
                        aria-label="History postcards"
                        aria-pressed={historyStripActive}
                        onClick={handleHistorySlotClick}
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
                  {mobileCentralListPanel === 'cart' ? (
                    <div className={styles.mobileFormListOverlay}>
                      <MobileCartListSlot
                        onSelectEntry={onCartListSelectEntry}
                        onDateEditEntry={onCartListDateEditEntry}
                      />
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
