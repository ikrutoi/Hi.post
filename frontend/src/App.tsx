import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  selectCartCalendarDatePickLocalId,
  selectCartCalendarDatePickMode,
  selectHistoryListSelectedLocalId,
  selectHistoryOpenDayPanelArchiveLocalId,
  selectIsCardPieListPanelOpen,
  selectIsHistoryListPanelOpen,
  selectNotebookDateTabPeekClearTick,
  selectComputedNotebookStripTab,
  selectNotebookStripTab,
} from '@date/calendar/infrastructure/selectors'
import { MiniSectionsSlot } from './features/cardPanel/presentation/MiniSectionsSlot'
import { CardSectionEditor } from '@features/cardSectionEditor/presentation/CardSectionEditor'
import { CardSectionToolbar } from '@features/cardSectionToolbar/presentation/CardSectionToolbar'
import {
  CartListPanel,
  type CartListPanelItem,
} from './features/cart/presentation/CartListPanel'
import { CardPie } from '@features/cardPie/presentation/CardPie'
import { CardPieLeftSlot } from '@features/cardPie/presentation/CardPieLeftSlot'
import { EditorPieListCardPieBadgeSync } from '@features/cardPie/presentation/EditorPieListCardPieBadgeSync'
import { DateToolbarListDateBadgeSync } from '@date/presentation/DateToolbarListDateBadgeSync'
import { RightSidebarHistoryBadgeSync } from '@toolbar/presentation/RightSidebarHistoryBadgeSync'
import { CalendarModeToolbarBadgesSync } from '@toolbar/presentation/CalendarModeToolbarBadgesSync'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { SectionEditorSidebar } from '@features/cardSectionEditor/presentation/SectionEditorSidebar/SectionEditorSidebar'
import { SectionEditorRightSidebar } from '@features/cardSectionEditor/presentation/SectionEditorRightSidebar/SectionEditorRightSidebar'
import { useAuthInit } from '@features/auth/application/hooks/useAuthInit'
import { useCloudBackupFetch } from '@features/sync/application/hooks/useCloudBackupFetch'
import { UserLoginRightSlot } from '@features/auth/presentation/UserLoginRightSlot'
import { selectAuthInitialized } from '@features/auth/infrastructure/selectors/authSelectors'
import {
  useToolbarClickReset,
  useViewportInit,
} from '@layout/application/hooks'
import { useSizeFacade } from '@layout/application/facades'
import { useRecordSizeCard } from '@shared/hooks'
import { useSectionMenuFacade } from '@entities/sectionEditorMenu/application/facades'
import { setActiveSection } from '@entities/sectionEditorMenu/infrastructure/state'
import type { CardSection } from '@shared/config/constants'
import { useCartFacade } from './features/cart/application/facades/useCartFacade'
import {
  selectCartItems,
  selectCardPieCopyStripExpanded,
} from '@cart/infrastructure/selectors'
import {
  setCardPieCopyStripExpanded,
  setCartListPanelOpen,
  setCartListSelectedLocalId,
  setCartListStatusSegment,
} from '@cart/infrastructure/state'
import { EnvelopeRightSlot } from '@envelope/presentation/EnvelopeRightSlot'
import { DateRightSlot } from '@date/presentation/DateRightSlot'
import { HistoryListRightSlot } from '@date/presentation/HistoryListRightSlot'
import type { HistoryListPanelItem } from '@date/presentation/HistoryListPanel'
import { CardtextRightSlot } from '@cardtext/presentation/CardtextRightSlot'
import { CardphotoRightSlot } from '@cardphoto/presentation/CardphotoRightSlot'
import { selectListArchiveCardPieBundle } from '@features/cardPie/infrastructure/selectors/cardPieSelectors'
import { RightListArchiveMiniProvider } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { applyArchiveSectionToEditorRequested } from '@cardPanel/infrastructure/state'
import {
  closeDayPanel,
  openDayPanel,
  setCartCalendarDatePickMode,
  setCartCalendarDatePickLocalId,
  setHistoryListPanelOpen,
  setHistoryListSelectedLocalId,
  setNotebookStripTab,
  updateLastViewedCalendarDate,
} from '@date/calendar/infrastructure/state'
import { calendarDayHasCards } from '@date/cell/domain/calendarDayContent'
import { selectCardsByDateMap } from '@entities/card/infrastructure/selectors'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import { applyRightListArchiveToolbarVisuals } from '@toolbar/application/syncRightListArchiveToolbarVisuals'
import { notebookSessionRestored } from '@date/calendar/application/orchestration/notebookOrchestration.events'
import { buildDisableCartOrHistoryNotebookOnSectionMenuCopyExitCommands } from '@date/calendar/application/orchestration/notebookOrchestration.rules'
import { SECTION_EDITOR_MENU_ICON_KEYS } from '@features/toolbar/domain/types/sectionEditorMenu.types'
import { primaryDispatchDateFromPieInner } from '@features/cardPie/domain/primaryDispatchDateFromPieInner'
import { MarkStampYearDevProvider, useMarkStampYearDev } from '@envelope/application/MarkStampYearDevContext'
import { MobileAppShell } from '@layout/presentation/MobileAppShell'
import styles from './App.module.scss'
import { store } from '@app/state/store'

function MarkStampYearDevButtons() {
  const { bump } = useMarkStampYearDev()
  return (
    <div className={styles.appRightSidebarDevStamp}>
      <button
        type="button"
        className={styles.appRightSidebarDevStampButton}
        aria-label="Уменьшить число на марке"
        onClick={() => bump(-1)}
      >
        −
      </button>
      <button
        type="button"
        className={styles.appRightSidebarDevStampButton}
        aria-label="Увеличить число на марке"
        onClick={() => bump(1)}
      >
        +
      </button>
    </div>
  )
}

/** Merges the mini-sections strip with the left or right CardPie under one chrome frame. */
const App = () => {
  const CALENDAR_STRIP_TAB_SESSION_KEY = 'hi.post.calendarStripTab'
  const appRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const cardPanelRef = useRef<HTMLDivElement>(null)
  const mergedTopChromeRef = useRef<HTMLDivElement>(null)
  const leftPieWrapRef = useRef<HTMLDivElement>(null)
  const cardPieCopyClosedByEditRef = useRef(false)
  /** date pick включён через cardPieEdit (не dateEdit строки cartBlocked). */
  const cartDatePickOwnedByCardPieEditRef = useRef(false)
  const [colorToolbar, setColorToolbar] = useState<boolean | null>(null)
  const [activePieSide, setActivePieSide] = useState<'left' | 'right'>('left')
  /** After turning off cardPieCopy: switch to left pie and keep `cardPieEdit` enabled until clicked again. */
  const [
    suppressCardPieEditActiveAfterCopy,
    setSuppressCardPieEditActiveAfterCopy,
  ] = useState(false)
  /** cardPieEdit в правом режиме: редактирование левой открытки без смены activePieSide. */
  const [cardPieEditEngaged, setCardPieEditEngaged] = useState(false)
  const [rightPieCardphotoPeekNoToolbar, setRightPieCardphotoPeekNoToolbar] =
    useState(false)
  const [rightPieCardtextPeekNoToolbar, setRightPieCardtextPeekNoToolbar] =
    useState(false)
  const [rightPieEnvelopePeekNoToolbar, setRightPieEnvelopePeekNoToolbar] =
    useState(false)
  const [rightPieAromaPeekNoToolbar, setRightPieAromaPeekNoToolbar] =
    useState(false)
  const [rightPieDatePeekNoToolbar, setRightPieDatePeekNoToolbar] =
    useState(false)

  const cardPieCopyStripExpanded = useAppSelector(
    selectCardPieCopyStripExpanded,
  )
  const notebookStripTab = useAppSelector(selectNotebookStripTab)
  const cartCalendarDatePickMode = useAppSelector(selectCartCalendarDatePickMode)
  const computedNotebookStripTab = useAppSelector(selectComputedNotebookStripTab)
  const notebookDateTabPeekClearTick = useAppSelector(
    selectNotebookDateTabPeekClearTick,
  )
  const dispatch = useAppDispatch()

  /** Правый CardPie после выхода из copy через sectionEditorMenu (закладка cart/history снята). */
  const [rightListArchivePinnedForLeftFactory, setRightListArchivePinnedForLeftFactory] =
    useState<{
      localId: number
      source: 'cart' | 'history'
    } | null>(null)

  useLayoutEffect(() => {
    if (notebookDateTabPeekClearTick === 0) return
    setRightPieCardphotoPeekNoToolbar(false)
    setRightPieCardtextPeekNoToolbar(false)
    setRightPieEnvelopePeekNoToolbar(false)
    setRightPieAromaPeekNoToolbar(false)
    setRightPieDatePeekNoToolbar(false)
  }, [notebookDateTabPeekClearTick])

  useAuthInit()
  useCloudBackupFetch()
  const authInitialized = useAppSelector(selectAuthInitialized)
  const layoutReady = authInitialized
  useViewportInit()
  const { sizeCard, isMobileLayout } = useSizeFacade()
  useRecordSizeCard(formRef, cardPanelRef, {
    enabled: layoutReady,
    skipPanelMeasure: isMobileLayout,
  })
  const sectionSize =
    sizeCard?.width != null && sizeCard.width > 0 ? sizeCard.width / 6 : null

  const handleAppClick = useToolbarClickReset(colorToolbar, setColorToolbar)
  const { activeSection } = useSectionMenuFacade()
  const prevActiveSectionRef = useRef(activeSection)
  const { listPanelOpen, listSelectedLocalId } = useCartFacade()
  const cartCalendarDatePickLocalId = useAppSelector(
    selectCartCalendarDatePickLocalId,
  )
  const cardsByDateMap = useAppSelector(selectCardsByDateMap)
  const prevCartListPanelOpen = useRef(listPanelOpen)
  const prevListArchiveListContextRef = useRef<{
    localId: number | null
    source: 'cart' | 'history' | null
  }>({ localId: null, source: null })

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return
    const savedTab = window.sessionStorage.getItem(
      CALENDAR_STRIP_TAB_SESSION_KEY,
    )
    const tab = savedTab === 'cart' || savedTab === 'history' ? savedTab : null
    dispatch(notebookSessionRestored({ tab }))
  }, [dispatch])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.sessionStorage.setItem(
      CALENDAR_STRIP_TAB_SESSION_KEY,
      notebookStripTab,
    )
  }, [notebookStripTab])

  useEffect(() => {
    const prev = prevActiveSectionRef.current

    if (prev === 'history' && activeSection !== 'history') {
      const switchedToFactorySection =
        activeSection != null &&
        (SECTION_EDITOR_MENU_ICON_KEYS as readonly string[]).includes(
          activeSection,
        )

      if (!switchedToFactorySection) {
        dispatch(setHistoryListPanelOpen(false))
        dispatch(
          updateToolbarIcon({
            section: 'history',
            key: 'listHistory',
            value: 'enabled',
          }),
        )
      }
      const keepDayPanelForRightPie =
        switchedToFactorySection && activePieSide === 'right'
      if (!keepDayPanelForRightPie) {
        dispatch(closeDayPanel())
      }
    }

    prevActiveSectionRef.current = activeSection
  }, [activeSection, activePieSide, dispatch])

  useEffect(() => {
    if (
      prevCartListPanelOpen.current &&
      !listPanelOpen &&
      activePieSide === 'right'
    ) {
      setActivePieSide('left')
    }
    prevCartListPanelOpen.current = listPanelOpen
  }, [listPanelOpen, activePieSide])

  const cardPieListPanelOpen = useAppSelector(selectIsCardPieListPanelOpen)
  const historyListPanelOpen = useAppSelector(selectIsHistoryListPanelOpen)
  const prevHistoryListPanelOpen = useRef(historyListPanelOpen)
  const historyListSelectedLocalId = useAppSelector(
    selectHistoryListSelectedLocalId,
  )
  const historyOpenDayPanelArchiveLocalId = useAppSelector(
    selectHistoryOpenDayPanelArchiveLocalId,
  )
  const cartItems = useAppSelector(selectCartItems)

  useEffect(() => {
    if (
      prevHistoryListPanelOpen.current &&
      !historyListPanelOpen &&
      activePieSide === 'right'
    ) {
      setActivePieSide('left')
    }
    prevHistoryListPanelOpen.current = historyListPanelOpen
  }, [historyListPanelOpen, activePieSide])

  const rightListArchiveLocalId =
    rightListArchivePinnedForLeftFactory?.localId ??
    (listPanelOpen && listSelectedLocalId != null
      ? listSelectedLocalId
      : historyListPanelOpen && historyListSelectedLocalId != null
        ? historyListSelectedLocalId
        : historyOpenDayPanelArchiveLocalId != null
          ? historyOpenDayPanelArchiveLocalId
          : null)

  const rightListArchiveSource = useMemo((): 'cart' | 'history' | null => {
    if (rightListArchivePinnedForLeftFactory != null) {
      return rightListArchivePinnedForLeftFactory.source
    }
    if (listPanelOpen && listSelectedLocalId != null) {
      return 'cart'
    }
    if (notebookStripTab === 'cart' && listSelectedLocalId != null) {
      return 'cart'
    }
    if (historyListPanelOpen && historyListSelectedLocalId != null) {
      return 'history'
    }
    if (historyOpenDayPanelArchiveLocalId != null) {
      return 'history'
    }
    return null
  }, [
    rightListArchivePinnedForLeftFactory,
    notebookStripTab,
    listPanelOpen,
    listSelectedLocalId,
    historyOpenDayPanelArchiveLocalId,
    historyListPanelOpen,
    historyListSelectedLocalId,
  ])

  useEffect(() => {
    if (notebookStripTab === 'cart' || notebookStripTab === 'history') {
      setRightListArchivePinnedForLeftFactory(null)
    }
  }, [notebookStripTab])

  const rightListArchiveBundle = useAppSelector((state) =>
    rightListArchiveLocalId != null
      ? selectListArchiveCardPieBundle(
          state,
          String(rightListArchiveLocalId),
          rightListArchiveSource,
        )
      : null,
  )

  const rightArchivePiePostcardStatus = useMemo(() => {
    if (rightListArchiveLocalId == null) return undefined
    return cartItems.find((p) => p.localId === rightListArchiveLocalId)?.status
  }, [cartItems, rightListArchiveLocalId])

  /** История: открытки со статусом `cart` — тулбар корзины (edit / copy / delete). */
  const showRightPostcardPieCartToolbar =
    rightListArchiveSource === 'cart' ||
    (rightListArchiveSource === 'history' &&
      rightArchivePiePostcardStatus === 'cart')

  const canShowRightListArchiveCardPie =
    sectionSize != null && rightListArchiveLocalId != null

  useEffect(() => {
    if (!canShowRightListArchiveCardPie && activePieSide === 'right') {
      setSuppressCardPieEditActiveAfterCopy(true)
      setCardPieEditEngaged(false)
      setActivePieSide('left')
    }
  }, [canShowRightListArchiveCardPie, activePieSide])

  const listRowInner = rightListArchiveBundle?.currentData?.data ?? null

  const syncPeekChromeForOpenedSection = useCallback((section: CardSection) => {
    if (section === 'cardphoto') {
      setRightPieCardphotoPeekNoToolbar(true)
      setRightPieCardtextPeekNoToolbar(false)
      setRightPieEnvelopePeekNoToolbar(false)
      setRightPieAromaPeekNoToolbar(false)
      setRightPieDatePeekNoToolbar(false)
    } else if (section === 'cardtext') {
      setRightPieCardtextPeekNoToolbar(true)
      setRightPieCardphotoPeekNoToolbar(false)
      setRightPieEnvelopePeekNoToolbar(false)
      setRightPieAromaPeekNoToolbar(false)
      setRightPieDatePeekNoToolbar(false)
    } else if (section === 'envelope') {
      setRightPieEnvelopePeekNoToolbar(true)
      setRightPieCardphotoPeekNoToolbar(false)
      setRightPieCardtextPeekNoToolbar(false)
      setRightPieAromaPeekNoToolbar(false)
      setRightPieDatePeekNoToolbar(false)
    } else if (section === 'aroma') {
      setRightPieAromaPeekNoToolbar(true)
      setRightPieCardphotoPeekNoToolbar(false)
      setRightPieCardtextPeekNoToolbar(false)
      setRightPieEnvelopePeekNoToolbar(false)
      setRightPieDatePeekNoToolbar(false)
    } else if (section === 'date') {
      setRightPieDatePeekNoToolbar(true)
      setRightPieCardphotoPeekNoToolbar(false)
      setRightPieCardtextPeekNoToolbar(false)
      setRightPieEnvelopePeekNoToolbar(false)
      setRightPieAromaPeekNoToolbar(false)
    } else {
      setRightPieCardphotoPeekNoToolbar(false)
      setRightPieCardtextPeekNoToolbar(false)
      setRightPieEnvelopePeekNoToolbar(false)
      setRightPieAromaPeekNoToolbar(false)
      setRightPieDatePeekNoToolbar(false)
    }
  }, [])

  const handleRightListPieSectorClick = useCallback(
    (section: CardSection) => {
      dispatch(setActiveSection(section))
      const copyStripFullSpan =
        cardPieCopyStripExpanded && rightListArchiveLocalId != null
      const fullFactoryFromRightPie =
        activePieSide === 'right' &&
        !copyStripFullSpan &&
        cardPieEditEngaged
      if (
        fullFactoryFromRightPie &&
        section === 'envelope' &&
        rightListArchiveLocalId != null
      ) {
        dispatch(
          applyArchiveSectionToEditorRequested({
            section: 'envelope',
            sourceLocalId: rightListArchiveLocalId,
          }),
        )
      }
      if (fullFactoryFromRightPie) {
        setRightPieCardphotoPeekNoToolbar(false)
        setRightPieCardtextPeekNoToolbar(false)
        setRightPieEnvelopePeekNoToolbar(false)
        setRightPieAromaPeekNoToolbar(false)
        setRightPieDatePeekNoToolbar(false)
      } else {
        syncPeekChromeForOpenedSection(section)
      }
    },
    [
      dispatch,
      activePieSide,
      cardPieCopyStripExpanded,
      cardPieEditEngaged,
      rightListArchiveLocalId,
      syncPeekChromeForOpenedSection,
    ],
  )

  const handleRightPieCenterHistoryCalendarJump = useCallback(() => {
    const d = primaryDispatchDateFromPieInner(listRowInner)
    setRightPieCardphotoPeekNoToolbar(false)
    setRightPieCardtextPeekNoToolbar(false)
    setRightPieEnvelopePeekNoToolbar(false)
    setRightPieAromaPeekNoToolbar(false)
    setRightPieDatePeekNoToolbar(false)
    dispatch(setNotebookStripTab('history'))
    dispatch(setActiveSection('history'))
    if (d != null) {
      dispatch(updateLastViewedCalendarDate({ year: d.year, month: d.month }))
    }
  }, [dispatch, listRowInner])

  const handleRightPieCenterCartCalendarJump = useCallback(() => {
    const d = primaryDispatchDateFromPieInner(listRowInner)
    setRightPieCardphotoPeekNoToolbar(false)
    setRightPieCardtextPeekNoToolbar(false)
    setRightPieEnvelopePeekNoToolbar(false)
    setRightPieAromaPeekNoToolbar(false)
    setRightPieDatePeekNoToolbar(false)
    dispatch(setCartCalendarDatePickMode(false))
    dispatch(setCartListStatusSegment('cart'))
    dispatch(setNotebookStripTab('cart'))
    dispatch(setActiveSection('date'))
    if (d != null) {
      dispatch(updateLastViewedCalendarDate({ year: d.year, month: d.month }))
    }
  }, [dispatch, listRowInner])

  const rightPieOnCenterClick =
    notebookStripTab === 'history' && rightListArchiveSource === 'history'
      ? handleRightPieCenterHistoryCalendarJump
      : notebookStripTab === 'cart' && rightListArchiveSource === 'cart'
        ? handleRightPieCenterCartCalendarJump
        : undefined

  const exitRightPreviewForLeftMode = useCallback(() => {
    dispatch(setCartListSelectedLocalId(null))
    dispatch(setHistoryListSelectedLocalId(null))
    dispatch(closeDayPanel())
    setCardPieEditEngaged(false)
  }, [dispatch])

  const handleBeforeLeftPieInteraction = useCallback(() => {
    exitRightPreviewForLeftMode()
    setRightPieCardphotoPeekNoToolbar(false)
    setRightPieCardtextPeekNoToolbar(false)
    setRightPieEnvelopePeekNoToolbar(false)
    setRightPieAromaPeekNoToolbar(false)
    setRightPieDatePeekNoToolbar(false)
    if (activePieSide === 'right') {
      setSuppressCardPieEditActiveAfterCopy(true)
      setCardPieEditEngaged(false)
      setActivePieSide('left')
    }
  }, [activePieSide, exitRightPreviewForLeftMode])

  const handleLeftPieCenterClick = useCallback(() => {
    if (activePieSide === 'right') {
      setSuppressCardPieEditActiveAfterCopy(true)
      setCardPieEditEngaged(false)
      setActivePieSide('left')
    }
  }, [activePieSide])

  /**
   * sectionEditorMenu из правого режима (peek / cardPieCopy): левая фабрика + секция по клику.
   */
  const handleSectionEditorMenuClick = useCallback(() => {
    const inRightListArchiveMode =
      activePieSide === 'right' &&
      rightListArchiveLocalId != null &&
      (rightListArchiveSource === 'cart' || rightListArchiveSource === 'history')

    const exitingCardPieCopy = cardPieCopyStripExpanded
    const exitingRightPeek =
      !cardPieCopyStripExpanded && inRightListArchiveMode

    if (!exitingCardPieCopy && !exitingRightPeek) {
      return
    }

    const archiveSource = rightListArchiveSource
    const archiveLocalId = rightListArchiveLocalId

    if (
      archiveLocalId != null &&
      (archiveSource === 'cart' || archiveSource === 'history')
    ) {
      setRightListArchivePinnedForLeftFactory({
        localId: archiveLocalId,
        source: archiveSource,
      })
    }

    const stripToDisable: 'cart' | 'history' | null =
      archiveSource === 'cart' || archiveSource === 'history'
        ? archiveSource
        : computedNotebookStripTab === 'cart' ||
            computedNotebookStripTab === 'history'
          ? computedNotebookStripTab
          : notebookStripTab === 'cart' || notebookStripTab === 'history'
            ? notebookStripTab
            : null

    if (stripToDisable != null) {
      for (const action of buildDisableCartOrHistoryNotebookOnSectionMenuCopyExitCommands(
        stripToDisable,
      )) {
        dispatch(action)
      }
    }

    if (exitingCardPieCopy) {
      dispatch(setCardPieCopyStripExpanded(false))
    }

    setRightPieCardphotoPeekNoToolbar(false)
    setRightPieCardtextPeekNoToolbar(false)
    setRightPieEnvelopePeekNoToolbar(false)
    setRightPieAromaPeekNoToolbar(false)
    setRightPieDatePeekNoToolbar(false)
    setSuppressCardPieEditActiveAfterCopy(true)
    setCardPieEditEngaged(false)
    setActivePieSide('left')
  }, [
    activePieSide,
    cardPieCopyStripExpanded,
    computedNotebookStripTab,
    dispatch,
    notebookStripTab,
    rightListArchiveLocalId,
    rightListArchiveSource,
  ])

  const clearRightPieCardphotoPeek = useCallback(() => {
    setRightPieCardphotoPeekNoToolbar(false)
  }, [])

  const clearRightPieCardtextPeek = useCallback(() => {
    setRightPieCardtextPeekNoToolbar(false)
  }, [])

  const clearRightPieEnvelopePeek = useCallback(() => {
    setRightPieEnvelopePeekNoToolbar(false)
  }, [])

  const clearRightPieAromaPeek = useCallback(() => {
    setRightPieAromaPeekNoToolbar(false)
  }, [])

  const clearRightPieDatePeek = useCallback(() => {
    setRightPieDatePeekNoToolbar(false)
  }, [])

  useEffect(() => {
    if (activeSection !== 'cardphoto') {
      setRightPieCardphotoPeekNoToolbar(false)
    }
  }, [activeSection])

  useEffect(() => {
    if (activeSection !== 'cardtext') {
      setRightPieCardtextPeekNoToolbar(false)
    }
  }, [activeSection])

  useEffect(() => {
    if (activeSection !== 'envelope') {
      setRightPieEnvelopePeekNoToolbar(false)
    }
  }, [activeSection])

  useEffect(() => {
    if (activeSection !== 'aroma') {
      setRightPieAromaPeekNoToolbar(false)
    }
  }, [activeSection])

  useEffect(() => {
    if (activeSection !== 'date') {
      setRightPieDatePeekNoToolbar(false)
    }
  }, [activeSection])

  useEffect(() => {
    if (activePieSide === 'right' && cardPieEditEngaged) {
      setRightPieCardphotoPeekNoToolbar(false)
      setRightPieCardtextPeekNoToolbar(false)
      setRightPieEnvelopePeekNoToolbar(false)
      setRightPieAromaPeekNoToolbar(false)
      setRightPieDatePeekNoToolbar(false)
    }
  }, [activePieSide, cardPieEditEngaged])

  useEffect(() => {
    const localId = rightListArchiveLocalId
    const source = rightListArchiveSource
    const prev = prevListArchiveListContextRef.current

    const onlySelectedRowChangedInSameList =
      prev.source != null &&
      source != null &&
      prev.source === source &&
      localId != null &&
      prev.localId != null &&
      prev.localId !== localId

    prevListArchiveListContextRef.current = { localId, source }

    if (onlySelectedRowChangedInSameList) {
      return
    }

    setRightPieCardphotoPeekNoToolbar(false)
    setRightPieCardtextPeekNoToolbar(false)
    setRightPieEnvelopePeekNoToolbar(false)
    setRightPieAromaPeekNoToolbar(false)
    setRightPieDatePeekNoToolbar(false)
  }, [rightListArchiveLocalId, rightListArchiveSource])

  const showTopCardStripFullSpan =
    cardPieCopyStripExpanded && rightListArchiveLocalId != null

  const prevShowTopCardStripFullSpanRef = useRef(showTopCardStripFullSpan)
  useEffect(() => {
    const activeFactorySection =
      activeSection === 'cardphoto' ||
      activeSection === 'cardtext' ||
      activeSection === 'envelope' ||
      activeSection === 'aroma' ||
      activeSection === 'date'
        ? activeSection
        : null

    if (
      !prevShowTopCardStripFullSpanRef.current &&
      showTopCardStripFullSpan &&
      activeFactorySection != null
    ) {
      // When entering copy mode from a regular factory section view,
      // switch that section into simplified peek chrome.
      syncPeekChromeForOpenedSection(activeFactorySection)
    }
    if (prevShowTopCardStripFullSpanRef.current && !showTopCardStripFullSpan) {
      if (cardPieCopyClosedByEditRef.current) {
        cardPieCopyClosedByEditRef.current = false
        setSuppressCardPieEditActiveAfterCopy(false)
        setActivePieSide('right')
      } else {
        setRightPieCardphotoPeekNoToolbar(false)
        setRightPieCardtextPeekNoToolbar(false)
        setRightPieEnvelopePeekNoToolbar(false)
        setRightPieAromaPeekNoToolbar(false)
        setRightPieDatePeekNoToolbar(false)
        setSuppressCardPieEditActiveAfterCopy(true)
        setCardPieEditEngaged(false)
        setActivePieSide('left')
      }
    }
    prevShowTopCardStripFullSpanRef.current = showTopCardStripFullSpan
  }, [showTopCardStripFullSpan, activeSection, syncPeekChromeForOpenedSection])

  useEffect(() => {
    if (rightListArchiveLocalId == null) {
      setCardPieEditEngaged(false)
    }
  }, [rightListArchiveLocalId])

  useEffect(() => {
    if (!cartCalendarDatePickMode) {
      cartDatePickOwnedByCardPieEditRef.current = false
    }
  }, [cartCalendarDatePickMode])

  useEffect(() => {
    const shouldPickFromCardPieEdit =
      cardPieEditEngaged &&
      activePieSide === 'right' &&
      rightListArchiveLocalId != null &&
      activeSection === 'date' &&
      notebookStripTab === 'cart' &&
      rightListArchiveSource === 'cart'

    if (shouldPickFromCardPieEdit) {
      cartDatePickOwnedByCardPieEditRef.current = true
      dispatch(setCartCalendarDatePickMode(true))
      dispatch(setCartCalendarDatePickLocalId(rightListArchiveLocalId))
      return
    }

    if (cartDatePickOwnedByCardPieEditRef.current) {
      cartDatePickOwnedByCardPieEditRef.current = false
      dispatch(setCartCalendarDatePickMode(false))
    }
  }, [
    activePieSide,
    activeSection,
    cardPieEditEngaged,
    dispatch,
    notebookStripTab,
    rightListArchiveLocalId,
    rightListArchiveSource,
  ])

  const centerStripMirrorValue = useMemo(() => {
    const stripMirrorsRightListPostcard =
      activePieSide === 'right' || showTopCardStripFullSpan

    return {
      activePieSide,
      cardPieEditEngaged,
      centerStripListMirrorEnabled: stripMirrorsRightListPostcard,
      mirrorInner: stripMirrorsRightListPostcard
        ? (rightListArchiveBundle?.currentData?.data ?? null)
        : null,
      mirrorSectionFlags: stripMirrorsRightListPostcard
        ? (rightListArchiveBundle?.sections ?? null)
        : null,
      mirrorTargetLocalId: stripMirrorsRightListPostcard
        ? rightListArchiveLocalId
        : null,
      mirrorListArchiveSource: stripMirrorsRightListPostcard
        ? rightListArchiveSource
        : null,
      listRowInner,
      listRowLocalId: rightListArchiveLocalId,
      listRowPostcardStatus: rightArchivePiePostcardStatus,
      rightPieCardphotoPeekNoToolbar,
      clearRightPieCardphotoPeek,
      rightPieCardtextPeekNoToolbar,
      clearRightPieCardtextPeek,
      rightPieEnvelopePeekNoToolbar,
      clearRightPieEnvelopePeek,
      rightPieAromaPeekNoToolbar,
      clearRightPieAromaPeek,
      rightPieDatePeekNoToolbar,
      clearRightPieDatePeek,
    }
  }, [
    activePieSide,
    cardPieEditEngaged,
    showTopCardStripFullSpan,
    rightListArchiveBundle,
    rightListArchiveLocalId,
    rightListArchiveSource,
    listRowInner,
    rightArchivePiePostcardStatus,
    rightPieCardphotoPeekNoToolbar,
    clearRightPieCardphotoPeek,
    rightPieCardtextPeekNoToolbar,
    clearRightPieCardtextPeek,
    rightPieEnvelopePeekNoToolbar,
    clearRightPieEnvelopePeek,
    rightPieAromaPeekNoToolbar,
    clearRightPieAromaPeek,
    rightPieDatePeekNoToolbar,
    clearRightPieDatePeek,
  ])

  const mergeLeft = false
  const mergeRight = false

  useEffect(() => {
    if (rightListArchiveLocalId == null) {
      dispatch(setCardPieCopyStripExpanded(false))
    }
  }, [rightListArchiveLocalId, dispatch])
  const handleCartListSelectEntry = useCallback(
    (item: CartListPanelItem) => {
      dispatch(setNotebookStripTab('cart'))
      dispatch(setActiveSection('date'))
      if (item.sourceDate) {
        dispatch(
          updateLastViewedCalendarDate({
            year: item.sourceDate.year,
            month: item.sourceDate.month,
          }),
        )
      }
      const lid = item.postcard?.localId
      if (lid == null) return
      const nextLid = listSelectedLocalId === lid ? null : lid
      if (
        nextLid == null ||
        nextLid !== cartCalendarDatePickLocalId
      ) {
        dispatch(setCartCalendarDatePickMode(false))
      }
      dispatch(setCartListSelectedLocalId(nextLid))
      if (nextLid == null) {
        setCardPieEditEngaged(false)
        setActivePieSide('left')
        dispatch(closeDayPanel())
        return
      }
      setCardPieEditEngaged(false)
      setSuppressCardPieEditActiveAfterCopy(true)
      setActivePieSide('right')
      applyRightListArchiveToolbarVisuals(dispatch, store.getState, 'cart')
      if (item.sourceDate) {
        const dateKey = `${item.sourceDate.year}-${item.sourceDate.month}-${item.sourceDate.day}`
        const dayData = cardsByDateMap[dateKey]
        if (dayData != null && calendarDayHasCards(dayData)) {
          dispatch(openDayPanel({ dateKey, dayData }))
        }
      }
    },
    [dispatch, cartCalendarDatePickLocalId, listSelectedLocalId, cardsByDateMap],
  )

  const handleHistoryListSelectEntry = useCallback(
    (item: HistoryListPanelItem) => {
      dispatch(setNotebookStripTab('history'))
      dispatch(setActiveSection('history'))
      if (item.sourceDate) {
        dispatch(
          updateLastViewedCalendarDate({
            year: item.sourceDate.year,
            month: item.sourceDate.month,
          }),
        )
      }
      const lid = item.postcardLocalId
      if (lid == null) return
      const nextLid = historyListSelectedLocalId === lid ? null : lid
      dispatch(setHistoryListSelectedLocalId(nextLid))
      if (nextLid == null) {
        setCardPieEditEngaged(false)
        setActivePieSide('left')
        return
      }
      setCardPieEditEngaged(false)
      setSuppressCardPieEditActiveAfterCopy(true)
      setActivePieSide('right')
      applyRightListArchiveToolbarVisuals(dispatch, store.getState, 'history')
    },
    [dispatch, historyListSelectedLocalId],
  )

  const handleCartListDateEditEntry = useCallback(
    (item: CartListPanelItem) => {
      dispatch(setNotebookStripTab('cart'))
      dispatch(setActiveSection('date'))
      const lid = item.postcard?.localId
      if (lid == null) return
      dispatch(setCartListSelectedLocalId(lid))
      setCardPieEditEngaged(false)
      if (item.sourceDate) {
        dispatch(
          updateLastViewedCalendarDate({
            year: item.sourceDate.year,
            month: item.sourceDate.month,
          }),
        )
        const dateKey = `${item.sourceDate.year}-${item.sourceDate.month}-${item.sourceDate.day}`
        const dayData = cardsByDateMap[dateKey]
        if (dayData != null && calendarDayHasCards(dayData)) {
          dispatch(openDayPanel({ dateKey, dayData }))
        }
      }
    },
    [dispatch, activePieSide, cardsByDateMap],
  )

  const handlePostcardPieCartToolbarAction = useCallback(
    (key: string) => {
      if (key === 'cardPieEdit') {
        if (cardPieCopyStripExpanded) {
          cardPieCopyClosedByEditRef.current = true
          dispatch(setCardPieCopyStripExpanded(false))
          setSuppressCardPieEditActiveAfterCopy(false)
          setCardPieEditEngaged(true)
          setActivePieSide('right')
          setRightPieCardphotoPeekNoToolbar(false)
          setRightPieCardtextPeekNoToolbar(false)
          setRightPieEnvelopePeekNoToolbar(false)
          setRightPieAromaPeekNoToolbar(false)
          setRightPieDatePeekNoToolbar(false)
          return
        }
        if (activePieSide === 'right') {
          if (cardPieEditEngaged) {
            setCardPieEditEngaged(false)
            if (cartDatePickOwnedByCardPieEditRef.current) {
              cartDatePickOwnedByCardPieEditRef.current = false
              dispatch(setCartCalendarDatePickMode(false))
            }
            if (
              rightListArchiveLocalId != null &&
              activeSection != null &&
              (SECTION_EDITOR_MENU_ICON_KEYS as readonly string[]).includes(
                activeSection,
              )
            ) {
              syncPeekChromeForOpenedSection(activeSection)
            }
            return
          }
          setSuppressCardPieEditActiveAfterCopy(false)
          setCardPieEditEngaged(true)
          setRightPieCardphotoPeekNoToolbar(false)
          setRightPieCardtextPeekNoToolbar(false)
          setRightPieEnvelopePeekNoToolbar(false)
          setRightPieAromaPeekNoToolbar(false)
          setRightPieDatePeekNoToolbar(false)
          return
        }
        setSuppressCardPieEditActiveAfterCopy(false)
        setActivePieSide('right')
        setCardPieEditEngaged(true)
        setRightPieCardphotoPeekNoToolbar(false)
        setRightPieCardtextPeekNoToolbar(false)
        setRightPieEnvelopePeekNoToolbar(false)
        setRightPieAromaPeekNoToolbar(false)
        setRightPieDatePeekNoToolbar(false)
        return
      }
      if (key === 'cardPieCopy') {
        dispatch(setCardPieCopyStripExpanded(!cardPieCopyStripExpanded))
      }
    },
    [dispatch, cardPieCopyStripExpanded, activePieSide, cardPieEditEngaged, activeSection, rightListArchiveLocalId, syncPeekChromeForOpenedSection],
  )
  const handleEditorPieToolbarAction = useCallback((key: string) => {
    if (key !== 'cardPieEdit' && key !== 'cardPie') return
  }, [])
  const handlePanelMiniSectionsToolbarAction = useCallback((key: string) => {
    if (key !== 'cardPieEdit') return
    setSuppressCardPieEditActiveAfterCopy(false)
    setCardPieEditEngaged(true)
    setActivePieSide('right')
    setRightPieCardphotoPeekNoToolbar(false)
    setRightPieCardtextPeekNoToolbar(false)
    setRightPieEnvelopePeekNoToolbar(false)
    setRightPieAromaPeekNoToolbar(false)
    setRightPieDatePeekNoToolbar(false)
  }, [])
  const postcardPieCartToolbarStateOverride = useMemo(
    () =>
      ({
        cardPieEdit:
          rightListArchiveLocalId != null &&
          !showTopCardStripFullSpan &&
          activePieSide === 'right' &&
          cardPieEditEngaged &&
          !suppressCardPieEditActiveAfterCopy
            ? ('active' as const)
            : ('enabled' as const),
        ...(showTopCardStripFullSpan ? { cardPieCopy: 'active' as const } : {}),
      }) satisfies Record<string, string>,
    [
      activePieSide,
      cardPieEditEngaged,
      rightListArchiveLocalId,
      showTopCardStripFullSpan,
      suppressCardPieEditActiveAfterCopy,
    ],
  )

  if (!authInitialized) {
    return <div className={styles.authBoot} aria-busy="true" />
  }

  const suppressSectionMenuActiveHighlight =
    activePieSide === 'right' &&
    !cardPieEditEngaged &&
    rightListArchiveLocalId != null

  const hideMobileSectionToolbar =
    rightPieCardphotoPeekNoToolbar ||
    rightPieCardtextPeekNoToolbar ||
    rightPieEnvelopePeekNoToolbar ||
    rightPieAromaPeekNoToolbar ||
    rightPieDatePeekNoToolbar

  if (isMobileLayout) {
    return (
      <MobileAppShell
        formRef={formRef}
        sizeCard={sizeCard}
        onAppClick={handleAppClick}
        pinActiveTab={
          activePieSide === 'right' &&
          rightListArchiveLocalId != null &&
          rightListArchiveSource != null
            ? rightListArchiveSource
            : null
        }
        activePieSide={activePieSide}
        showTopCardStripFullSpan={showTopCardStripFullSpan}
        onBeforeLeftPieInteraction={handleBeforeLeftPieInteraction}
        onLeftPieCenterClick={handleLeftPieCenterClick}
        hideSectionToolbar={hideMobileSectionToolbar}
        listPanelOpen={listPanelOpen}
        cardPieListPanelOpen={cardPieListPanelOpen}
        onEditorPieToolbarAction={handleEditorPieToolbarAction}
        onCartListSelectEntry={handleCartListSelectEntry}
        onCartListDateEditEntry={handleCartListDateEditEntry}
        onHistoryListSelectEntry={handleHistoryListSelectEntry}
      />
    )
  }

  return (
    <div ref={appRef} className={styles.app} onClick={handleAppClick}>
      <MarkStampYearDevProvider>
        <div className={styles.appSubstrate}>
        <div className={styles.appControlStrip}>
          <div className={styles.appSidebar}>
            <SectionEditorSidebar
              onSectionEditorMenuAction={handleSectionEditorMenuClick}
              suppressSectionMenuActiveHighlight={
                suppressSectionMenuActiveHighlight
              }
            />
          </div>
          <main
            ref={mainRef}
            className={styles.appMain}
            style={
              sizeCard?.width != null
                ? ({
                    '--card-width': `${sizeCard.width}px`,
                  } as React.CSSProperties)
                : undefined
            }
          >
            <div
              className={clsx(
                styles.appMainTopRowBackdrop,
                showTopCardStripFullSpan && styles.appMainTopRowBackdropActive,
              )}
              aria-hidden
            />
            <EditorPieListCardPieBadgeSync />
            <DateToolbarListDateBadgeSync />
            <RightSidebarHistoryBadgeSync />
            <CalendarModeToolbarBadgesSync />
            {/* <div className={styles.appMainContentLeft}> */}
            <div
              className={clsx(
                styles.appMainContentLeftPieSlot,
                mergeLeft && styles.appMainContentLeftPieSlot_mergedWithCenter,
                showTopCardStripFullSpan &&
                  styles.appMainContentLeftPieSlot_copyLocked,
                activePieSide === 'left'
                  ? styles.appMainContentLeftPieSlot_active
                  : styles.appMainContentLeftPieSlot_inactive,
              )}
            >
              {mergeLeft ? (
                <div
                  ref={mergedTopChromeRef}
                  className={clsx(
                    styles.mergedTopChrome,
                    mergeLeft && styles.mergedTopChrome_measuredToForm,
                  )}
                >
                  <div className={styles.mergedTopChromePieRegion}>
                    <div className={styles.appMainContentLeftPieRow}>
                      <div
                        ref={leftPieWrapRef}
                        className={styles.appMainContentLeftPieWrap}
                      >
                        <CardPie
                          isProcessed
                          fillContainer
                          station="left"
                          onBeforeLeftPieSectorClick={
                            handleBeforeLeftPieInteraction
                          }
                          onLeftPieCenterClick={handleLeftPieCenterClick}
                          leftPieCenterClickable={
                            activePieSide === 'right' &&
                            !showTopCardStripFullSpan
                          }
                        />
                      </div>
                      <div className={styles.appMainContentLeftPieToolbar}>
                        <Toolbar
                          section="editorPie"
                          onActionClick={handleEditorPieToolbarAction}
                          mergedWithCenter={
                            activePieSide === 'left' || showTopCardStripFullSpan
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles.mergedTopChromeMini}>
                    <MiniSectionsSlot
                      ref={cardPanelRef}
                      embedded
                      cardPieCopyStripActive={showTopCardStripFullSpan}
                      onBeforeOpenMiniSection={exitRightPreviewForLeftMode}
                      onPanelMiniSectionsToolbarAction={
                        handlePanelMiniSectionsToolbarAction
                      }
                      onActivateSectionPeekNoToolbar={
                        syncPeekChromeForOpenedSection
                      }
                    />
                  </div>
                </div>
              ) : (
                sectionSize != null && (
                  <div
                    className={clsx(
                      styles.mergedTopChrome,
                      styles.mergedTopChrome_transparentBorder,
                    )}
                  >
                    <div className={styles.mergedTopChromePieRegion}>
                      <div className={styles.appMainContentLeftPieRow}>
                        <div
                          ref={leftPieWrapRef}
                          className={styles.appMainContentLeftPieWrap}
                        >
                          <CardPie
                            isProcessed
                            fillContainer
                            station="left"
                            onBeforeLeftPieSectorClick={
                              handleBeforeLeftPieInteraction
                            }
                            onLeftPieCenterClick={handleLeftPieCenterClick}
                            leftPieCenterClickable={
                              activePieSide === 'right' &&
                              !showTopCardStripFullSpan
                            }
                          />
                        </div>
                        <div className={styles.appMainContentLeftPieToolbar}>
                          <Toolbar
                            section="editorPie"
                            onActionClick={handleEditorPieToolbarAction}
                            mergedWithCenter={
                              activePieSide === 'left' ||
                              showTopCardStripFullSpan
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
            {/* </div> */}
            <div
              className={clsx(
                styles.appMainContentLeft,
                // activeSection === 'date' && styles.appMainContentRightDate,
              )}
            >
              {activeSection === 'envelope' && <EnvelopeRightSlot />}
              {activeSection === 'date' && <DateRightSlot />}
              {activeSection === 'cardtext' && <CardtextRightSlot />}
              {activeSection === 'cardphoto' && <CardphotoRightSlot />}
              {cardPieListPanelOpen && <CardPieLeftSlot />}
            </div>
            <RightListArchiveMiniProvider value={centerStripMirrorValue}>
              <div className={styles.rightListArchiveMiniSubtree}>
                <div className={styles.appMainTopCenterPanel}>
                  <div className={clsx(styles.mainCardPanel)}>
                    <div
                      className={clsx(
                        styles.mainCardPanelEntryLeft,
                        activePieSide === 'left'
                          ? styles.mainCardPanelEntryLeft_active
                          : styles.mainCardPanelEntryLeft_inactive,
                      )}
                    ></div>
                    <MiniSectionsSlot
                      ref={cardPanelRef}
                      rightModeActive={activePieSide === 'right'}
                      cardPieCopyStripActive={showTopCardStripFullSpan}
                      onBeforeOpenMiniSection={exitRightPreviewForLeftMode}
                      onPanelMiniSectionsToolbarAction={
                        handlePanelMiniSectionsToolbarAction
                      }
                      onActivateSectionPeekNoToolbar={
                        syncPeekChromeForOpenedSection
                      }
                    />
                    <div
                      className={clsx(
                        styles.mainCardPanelEntryRight,
                        activePieSide === 'right'
                          ? styles.mainCardPanelEntryRight_active
                          : styles.mainCardPanelEntryRight_inactive,
                      )}
                    ></div>
                  </div>
                </div>
                <div className={clsx(styles.appMainContentCenter)}>
                  <div className={styles.mainCardSectionToolbar}>
                    {!rightPieCardphotoPeekNoToolbar &&
                    !rightPieCardtextPeekNoToolbar &&
                    !rightPieEnvelopePeekNoToolbar &&
                    !rightPieAromaPeekNoToolbar &&
                    !rightPieDatePeekNoToolbar ? (
                      <CardSectionToolbar />
                    ) : null}
                  </div>
                  <div ref={formRef} className={clsx(styles.mainForm)}>
                    <CardSectionEditor />
                  </div>
                </div>
              </div>
            </RightListArchiveMiniProvider>
            <div
              className={clsx(
                styles.appMainContentRightPieSlot,
                mergeRight &&
                  styles.appMainContentRightPieSlot_mergedWithCenter,
                activePieSide === 'right'
                  ? styles.appMainContentRightPieSlot_active
                  : styles.appMainContentRightPieSlot_inactive,
              )}
            >
              {mergeRight ? (
                <div
                  ref={mergedTopChromeRef}
                  className={clsx(
                    styles.mergedTopChrome,
                    mergeRight && styles.mergedTopChrome_measuredToFormRight,
                  )}
                >
                  <div className={styles.mergedTopChromeMini}>
                    <MiniSectionsSlot
                      ref={cardPanelRef}
                      embedded
                      cardPieCopyStripActive={showTopCardStripFullSpan}
                      onActivateSectionPeekNoToolbar={
                        syncPeekChromeForOpenedSection
                      }
                    />
                  </div>
                  {sectionSize != null && rightListArchiveLocalId != null && (
                    <div className={styles.mergedTopChromePieRegion}>
                      <div className={styles.appMainContentRightPieRow}>
                        <div className={styles.appMainContentRightPieWrap}>
                          <CardPie
                            isProcessed={false}
                            status={rightArchivePiePostcardStatus}
                            id={String(rightListArchiveLocalId)}
                            fillContainer
                            station="right"
                            rightListSource={rightListArchiveSource}
                            onListArchiveSectorClick={
                              handleRightListPieSectorClick
                            }
                            onRightPieCenterClick={rightPieOnCenterClick}
                          />
                        </div>
                        {showRightPostcardPieCartToolbar && (
                          <div className={styles.appMainContentRightPieToolbar}>
                            <Toolbar
                              section="postcardPieCart"
                              onActionClick={handlePostcardPieCartToolbarAction}
                              stateOverride={
                                postcardPieCartToolbarStateOverride
                              }
                              mergedWithCenter={
                                activePieSide === 'right' ||
                                showTopCardStripFullSpan
                              }
                            />
                          </div>
                        )}
                        {rightListArchiveSource === 'history' &&
                          !showRightPostcardPieCartToolbar && (
                          <div className={styles.appMainContentRightPieToolbar}>
                            <Toolbar section="postcardPieHistory" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className={clsx(
                    styles.mergedTopChrome,
                    styles.mergedTopChrome_transparentBorder,
                    activePieSide === 'left' &&
                      styles.mergedTopChrome_rightBorderBlue,
                  )}
                >
                  <div className={styles.mergedTopChromePieRegion}>
                    <div className={styles.appMainContentRightPieRow}>
                      {sectionSize != null &&
                        rightListArchiveLocalId != null && (
                          <>
                            <div className={styles.appMainContentRightPieWrap}>
                              <CardPie
                                isProcessed={false}
                                status={rightArchivePiePostcardStatus}
                                id={String(rightListArchiveLocalId)}
                                fillContainer
                                station="right"
                                rightListSource={rightListArchiveSource}
                                onListArchiveSectorClick={
                                  handleRightListPieSectorClick
                                }
                                onRightPieCenterClick={rightPieOnCenterClick}
                              />
                            </div>
                            {showRightPostcardPieCartToolbar && (
                              <div
                                className={styles.appMainContentRightPieToolbar}
                              >
                                <Toolbar
                                  section="postcardPieCart"
                                  onActionClick={
                                    handlePostcardPieCartToolbarAction
                                  }
                                  stateOverride={
                                    postcardPieCartToolbarStateOverride
                                  }
                                  mergedWithCenter={
                                    activePieSide === 'right' ||
                                    showTopCardStripFullSpan
                                  }
                                />
                              </div>
                            )}
                            {rightListArchiveSource === 'history' &&
                              !showRightPostcardPieCartToolbar && (
                              <div
                                className={styles.appMainContentRightPieToolbar}
                              >
                                <Toolbar section="postcardPieHistory" />
                              </div>
                            )}
                          </>
                        )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div
              className={clsx(
                styles.appMainContentRight,
                // activeSection === 'date' && styles.appMainContentRightDate,
              )}
            >
              {/* {activeSection === 'envelope' && <EnvelopeRightSlot />} */}
              {listPanelOpen && (
                <CartListPanel
                  onSelectEntry={handleCartListSelectEntry}
                  onDateEditEntry={handleCartListDateEditEntry}
                />
              )}
              <HistoryListRightSlot onSelectEntry={handleHistoryListSelectEntry} />
              {/* {activeSection === 'cardtext' && <CardtextRightSlot />} */}
              {/* {activeSection === 'cardphoto' && <CardphotoRightSlot />} */}
            </div>
            <div className={styles.appMainContentRightUserPanelSlot}>
              <UserLoginRightSlot />
            </div>
          </main>
          <div
            className={clsx(
              styles.appRightSidebar,
              styles.appRightSidebarWithDevStamp,
            )}
          >
            <SectionEditorRightSidebar
              pinActiveTab={
                activePieSide === 'right' &&
                rightListArchiveLocalId != null &&
                rightListArchiveSource != null
                  ? rightListArchiveSource
                  : null
              }
            />
            <MarkStampYearDevButtons />
          </div>
        </div>
        </div>
      </MarkStampYearDevProvider>
    </div>
  )
}

export default App
