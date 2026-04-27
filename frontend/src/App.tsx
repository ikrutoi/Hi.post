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
type CardPanelPieMergeMode = 'none' | 'left' | 'right'

const App = () => {
  const appRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const cardPanelRef = useRef<HTMLDivElement>(null)
  const mergedTopChromeRef = useRef<HTMLDivElement>(null)
  const [mergedTopChromeWidthPx, setMergedTopChromeWidthPx] = useState<
    number | null
  >(null)
  const [colorToolbar, setColorToolbar] = useState<boolean | null>(null)
  const [cardPanelPieMergeMode] = useState<CardPanelPieMergeMode>('left')

  useAuthInit()
  useLayoutInit()
  useViewportInit()
  useRecordSizeCard(formRef, cardPanelRef)
  const { sizeCard } = useSizeFacade()
  const sectionSize =
    sizeCard?.width != null && sizeCard.width > 0 ? sizeCard.width / 6 : null

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

  const mergePie = cardPanelPieMergeMode
  const mergeLeft = mergePie === 'left'
  const mergeRight = mergePie === 'right'
  const centerMergedWithPie = mergeLeft || mergeRight
  const showRightPieArchive =
    sectionSize != null && rightListArchiveLocalId != null

  const syncMergedTopChromeToForm = useCallback(() => {
    if (!mergeLeft) return
    const form = formRef.current
    const chrome = mergedTopChromeRef.current
    if (!form || !chrome) return
    const base =
      form.getBoundingClientRect().right - chrome.getBoundingClientRect().left
    // `width` is border-box; inner flex ends before outer right by padding + border on that side,
    // so the mini strip sits inset — extend outer width so inner right lines up with the form.
    const cs = getComputedStyle(chrome)
    const padRight = parseFloat(cs.paddingRight) || 0
    const borderRight = parseFloat(cs.borderRightWidth) || 0
    const w = base + padRight + borderRight
    if (w > 0 && Number.isFinite(w)) {
      setMergedTopChromeWidthPx(Math.round(w))
    }
  }, [mergeLeft])

  useLayoutEffect(() => {
    if (!mergeLeft) {
      setMergedTopChromeWidthPx(null)
      return
    }
    syncMergedTopChromeToForm()
    const ro = new ResizeObserver(() => {
      syncMergedTopChromeToForm()
    })
    const form = formRef.current
    const chrome = mergedTopChromeRef.current
    const main = mainRef.current
    if (form) ro.observe(form)
    if (chrome) ro.observe(chrome)
    if (main) ro.observe(main)
    window.addEventListener('resize', syncMergedTopChromeToForm)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', syncMergedTopChromeToForm)
    }
  }, [mergeLeft, syncMergedTopChromeToForm, sizeCard?.width])

  const handleCartListSelectEntry = useCallback(
    (item: CartListPanelItem) => {
      const lid = item.postcard?.localId
      if (lid == null) return
      setCartListSelectedLocalId(listSelectedLocalId === lid ? null : lid)
    },
    [listSelectedLocalId, setCartListSelectedLocalId],
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
                    mergedTopChromeWidthPx != null &&
                      styles.mergedTopChrome_measuredToForm,
                  )}
                  style={
                    mergedTopChromeWidthPx != null
                      ? { width: mergedTopChromeWidthPx }
                      : undefined
                  }
                >
                  <div className={styles.mergedTopChromePieRegion}>
                    <div className={styles.mergedTopChromePie}>
                      <div className={styles.appMainContentLeftPieRow}>
                        <div className={styles.appMainContentLeftPieWrap}>
                          <CardPie isProcessed fillContainer station="left" />
                        </div>
                        <div className={styles.appMainContentLeftPieToolbar}>
                          <Toolbar section="editorPie" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.mergedTopChromeMini}>
                    <MiniSectionsSlot ref={cardPanelRef} embedded />
                  </div>
                </div>
              ) : (
                sectionSize != null && (
                  <div className={styles.appMainContentLeftPieRow}>
                    <div className={styles.appMainContentLeftPieWrap}>
                      <CardPie isProcessed fillContainer station="left" />
                    </div>
                    <div className={styles.appMainContentLeftPieToolbar}>
                      <Toolbar section="editorPie" />
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
                <div className={styles.mergedTopChrome}>
                  <div className={styles.mergedTopChromeMini}>
                    <MiniSectionsSlot ref={cardPanelRef} embedded />
                  </div>
                  {showRightPieArchive && (
                    <div className={styles.mergedTopChromePie}>
                      <div className={styles.appMainContentRightPieRow}>
                        <div className={styles.appMainContentRightPieWrap}>
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
                            <Toolbar section="postcardPieCart" />
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
                showRightPieArchive && (
                  <div className={styles.appMainContentRightPieRow}>
                    <div className={styles.appMainContentRightPieWrap}>
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
                        <Toolbar section="postcardPieCart" />
                      </div>
                    )}
                    {rightListArchiveSource === 'history' && (
                      <div className={styles.appMainContentRightPieToolbar}>
                        <Toolbar section="postcardPieHistory" />
                      </div>
                    )}
                  </div>
                )
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
