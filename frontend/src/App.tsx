import React, { useCallback, useLayoutEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { useAppSelector } from '@app/hooks'
import {
  selectHistoryListSelectedLocalId,
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
import { useCartFacade } from './features/cart/application/facades/useCartFacade'
import { EnvelopeRightSlot } from '@envelope/presentation/EnvelopeRightSlot'
import { DateRightSlot } from '@date/presentation/DateRightSlot'
import { HistoryListRightSlot } from '@date/presentation/HistoryListRightSlot'
import { CardtextRightSlot } from '@cardtext/presentation/CardtextRightSlot'
import { CardphotoRightSlot } from '@cardphoto/presentation/CardphotoRightSlot'
import styles from './App.module.scss'

/** Merges the mini-sections strip with the left or right CardPie under one chrome frame. */
const App = () => {
  const appRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const cardPanelRef = useRef<HTMLDivElement>(null)
  const mergedTopChromeRef = useRef<HTMLDivElement>(null)
  const leftPieWrapRef = useRef<HTMLDivElement>(null)
  const [leftPieSizePx, setLeftPieSizePx] = useState<number | null>(null)
  const [colorToolbar, setColorToolbar] = useState<boolean | null>(null)
  const [mergedPieSide, setMergedPieSide] = useState<'left' | 'right'>('left')

  useAuthInit()
  useLayoutInit()
  useViewportInit()
  useRecordSizeCard(formRef, cardPanelRef)
  const { sizeCard, remSize } = useSizeFacade()
  const sectionSize =
    sizeCard?.width != null && sizeCard.width > 0 ? sizeCard.width / 6 : null
  const pieHeightInsetPx = (remSize || 16) * 0.5
  const rightPieSizePx =
    leftPieSizePx != null
      ? Math.max(leftPieSizePx - pieHeightInsetPx, 0)
      : null

  const handleAppClick = useToolbarClickReset(colorToolbar, setColorToolbar)
  const { activeSection } = useSectionMenuFacade()
  const {
    listPanelOpen,
    listSelectedLocalId,
    setCartListSelectedLocalId,
  } = useCartFacade()
  const cardPieListPanelOpen = useAppSelector(selectIsCardPieListPanelOpen)
  const historyListPanelOpen = useAppSelector(selectIsHistoryListPanelOpen)
  const historyListSelectedLocalId = useAppSelector(
    selectHistoryListSelectedLocalId,
  )

  const rightListArchiveLocalId =
    listPanelOpen && listSelectedLocalId != null
      ? listSelectedLocalId
      : historyListPanelOpen && historyListSelectedLocalId != null
        ? historyListSelectedLocalId
        : null

  const rightListArchiveSource =
    listPanelOpen && listSelectedLocalId != null
      ? ('cart' as const)
      : historyListPanelOpen && historyListSelectedLocalId != null
        ? ('history' as const)
        : null

  const mergeLeft = mergedPieSide === 'left'
  const mergeRight = mergedPieSide === 'right'
  const centerMergedWithPie = mergeLeft || mergeRight
  const showRightPieArchive =
    sectionSize != null && rightListArchiveLocalId != null

  useLayoutEffect(() => {
    const leftPieWrap = leftPieWrapRef.current
    if (!leftPieWrap) return

    const syncLeftPieSize = () => {
      const rect = leftPieWrap.getBoundingClientRect()
      const measured = Math.round(Math.min(rect.width, rect.height))
      if (measured > 0 && Number.isFinite(measured)) {
        setLeftPieSizePx(measured)
      }
    }

    syncLeftPieSize()
    const ro = new ResizeObserver(syncLeftPieSize)
    ro.observe(leftPieWrap)
    window.addEventListener('resize', syncLeftPieSize)

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', syncLeftPieSize)
    }
  }, [mergeLeft, sizeCard?.width])

  const handleCartListSelectEntry = useCallback(
    (item: CartListPanelItem) => {
      const lid = item.postcard?.localId
      if (lid == null) return
      setCartListSelectedLocalId(listSelectedLocalId === lid ? null : lid)
    },
    [listSelectedLocalId, setCartListSelectedLocalId],
  )

  const handlePostcardPieCartToolbarAction = useCallback((key: string) => {
    if (key !== 'cardPieEdit') return
    setMergedPieSide((prev) => (prev === 'left' ? 'right' : 'left'))
  }, [])
  const handleEditorPieToolbarAction = useCallback((key: string) => {
    if (key !== 'cardPieEdit' && key !== 'cardPie') return
    setMergedPieSide((prev) => (prev === 'left' ? 'right' : 'left'))
  }, [])
  const postcardPieCartToolbarStateOverride = { cardPieEdit: 'enabled' as const }

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
            <EditorPieListCardPieBadgeSync />
            <DateToolbarListDateBadgeSync />
            {/* <div className={styles.appMainContentLeft}> */}
            <div
              className={clsx(
                styles.appMainContentLeftPieSlot,
                mergeLeft && styles.appMainContentLeftPieSlot_mergedWithCenter,
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
                        <CardPie isProcessed fillContainer station="left" />
                      </div>
                      <div className={styles.appMainContentLeftPieToolbar}>
                        <Toolbar
                          section="editorPie"
                          onActionClick={handleEditorPieToolbarAction}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles.mergedTopChromeMini}>
                    <MiniSectionsSlot ref={cardPanelRef} embedded />
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
                          <CardPie isProcessed fillContainer station="left" />
                        </div>
                        <div className={styles.appMainContentLeftPieToolbar}>
                          <Toolbar
                            section="editorPie"
                            onActionClick={handleEditorPieToolbarAction}
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
            <div
              className={clsx(
                styles.appMainContentCenter,
                centerMergedWithPie && styles.appMainContentCenter_mergedWithPie,
              )}
            >
              {!centerMergedWithPie && (
                <div className={clsx(styles.mainCardPanel)}>
                  <MiniSectionsSlot ref={cardPanelRef} />
                </div>
              )}
              <div className={styles.mainCardSectionToolbar}>
                <CardSectionToolbar />
              </div>
              <div ref={formRef} className={clsx(styles.mainForm)}>
                <CardSectionEditor />
              </div>
            </div>
            <div
              className={clsx(
                styles.appMainContentRightPieSlot,
                mergeRight && styles.appMainContentRightPieSlot_mergedWithCenter,
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
                  <div
                    className={styles.mergedTopChromeMini}
                  >
                    <MiniSectionsSlot ref={cardPanelRef} embedded />
                  </div>
                  {showRightPieArchive && (
                    <div className={styles.mergedTopChromePieRegion}>
                      <div className={styles.appMainContentRightPieRow}>
                        <div
                          className={styles.appMainContentRightPieWrap}
                          style={
                            rightPieSizePx != null
                              ? {
                                  width: `${rightPieSizePx}px`,
                                  height: `${rightPieSizePx}px`,
                                  aspectRatio: 'auto',
                                }
                              : undefined
                          }
                        >
                          <CardPie
                            isProcessed={false}
                            status="cart"
                            id={String(rightListArchiveLocalId)}
                            fillContainer
                            station="right"
                            rightListSource={rightListArchiveSource}
                          />
                        </div>
                        {rightListArchiveSource === 'cart' && (
                          <div className={styles.appMainContentRightPieToolbar}>
                            <Toolbar
                              section="postcardPieCart"
                              onActionClick={handlePostcardPieCartToolbarAction}
                              stateOverride={postcardPieCartToolbarStateOverride}
                              mergedWithCenter={centerMergedWithPie}
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
                      {showRightPieArchive && (
                        <>
                          <div
                            className={styles.appMainContentRightPieWrap}
                            style={
                              rightPieSizePx != null
                                ? {
                                    width: `${rightPieSizePx}px`,
                                    height: `${rightPieSizePx}px`,
                                    aspectRatio: 'auto',
                                  }
                                : undefined
                            }
                          >
                            <CardPie
                              isProcessed={false}
                              status="cart"
                              id={String(rightListArchiveLocalId)}
                              fillContainer
                              station="right"
                              rightListSource={rightListArchiveSource}
                            />
                          </div>
                          {rightListArchiveSource === 'cart' && (
                            <div className={styles.appMainContentRightPieToolbar}>
                              <Toolbar
                                section="postcardPieCart"
                                onActionClick={handlePostcardPieCartToolbarAction}
                                stateOverride={postcardPieCartToolbarStateOverride}
                                mergedWithCenter={centerMergedWithPie}
                              />
                            </div>
                          )}
                          {rightListArchiveSource === 'history' && (
                            <div className={styles.appMainContentRightPieToolbar}>
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
