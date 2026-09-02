import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import clsx from 'clsx'
import { CardPie } from '@features/cardPie/presentation/CardPie'
import { isPostcardPieAllComplete } from '@features/cardPie/infrastructure/postcardCardPieViewModel'
import {
  buildEmptyGutterPlanPie,
  type MobilePlanCardPie,
} from './useMobilePlanCardPies'
import styles from './MobileAppShell.module.scss'

/** 3×1rem insets + 1rem scroll gutter — matches desktop grid padding/gap. */
const DESKTOP_MINI_INSET_REM = 1
const DESKTOP_MINI_SCROLL_GUTTER_REM = 1
const DESKTOP_MINI_COLUMNS = 3

type MobileCardPieGutterMinisProps = {
  layout?: 'mobile' | 'desktop'
  planPies: MobilePlanCardPie[]
  selectedPlanPieId: string | null
  /**
   * Accent control for gutter minis:
   * - omit / `undefined` → use `selectedPlanPieId`
   * - `null` → no accent (archive / right central pie)
   * - id → accent that mini only
   */
  highlightPlanPieId?: string | null
  /** Multi-date factory strip: accent every mini pie. */
  highlightAllPlanPies?: boolean
  onSelectPlanPie: (id: string) => void
}

export const MobileCardPieGutterMinis: React.FC<MobileCardPieGutterMinisProps> =
  ({
    layout = 'mobile',
    planPies,
    selectedPlanPieId,
    highlightPlanPieId,
    highlightAllPlanPies = false,
    onSelectPlanPie,
  }) => {
    /** `null` must not fall through to `selectedPlanPieId` (archive mode clears accent). */
    const accentPlanPieId =
      highlightPlanPieId !== undefined ? highlightPlanPieId : selectedPlanPieId

    const listRef = useRef<HTMLDivElement | null>(null)
    const trackRef = useRef<HTMLDivElement | null>(null)
    const [thumbHeight, setThumbHeight] = useState(0)
    const [thumbTop, setThumbTop] = useState(0)
    const [desktopMiniSize, setDesktopMiniSize] = useState(0)

    const displayPies = useMemo(
      () => (planPies.length > 0 ? planPies : [buildEmptyGutterPlanPie()]),
      [planPies],
    )

    const updateDesktopMiniSize = useCallback(() => {
      const list = listRef.current
      if (list == null || layout !== 'desktop') return
      const rem =
        parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
      const insets =
        DESKTOP_MINI_INSET_REM * rem * DESKTOP_MINI_COLUMNS +
        DESKTOP_MINI_SCROLL_GUTTER_REM * rem
      setDesktopMiniSize(
        Math.max(0, (list.clientWidth - insets) / DESKTOP_MINI_COLUMNS),
      )
    }, [layout])

    const updateThumb = useCallback(() => {
      const list = listRef.current
      const track = trackRef.current
      if (list == null || track == null) return

      const { scrollHeight, clientHeight, scrollTop } = list
      if (scrollHeight <= clientHeight || clientHeight === 0) {
        setThumbHeight(0)
        setThumbTop(0)
        return
      }

      const trackHeight = track.clientHeight
      if (trackHeight === 0) {
        setThumbHeight(0)
        setThumbTop(0)
        return
      }

      const height = Math.max(12, (clientHeight / scrollHeight) * trackHeight)
      const maxTop = trackHeight - height
      const top =
        maxTop <= 0
          ? 0
          : (scrollTop / (scrollHeight - clientHeight)) * maxTop

      setThumbHeight(height)
      setThumbTop(top)
    }, [])

    useLayoutEffect(() => {
      updateThumb()
      updateDesktopMiniSize()
    }, [updateThumb, updateDesktopMiniSize, displayPies])

    useEffect(() => {
      const list = listRef.current
      if (list == null) return

      const onScroll = () => {
        updateThumb()
      }
      list.addEventListener('scroll', onScroll, { passive: true })

      const onResize = () => {
        updateThumb()
        updateDesktopMiniSize()
      }
      window.addEventListener('resize', onResize)

      const resizeObserver =
        typeof ResizeObserver !== 'undefined'
          ? new ResizeObserver(() => {
              updateThumb()
              updateDesktopMiniSize()
            })
          : null
      resizeObserver?.observe(list)

      return () => {
        list.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onResize)
        resizeObserver?.disconnect()
      }
    }, [updateThumb, updateDesktopMiniSize])

    const showThumb = thumbHeight > 0

    return (
        <div
          className={clsx(
            styles.mobilePieGutterMiniShell,
            layout === 'desktop' && styles.mobilePieGutterMiniShellDesktop,
          )}
        style={
          layout === 'desktop' && desktopMiniSize > 0
            ? ({
                '--desktop-left-mini-pie-size': `${desktopMiniSize}px`,
              } as React.CSSProperties)
            : undefined
        }
        aria-label="Card pie plan"
      >
        <div ref={listRef} className={styles.mobilePieGutterMiniList}>
          {displayPies.map(({ id, inner, sections }) => (
            <button
              key={id}
              type="button"
              className={styles.mobilePieGutterMiniItem}
              data-selected={
                highlightAllPlanPies ||
                (accentPlanPieId != null && accentPlanPieId === id)
                  ? 'true'
                  : undefined
              }
              data-ready={
                isPostcardPieAllComplete(sections) ? 'true' : undefined
              }
              aria-pressed={selectedPlanPieId === id}
              aria-label="Open plan CardPie"
              onClick={(event) => {
                event.stopPropagation()
                onSelectPlanPie(id)
              }}
            >
              <CardPie
                fillContainer
                station="left"
                leftPieCenterDisc
                hideEmptySectorPlaceholders
                sectorsInteractive={false}
                pieInner={inner}
                pieSections={sections}
              />
            </button>
          ))}
        </div>
        <div
          ref={trackRef}
          className={clsx(
            styles.mobilePieGutterMiniScrollTrack,
            !showThumb && styles.mobilePieGutterMiniScrollTrackHidden,
          )}
          aria-hidden
        >
          <div
            className={styles.mobilePieGutterMiniScrollThumb}
            style={{
              height: thumbHeight,
              transform: `translateY(${thumbTop}px)`,
            }}
          />
        </div>
      </div>
    )
  }
