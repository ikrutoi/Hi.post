import React, { useRef } from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { getToolbarIcon } from '@shared/utils/icons'
import { useRemSize } from '@shared/helpers'
import { capitalize } from '@shared/utils/helpers'
import { useMiniCardRender } from '../application/hooks'
import { useSectionMenuFacade } from '@entities/sectionEditorMenu/application/facades'
import styles from './MiniCard.module.scss'
import type { CardSection } from '@shared/config/constants'
import type { SizeCard } from '@layout/domain/types'
import { useCardEditorFacade } from '@/entities/cardEditor/application/facades'
import { selectHasEnvelopeAppliedContent } from '@envelope/infrastructure/selectors'
import { selectMergedDispatchDates } from '@date/infrastructure/selectors'
import {
  setCardPieListPanelOpen,
  setNotebookStripDateOverCart,
  setNotebookStripTab,
} from '@date/calendar/infrastructure/state'
import { selectNotebookStripTab } from '@date/calendar/infrastructure/selectors'
import { selectCardtextMiniPreviewHasRenderableContent } from '@cardtext/infrastructure/selectors'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'

interface MiniCardProps {
  section: CardSection
  sizeMiniCard: SizeCard
  zIndex: number
  position: number
  isPacked: boolean
  isEmpty?: boolean
  /** When true, do not render the section clear (×) control. */
  hideClearButton?: boolean
  /** Кнопка в том же углу, что и × (напр. apply при cardPieCopy) — рендерится внутри `.miniCard`. */
  mirrorApplyCorner?: React.ReactNode
  peekToolbarOnMiniOpen?: boolean
  onActivateSectionPeekNoToolbar?: (section: CardSection) => void
  onBeforeOpenSection?: () => void
}

export const MiniCard: React.FC<MiniCardProps> = ({
  section,
  sizeMiniCard,
  zIndex,
  position,
  isPacked,
  isEmpty = false,
  hideClearButton = false,
  mirrorApplyCorner = null,
  peekToolbarOnMiniOpen = false,
  onActivateSectionPeekNoToolbar,
  onBeforeOpenSection,
}) => {
  const dispatch = useAppDispatch()
  const remSize = useRemSize()
  const miniCardRef = useRef<HTMLDivElement>(null)
  const {
    centerStripListMirrorEnabled,
    clearRightPieCardphotoPeek,
    clearRightPieCardtextPeek,
    clearRightPieEnvelopePeek,
    clearRightPieAromaPeek,
    clearRightPieDatePeek,
  } = useRightListArchiveMini()

  const { changeSection } = useSectionMenuFacade()
  const { editorState, removeSection } = useCardEditorFacade()
  const hasEnvelopeApplied = useAppSelector(selectHasEnvelopeAppliedContent)
  const mergedDispatchDates = useAppSelector(selectMergedDispatchDates)
  const cardtextMiniRenderable = useAppSelector(
    selectCardtextMiniPreviewHasRenderableContent,
  )
  const notebookStripTab = useAppSelector(selectNotebookStripTab)

  const { render } = useMiniCardRender()

  const showClearButton =
    !hideClearButton &&
    !centerStripListMirrorEnabled &&
    !!editorState
      ? section === 'envelope'
        ? hasEnvelopeApplied
        : section === 'date'
          ? mergedDispatchDates.length > 0
          : section === 'cardtext'
            ? cardtextMiniRenderable ||
              (editorState as { cardtext?: { isComplete?: boolean } }).cardtext
                ?.isComplete === true
            : (editorState as Record<string, { isComplete?: boolean }>)[
                section
              ]?.isComplete === true
      : false

  return (
    <div
      ref={miniCardRef}
      className={clsx(
        styles.miniCard,
        styles[`miniCard${capitalize(section)}`],
        isEmpty && styles.miniCardEmpty,
      )}
      style={{
        left: isPacked
          ? '0'
          : `${remSize + (sizeMiniCard.height + remSize) * position}px`,
        top: isPacked ? 0 : undefined,
        width: `${sizeMiniCard.height}px`,
        height: `${sizeMiniCard.height}px`,
        zIndex,
        transition: `left ${0.3 + 0.15 * position}s ease, box-shadow 0.3s`,
      }}
      onClick={() => {
        onBeforeOpenSection?.()
        if (section === 'cardphoto') {
          clearRightPieCardphotoPeek()
        }
        if (section === 'cardtext') {
          clearRightPieCardtextPeek()
        }
        if (section === 'envelope') {
          clearRightPieEnvelopePeek()
        }
        if (section === 'aroma') {
          clearRightPieAromaPeek()
        }
        if (section === 'date') {
          clearRightPieDatePeek()
          dispatch(setCardPieListPanelOpen(true))
        }
        /**
         * Полоса «Корзина» + открытый список: без `notebookStripDateOverCart` сага синхронизации
         * (`computeNotebookStripTabFromState`) сразу вернёт закладку «Корзина» после `setActiveSection`.
         */
        if (notebookStripTab === 'cart') {
          dispatch(setNotebookStripDateOverCart(true))
          dispatch(setNotebookStripTab('date'))
        }
        changeSection(section)
        if (peekToolbarOnMiniOpen && onActivateSectionPeekNoToolbar != null) {
          onActivateSectionPeekNoToolbar(section)
        }
      }}
    >
      {isEmpty && (
        <div className={styles.miniCardIconBg}>
          {getToolbarIcon({ key: section as any })}
        </div>
      )}
      {render({
        section,
      })}

      {mirrorApplyCorner}

      {showClearButton && (
        <button
          type="button"
          className={styles.miniCardCornerButton}
          aria-label={`Clear ${section}`}
          onClick={(e) => {
            e.stopPropagation()
            removeSection(section)
          }}
        >
          {getToolbarIcon({ key: 'clearInput' })}
        </button>
      )}

      {/* <button
        className={clsx(styles.previewButton, styles.previewButtonDelete)}
        onClick={(e) => {
          e.stopPropagation()
          // removeCropId(cropId)
        }}
      >
        {getToolbarIcon({ key: 'deleteSmall' })}
      </button> */}
    </div>
  )
}
