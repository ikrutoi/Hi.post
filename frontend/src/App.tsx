import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  selectHistoryListSelectedLocalId,
  selectHistoryOpenDayPanelArchiveLocalId,
  selectIsCardPieListPanelOpen,
  selectIsHistoryListPanelOpen,
} from '@date/calendar/infrastructure/selectors'
import { Header } from './features/header/presentation/Header'
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
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { SectionEditorSidebar } from '@features/cardSectionEditor/presentation/SectionEditorSidebar/SectionEditorSidebar'
import { SectionEditorRightSidebar } from '@features/cardSectionEditor/presentation/SectionEditorRightSidebar/SectionEditorRightSidebar'
import { useAuthInit } from '@features/auth/application/hooks/useAuthInit'
import {
  useLayoutInit,
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
import { setCardPieCopyStripExpanded } from '@cart/infrastructure/state'
import { EnvelopeRightSlot } from '@envelope/presentation/EnvelopeRightSlot'
import { DateRightSlot } from '@date/presentation/DateRightSlot'
import { HistoryListRightSlot } from '@date/presentation/HistoryListRightSlot'
import { CardtextRightSlot } from '@cardtext/presentation/CardtextRightSlot'
import { CardphotoRightSlot } from '@cardphoto/presentation/CardphotoRightSlot'
import { selectListArchiveCardPieBundle } from '@features/cardPie/infrastructure/selectors/cardPieSelectors'
import { RightListArchiveMiniProvider } from '@cardPanel/presentation/RightListArchiveMiniContext'
import {
  closeDayPanel,
  setHistoryListPanelOpen,
} from '@date/calendar/infrastructure/state'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import { SECTION_EDITOR_MENU_ICON_KEYS } from '@features/toolbar/domain/types/sectionEditorMenu.types'
import styles from './App.module.scss'

/** Merges the mini-sections strip with the left or right CardPie under one chrome frame. */
const App = () => {
  const appRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const cardPanelRef = useRef<HTMLDivElement>(null)
  const mergedTopChromeRef = useRef<HTMLDivElement>(null)
  const leftPieWrapRef = useRef<HTMLDivElement>(null)
  const [colorToolbar, setColorToolbar] = useState<boolean | null>(null)
  const [activePieSide, setActivePieSide] = useState<'left' | 'right'>('left')
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

  const cardPieCopyStripExpanded = useAppSelector(selectCardPieCopyStripExpanded)

  useAuthInit()
  useLayoutInit()
  useViewportInit()
  useRecordSizeCard(formRef, cardPanelRef)
  const { sizeCard } = useSizeFacade()
  const sectionSize =
    sizeCard?.width != null && sizeCard.width > 0 ? sizeCard.width / 6 : null

  const dispatch = useAppDispatch()
  const handleAppClick = useToolbarClickReset(colorToolbar, setColorToolbar)
  const { activeSection } = useSectionMenuFacade()
  const prevActiveSectionRef = useRef(activeSection)
  const { listPanelOpen, listSelectedLocalId, setCartListSelectedLocalId } =
    useCartFacade()
  const prevCartListPanelOpen = useRef(listPanelOpen)
  const prevListArchiveListContextRef = useRef<{
    localId: number | null
    source: 'cart' | 'history' | null
  }>({ localId: null, source: null })

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
      dispatch(closeDayPanel())
    }

    prevActiveSectionRef.current = activeSection
  }, [activeSection, dispatch])

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
  const historyListSelectedLocalId = useAppSelector(
    selectHistoryListSelectedLocalId,
  )
  const historyOpenDayPanelArchiveLocalId = useAppSelector(
    selectHistoryOpenDayPanelArchiveLocalId,
  )
  const cartItems = useAppSelector(selectCartItems)

  const rightListArchiveLocalId =
    listPanelOpen && listSelectedLocalId != null
      ? listSelectedLocalId
      : historyOpenDayPanelArchiveLocalId != null
        ? historyOpenDayPanelArchiveLocalId
        : historyListPanelOpen && historyListSelectedLocalId != null
          ? historyListSelectedLocalId
          : null

  const rightListArchiveSource = useMemo((): 'cart' | 'history' | null => {
    if (listPanelOpen && listSelectedLocalId != null) {
      return 'cart'
    }
    if (historyOpenDayPanelArchiveLocalId != null) {
      return 'history'
    }
    if (historyListPanelOpen && historyListSelectedLocalId != null) {
      return 'history'
    }
    return null
  }, [
    listPanelOpen,
    listSelectedLocalId,
    historyOpenDayPanelArchiveLocalId,
    historyListPanelOpen,
    historyListSelectedLocalId,
  ])

  const rightListArchiveBundle = useAppSelector((state) =>
    rightListArchiveLocalId != null
      ? selectListArchiveCardPieBundle(
          state,
          String(rightListArchiveLocalId),
          rightListArchiveSource,
        )
      : null,
  )

  const listRowInner = rightListArchiveBundle?.currentData?.data ?? null

  const handleRightListPieSectorClick = useCallback(
    (section: CardSection) => {
      dispatch(setActiveSection(section))
      const peekFromListPie =
        activePieSide === 'left' || activePieSide === 'right'
      if (peekFromListPie && section === 'cardphoto') {
        setRightPieCardphotoPeekNoToolbar(true)
        setRightPieCardtextPeekNoToolbar(false)
        setRightPieEnvelopePeekNoToolbar(false)
        setRightPieAromaPeekNoToolbar(false)
        setRightPieDatePeekNoToolbar(false)
      } else if (peekFromListPie && section === 'cardtext') {
        setRightPieCardtextPeekNoToolbar(true)
        setRightPieCardphotoPeekNoToolbar(false)
        setRightPieEnvelopePeekNoToolbar(false)
        setRightPieAromaPeekNoToolbar(false)
        setRightPieDatePeekNoToolbar(false)
      } else if (peekFromListPie && section === 'envelope') {
        setRightPieEnvelopePeekNoToolbar(true)
        setRightPieCardphotoPeekNoToolbar(false)
        setRightPieCardtextPeekNoToolbar(false)
        setRightPieAromaPeekNoToolbar(false)
        setRightPieDatePeekNoToolbar(false)
      } else if (peekFromListPie && section === 'aroma') {
        setRightPieAromaPeekNoToolbar(true)
        setRightPieCardphotoPeekNoToolbar(false)
        setRightPieCardtextPeekNoToolbar(false)
        setRightPieEnvelopePeekNoToolbar(false)
        setRightPieDatePeekNoToolbar(false)
      } else if (peekFromListPie && section === 'date') {
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
    },
    [activePieSide, dispatch],
  )

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
    if (activePieSide === 'right') {
      setRightPieCardphotoPeekNoToolbar(false)
      setRightPieCardtextPeekNoToolbar(false)
      setRightPieEnvelopePeekNoToolbar(false)
      setRightPieAromaPeekNoToolbar(false)
      setRightPieDatePeekNoToolbar(false)
    }
  }, [activePieSide])

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

  /** Без ожидания `sectionSize`: до первого layout `sizeCard.width` ещё 0, иначе зеркало мини-секций (в т.ч. cardtext) не включается при первом cardPieCopy. */
  const showTopCardStripFullSpan =
    cardPieCopyStripExpanded && rightListArchiveLocalId != null

  const centerStripMirrorValue = useMemo(() => {
    /** Центральная полоса мини-секций показывает данные строки правого списка: активный правый пирог или режим cardPieCopy (общая подложка верхнего ряда). */
    const stripMirrorsRightListPostcard =
      activePieSide === 'right' || showTopCardStripFullSpan

    return {
      activePieSide,
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
      listRowInner,
      listRowLocalId: rightListArchiveLocalId,
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
      showTopCardStripFullSpan,
      rightListArchiveBundle,
      rightListArchiveLocalId,
      listRowInner,
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
      const lid = item.postcard?.localId
      if (lid == null) return
      setCartListSelectedLocalId(listSelectedLocalId === lid ? null : lid)
    },
    [listSelectedLocalId, setCartListSelectedLocalId],
  )

  const handlePostcardPieCartToolbarAction = useCallback(
    (key: string) => {
      if (key === 'cardPieEdit') {
        setActivePieSide((prev) => (prev === 'left' ? 'right' : 'left'))
        return
      }
      if (key === 'cardPieCopy') {
        dispatch(setCardPieCopyStripExpanded(!cardPieCopyStripExpanded))
      }
    },
    [dispatch, cardPieCopyStripExpanded],
  )
  const handleEditorPieToolbarAction = useCallback((key: string) => {
    if (key !== 'cardPieEdit' && key !== 'cardPie') return
  }, [])
  const postcardPieCartToolbarStateOverride = useMemo(
    () =>
      ({
        cardPieEdit: 'enabled' as const,
        ...(showTopCardStripFullSpan
          ? { cardPieCopy: 'active' as const }
          : {}),
      }) satisfies Record<string, string>,
    [showTopCardStripFullSpan],
  )

  return (
    <div ref={appRef} className={styles.app} onClick={handleAppClick}>
      <div className={styles.appSubstrate}>
        <div className={styles.appControlStrip}>
          <div className={styles.appHeader}>
            <Header />
          </div>
          <div className={styles.appSidebar}>
            <SectionEditorSidebar />
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
            {showTopCardStripFullSpan && (
              <div className={styles.appMainTopRowBackdrop} aria-hidden />
            )}
            <EditorPieListCardPieBadgeSync />
            <DateToolbarListDateBadgeSync />
            {/* <div className={styles.appMainContentLeft}> */}
            <div
              className={clsx(
                styles.appMainContentLeftPieSlot,
                mergeLeft && styles.appMainContentLeftPieSlot_mergedWithCenter,
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
                          onBeforeLeftPieSectorClick={() => {
                            setRightPieCardphotoPeekNoToolbar(false)
                            setRightPieCardtextPeekNoToolbar(false)
                            setRightPieEnvelopePeekNoToolbar(false)
                            setRightPieAromaPeekNoToolbar(false)
                            setRightPieDatePeekNoToolbar(false)
                          }}
                        />
                      </div>
                      <div className={styles.appMainContentLeftPieToolbar}>
                        <Toolbar
                          section="editorPie"
                          onActionClick={handleEditorPieToolbarAction}
                          mergedWithCenter={activePieSide === 'left'}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles.mergedTopChromeMini}>
                    <MiniSectionsSlot
                      ref={cardPanelRef}
                      embedded
                      cardPieCopyStripActive={showTopCardStripFullSpan}
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
                            onBeforeLeftPieSectorClick={() => {
                              setRightPieCardphotoPeekNoToolbar(false)
                              setRightPieCardtextPeekNoToolbar(false)
                              setRightPieEnvelopePeekNoToolbar(false)
                              setRightPieAromaPeekNoToolbar(false)
                              setRightPieDatePeekNoToolbar(false)
                            }}
                          />
                        </div>
                        <div className={styles.appMainContentLeftPieToolbar}>
                          <Toolbar
                            section="editorPie"
                            onActionClick={handleEditorPieToolbarAction}
                            mergedWithCenter={activePieSide === 'left'}
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
                    />
                  </div>
                  {sectionSize != null && rightListArchiveLocalId != null && (
                    <div className={styles.mergedTopChromePieRegion}>
                      <div className={styles.appMainContentRightPieRow}>
                        <div className={styles.appMainContentRightPieWrap}>
                          <CardPie
                            isProcessed={false}
                            status="cart"
                            id={String(rightListArchiveLocalId)}
                            fillContainer
                            station="right"
                            rightListSource={rightListArchiveSource}
                            onListArchiveSectorClick={
                              handleRightListPieSectorClick
                            }
                          />
                        </div>
                        {rightListArchiveSource === 'cart' && (
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
                        {rightListArchiveSource === 'history' && (
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
                                status="cart"
                                id={String(rightListArchiveLocalId)}
                                fillContainer
                                station="right"
                                rightListSource={rightListArchiveSource}
                                onListArchiveSectorClick={
                                  handleRightListPieSectorClick
                                }
                              />
                            </div>
                            {rightListArchiveSource === 'cart' && (
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
                            {rightListArchiveSource === 'history' && (
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
                <CartListPanel onSelectEntry={handleCartListSelectEntry} />
              )}
              <HistoryListRightSlot />
              {/* {activeSection === 'cardtext' && <CardtextRightSlot />} */}
              {/* {activeSection === 'cardphoto' && <CardphotoRightSlot />} */}
            </div>
          </main>
          <div className={styles.appRightSidebar}>
            <SectionEditorRightSidebar />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
