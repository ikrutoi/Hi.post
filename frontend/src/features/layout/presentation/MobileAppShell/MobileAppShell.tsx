import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { store } from '@app/state/store'
import { openCardphotoFromMiniStripRequested } from '@cardphoto/infrastructure/state'
import { setCartListPanelOpen } from '@cart/infrastructure/state'
import {
  selectCartListPanelOpen,
  selectCartListSelectedLocalId,
  selectActiveCartPostcardCount,
  selectBlockedCartPostcardCount,
  selectCartItems,
} from '@cart/infrastructure/selectors'
import { setActiveSection } from '@entities/sectionEditorMenu/infrastructure/state'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import {
  buildMobileCartSlotOpenCommands,
  buildMobileHistorySlotOpenCommands,
} from '@date/calendar/application/orchestration/notebookOrchestration.rules'
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
  selectHistoryListSelectedLocalId,
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
import { MobileHistoryListSlot } from './MobileHistoryListSlot'
import { useMobilePlanCardPies } from './useMobilePlanCardPies'
import { CardPieLeftSlot } from '@features/cardPie/presentation/CardPieLeftSlot'
import { EditorPieListCardPieBadgeSync } from '@features/cardPie/presentation/EditorPieListCardPieBadgeSync'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { CardSectionEditor } from '@features/cardSectionEditor/presentation/CardSectionEditor'
import { DateToolbarListDateBadgeSync } from '@date/presentation/DateToolbarListDateBadgeSync'
import { RightSidebarHistoryBadgeSync } from '@toolbar/presentation/RightSidebarHistoryBadgeSync'
import { CalendarModeToolbarBadgesSync } from '@toolbar/presentation/CalendarModeToolbarBadgesSync'
import { UserLoginRightSlot } from '@features/auth/presentation/UserLoginRightSlot'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
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
  onPostcardPieCartToolbarAction,
  postcardPieCartToolbarStateOverride,
  onCartListSelectEntry,
  onCartListDateEditEntry,
  onHistoryListSelectEntry,
  onRightListPieSectorClick,
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
  const cartListSelectedLocalId = useAppSelector(selectCartListSelectedLocalId)
  const historyListPanelOpen = useAppSelector(selectIsHistoryListPanelOpen)
  const historyListSelectedLocalId = useAppSelector(selectHistoryListSelectedLocalId)
  const cartItems = useAppSelector(selectCartItems)
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

  const mobileCentralListPanel = useMemo((): 'cardPie' | 'cart' | 'history' | null => {
    if (showMobileCardPieListInFactory) return 'cardPie'
    if (cartListPanelOpen) return 'cart'
    if (historyListPanelOpen) return 'history'
    return null
  }, [showMobileCardPieListInFactory, cartListPanelOpen, historyListPanelOpen])

  /** Кнопка корзины/истории у CardPie: список открыт — только archive pie или пусто. */
  const mobileListArchiveSlotActive =
    cartListPanelOpen || historyListPanelOpen

  const { planPies, selectedPlanPie, selectedPlanPieId, selectPlanPie, cyclePlanPie } =
    useMobilePlanCardPies()
  const {
    mirrorTargetLocalId,
    mirrorListArchiveSource,
    rightPieCardphotoPeekNoToolbar,
    rightPieCardtextPeekNoToolbar,
    rightPieEnvelopePeekNoToolbar,
    rightPieAromaPeekNoToolbar,
    rightPieDatePeekNoToolbar,
    clearRightPieCardphotoPeek,
    clearRightPieCardtextPeek,
    clearRightPieEnvelopePeek,
    clearRightPieAromaPeek,
    clearRightPieDatePeek,
  } = useRightListArchiveMini()

  const clearMobileFactoryPeek = useCallback(() => {
    clearRightPieCardphotoPeek()
    clearRightPieCardtextPeek()
    clearRightPieEnvelopePeek()
    clearRightPieAromaPeek()
    clearRightPieDatePeek()
  }, [
    clearRightPieCardphotoPeek,
    clearRightPieCardtextPeek,
    clearRightPieEnvelopePeek,
    clearRightPieAromaPeek,
    clearRightPieDatePeek,
  ])

  const mobileFactoryChromePeek =
    rightPieCardphotoPeekNoToolbar ||
    rightPieCardtextPeekNoToolbar ||
    rightPieEnvelopePeekNoToolbar ||
    rightPieAromaPeekNoToolbar ||
    rightPieDatePeekNoToolbar

  /** Peek секции: список корзины/истории не перекрывает фабрику, кнопка списка остаётся включённой. */
  const mobileFactoryListOverlayKey = mobileFactoryChromePeek
    ? null
    : mobileCentralListPanel

  const canCyclePlanPies = planPies.length > 0
  /**
   * Mobile: один центральный CardPie вместо пары left/right на десктопе.
   * При открытом списке корзины/истории — только archive pie выбранной строки;
   * без выбора pie скрыт (не показываем сборку). После закрытия списка archive
   * может оставаться, пока activePieSide === 'right'.
   */
  const mobileCentralArchivePreview = useMemo((): {
    localId: number
    source: 'cart' | 'history'
  } | null => {
    if (cartListPanelOpen) {
      return cartListSelectedLocalId != null
        ? { localId: cartListSelectedLocalId, source: 'cart' }
        : null
    }
    if (historyListPanelOpen) {
      return historyListSelectedLocalId != null
        ? { localId: historyListSelectedLocalId, source: 'history' }
        : null
    }
    if (notebookStripSection === 'cart' && cartListSelectedLocalId != null) {
      return { localId: cartListSelectedLocalId, source: 'cart' }
    }
    if (notebookStripSection === 'history' && historyListSelectedLocalId != null) {
      return { localId: historyListSelectedLocalId, source: 'history' }
    }
    if (
      activePieSide === 'right' &&
      mirrorTargetLocalId != null &&
      mirrorListArchiveSource != null
    ) {
      return {
        localId: mirrorTargetLocalId,
        source: mirrorListArchiveSource,
      }
    }
    return null
  }, [
    activePieSide,
    cartListPanelOpen,
    cartListSelectedLocalId,
    historyListPanelOpen,
    historyListSelectedLocalId,
    mirrorTargetLocalId,
    mirrorListArchiveSource,
    notebookStripSection,
  ])

  const mobileCentralPieDisplay = useMemo((): 'archive' | 'hidden' | 'assembly' => {
    if (mobileCentralArchivePreview != null) return 'archive'
    if (
      mobileListArchiveSlotActive ||
      notebookStripSection === 'cart' ||
      notebookStripSection === 'history'
    ) {
      return 'hidden'
    }
    return 'assembly'
  }, [
    mobileCentralArchivePreview,
    mobileListArchiveSlotActive,
    notebookStripSection,
  ])

  /** Peek фабрики: закладки Date/Cart/History в хедере не подсвечиваются. */
  const suppressHeaderNotebookTabHighlight =
    mobileFactoryChromePeek ||
    cartListPanelOpen ||
    historyListPanelOpen

  const mobileCentralArchivePostcardStatus = useMemo(() => {
    if (mobileCentralArchivePreview == null) return undefined
    return cartItems.find(
      (postcard) => postcard.localId === mobileCentralArchivePreview.localId,
    )?.status
  }, [cartItems, mobileCentralArchivePreview])

  const showMobileCentralPostcardPieCartToolbar =
    mobileCentralPieDisplay === 'archive' &&
    mobileCentralArchivePostcardStatus === 'cart'

  const showMobileCentralPostcardPieHistoryToolbar =
    mobileCentralPieDisplay === 'archive' &&
    mobileCentralArchivePostcardStatus != null &&
    mobileCentralArchivePostcardStatus !== 'cart'

  const handleLeftPieCenterPress = useCallback(() => {
    if (activePieSide === 'right') {
      onLeftPieCenterClick()
      return
    }

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
  }, [
    activePieSide,
    canCyclePlanPies,
    cyclePlanPie,
    planPies,
    dispatch,
    onLeftPieCenterClick,
  ])

  const handleSelectPlanPie = useCallback(
    (id: string) => {
      const pie = planPies.find((entry) => entry.id === id)
      if (pie == null) return

      const state = store.getState()
      const notebookStripTab = selectNotebookStripTab(state)
      const exitingListArchiveSlot =
        selectCartListPanelOpen(state) || selectIsHistoryListPanelOpen(state)
      const exitingHeaderCartHistoryStrip =
        notebookStripTab === 'cart' || notebookStripTab === 'history'

      if (
        exitingListArchiveSlot ||
        exitingHeaderCartHistoryStrip ||
        activePieSide === 'right'
      ) {
        onBeforeLeftPieInteraction()

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
        } else if (notebookStripTab === 'history') {
          dispatch(setNotebookStripDateOverHistory(true))
        }
        dispatch(setNotebookStripTab('date'))

        if (exitingHeaderCartHistoryStrip) {
          dispatch(setActiveSection('date'))
        } else {
          dispatch(openCardphotoFromMiniStripRequested())
          dispatch(setActiveSection('cardphoto'))
        }
      }

      selectPlanPie(id)

      if (pie.dispatchDate != null) {
        dispatch(
          updateLastViewedCalendarDate({
            year: pie.dispatchDate.year,
            month: pie.dispatchDate.month,
          }),
        )
      }
    },
    [
      dispatch,
      planPies,
      selectPlanPie,
      activePieSide,
      onBeforeLeftPieInteraction,
    ],
  )

  const handleRightListArchivePieSectorClick = useCallback(
    (section: CardSection) => {
      onRightListPieSectorClick(section)
    },
    [onRightListPieSectorClick],
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
      if (selectCartListPanelOpen(store.getState())) {
        if (mobileFactoryChromePeek) {
          clearMobileFactoryPeek()
        }
        return
      }
      clearMobileFactoryPeek()
      if (selectIsCardPieListPanelOpen(store.getState())) {
        dispatch(setCardPieListPanelOpen(false))
        dispatchCardPieToolbarIconState(dispatch, false)
      }
      for (const command of buildMobileCartSlotOpenCommands()) {
        dispatch(command)
      }
    },
    [dispatch, mobileFactoryChromePeek, clearMobileFactoryPeek],
  )

  const handleHistorySlotClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation()
      if (selectIsHistoryListPanelOpen(store.getState())) {
        if (mobileFactoryChromePeek) {
          clearMobileFactoryPeek()
        }
        return
      }
      clearMobileFactoryPeek()
      if (selectIsCardPieListPanelOpen(store.getState())) {
        dispatch(setCardPieListPanelOpen(false))
        dispatchCardPieToolbarIconState(dispatch, false)
      }
      for (const command of buildMobileHistorySlotOpenCommands()) {
        dispatch(command)
      }
    },
    [dispatch, mobileFactoryChromePeek, clearMobileFactoryPeek],
  )

  const historyStripActive = historyListPanelOpen

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
            suppressTabHighlight={suppressHeaderNotebookTabHighlight}
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
                  <div
                    className={styles.mobilePieWrap}
                    data-mobile-central-pie-mode={mobileCentralPieDisplay}
                    aria-hidden={mobileCentralPieDisplay === 'hidden'}
                  >
                      {mobileCentralPieDisplay === 'archive' &&
                      mobileCentralArchivePreview != null ? (
                        <CardPie
                          fillContainer
                          station="right"
                          isProcessed={false}
                          status={mobileCentralArchivePostcardStatus}
                          id={String(mobileCentralArchivePreview.localId)}
                          rightListSource={mobileCentralArchivePreview.source}
                          onListArchiveSectorClick={
                            handleRightListArchivePieSectorClick
                          }
                          onRightPieCenterClick={handleLeftPieCenterPress}
                          leftPieCenterClickable={
                            !showTopCardStripFullSpan
                          }
                        />
                      ) : mobileCentralPieDisplay === 'assembly' ? (
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
                          leftPieCenterClickable={canCyclePlanPies}
                        />
                      ) : null}
                  </div>
                    {mobileCentralPieDisplay === 'assembly' ? (
                      <div className={styles.mobilePieToolbar}>
                        <Toolbar
                          section="editorPie"
                          onActionClick={handleEditorPieToolbarAction}
                        />
                      </div>
                    ) : null}
                    {showMobileCentralPostcardPieCartToolbar ? (
                      <div className={styles.mobilePieToolbar}>
                        <Toolbar
                          section="postcardPieCart"
                          onActionClick={onPostcardPieCartToolbarAction}
                          stateOverride={postcardPieCartToolbarStateOverride}
                          mergedWithCenter
                        />
                      </div>
                    ) : null}
                    {showMobileCentralPostcardPieHistoryToolbar ? (
                      <div className={styles.mobilePieToolbar}>
                        <Toolbar section="postcardPieHistory" mergedWithCenter />
                      </div>
                    ) : null}
                  </div>
                    <div className={styles.mobilePieRightSlot}>
                      <div className={styles.mobilePieRightSlotCartShell}>
                        <div className={styles.mobilePieRightSlotCartButtonFrame}>
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
                        </div>
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
                    mobileFactoryListOverlayKey != null && styles.mobileFormListPanel,
                  )}
                  data-mobile-factory-chrome={
                    mobileFactoryChromePeek ? 'peek' : undefined
                  }
                >
                  <div
                    className={styles.mobileFormEditorLayer}
                    aria-hidden={mobileFactoryListOverlayKey != null}
                  >
                    <CardSectionEditor />
                  </div>
                  {mobileFactoryListOverlayKey === 'cardPie' ? (
                    <div className={styles.mobileFormListOverlay}>
                      <CardPieLeftSlot />
                    </div>
                  ) : null}
                  {mobileFactoryListOverlayKey === 'cart' ? (
                    <div className={styles.mobileFormListOverlay}>
                      <MobileCartListSlot
                        onSelectEntry={onCartListSelectEntry}
                        onDateEditEntry={onCartListDateEditEntry}
                      />
                    </div>
                  ) : null}
                  {mobileFactoryListOverlayKey === 'history' ? (
                    <div className={styles.mobileFormListOverlay}>
                      <MobileHistoryListSlot
                        onSelectEntry={onHistoryListSelectEntry}
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
