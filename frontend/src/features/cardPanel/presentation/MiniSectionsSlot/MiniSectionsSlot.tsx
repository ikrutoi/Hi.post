import clsx from 'clsx'
import React, { forwardRef } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useRemSize } from '@shared/helpers'
import { useSizeFacade } from '@layout/application/facades'
import { useCardEditorFacade } from '@entities/cardEditor/application/facades'
import { useCardPanelFacade } from '../../application/facades'
import { CARD_PANEL_SECTIONS_PRIORITY } from '../../domain/types'
import type { CardPanelSection } from '../../domain/types'
import { MiniCard } from '../../MiniCard/presentation/MiniCard'
import miniCardStyles from '../../MiniCard/presentation/MiniCard.module.scss'
import styles from './MiniSectionsSlot.module.scss'
import { selectHasEnvelopeAppliedContent } from '@envelope/infrastructure/selectors'
import { selectCardphotoIsComplete } from '@cardphoto/infrastructure/selectors'
import { selectMergedDispatchDates } from '@date/infrastructure/selectors'
import { cardtextHasRenderableContent } from '@cardtext/domain/editor/editor.types'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { applyArchiveSectionToEditorRequested } from '@cardPanel/infrastructure/state'
import { getToolbarIcon } from '@shared/utils/icons'
import type {
  CardPieInnerData,
  CardPieSectionFlags,
} from '@features/cardPie/infrastructure/postcardCardPieViewModel'

const PARTS_TOTAL = 6
const GAP_PARTS = 1

const SECTIONS_ORDER: CardPanelSection[] = [
  'cardphoto',
  'cardtext',
  'envelope',
  'aroma',
  'date',
]

export type MiniSectionsSlotProps = {
  /** When true, outer chrome is omitted — parent supplies one frame (e.g. merged with CardPie). */
  embedded?: boolean
  rightModeActive?: boolean
  /**
   * Режим верхней полосы cardPieCopy: скрыть × на мини-секциях и показать круглые «применить».
   */
  cardPieCopyStripActive?: boolean
}

function canApplyMirrorSection(
  section: CardPanelSection,
  mirrorInner: CardPieInnerData | null,
  mirrorSectionFlags: CardPieSectionFlags | null,
): boolean {
  if (!mirrorInner || !mirrorSectionFlags) return false
  if (section === 'cardtext') {
    return cardtextHasRenderableContent(mirrorInner.cardtext)
  }
  return Boolean(mirrorSectionFlags[section])
}

export const MiniSectionsSlot = forwardRef<HTMLDivElement, MiniSectionsSlotProps>(
  function MiniSectionsSlot(
    {
      embedded = false,
      rightModeActive = false,
      cardPieCopyStripActive = false,
    },
    ref,
  ) {
    const dispatch = useAppDispatch()
    const remSize = useRemSize()
    const { sizeCard } = useSizeFacade()
    const { editorState } = useCardEditorFacade()
    const { state: stateCardPanel } = useCardPanelFacade()
    const isPacked = stateCardPanel.isPacked
    const hasEnvelopeApplied = useAppSelector(selectHasEnvelopeAppliedContent)
    const cardphotoIsComplete = useAppSelector(selectCardphotoIsComplete)
    const mergedDispatchDates = useAppSelector(selectMergedDispatchDates)
    const {
      centerStripListMirrorEnabled,
      mirrorSectionFlags,
      mirrorInner,
      mirrorTargetLocalId,
    } = useRightListArchiveMini()

    const showMirrorApplyButtons =
      cardPieCopyStripActive &&
      mirrorTargetLocalId != null &&
      centerStripListMirrorEnabled

    const measuredCardWidth =
      sizeCard?.width != null && sizeCard.width > 0 ? sizeCard.width : null
    /** Пока `sizeCard` ещё 0 до ResizeObserver, даём ширину полосы мини-секций (иначе при первом cardPieCopy ряд не монтируется). */
    const totalWidth =
      measuredCardWidth ??
      (cardPieCopyStripActive && centerStripListMirrorEnabled
        ? Math.round(remSize * 22)
        : null)
    const sectionSize = totalWidth != null ? totalWidth / PARTS_TOTAL : null
    const gapSize =
      totalWidth != null ? (totalWidth * GAP_PARTS) / PARTS_TOTAL / 6 : null
    const sizeMiniCard =
      sectionSize != null
        ? {
            width: sectionSize,
            height: sectionSize,
            aspectRatio: 1,
            orientation: 'landscape' as const,
          }
        : null

    /** Данные строки правого списка в мини-секциях: достаточно флага контекста (правый пирог или cardPieCopy ряд). */
    const mirrorMinisFromRightPie =
      centerStripListMirrorEnabled && mirrorSectionFlags != null

    return (
      <div
        ref={ref}
        className={clsx(
          embedded ? styles.rootEmbedded : styles.root,
          !embedded && rightModeActive && styles.rootRightMode,
        )}
        style={{
          width:
            totalWidth != null ? `min(100%, ${totalWidth}px)` : '100%',
          minWidth: sizeCard?.width === 0 ? '8rem' : undefined,
        }}
      >
        {sectionSize != null && gapSize != null && sizeMiniCard != null && (
          <div
            className={styles.strip}
            style={{
              paddingLeft: `${gapSize}px`,
              paddingRight: `${gapSize}px`,
              gap: `${gapSize}px`,
            }}
          >
            {SECTIONS_ORDER.map((section, i) => {
              const { index } = CARD_PANEL_SECTIONS_PRIORITY[section]
              const isSectionComplete =
                section === 'cardphoto'
                  ? cardphotoIsComplete
                  : section === 'cardtext'
                    ? editorState.cardtext?.isComplete
                    : editorState[section]?.isComplete
              const isEmpty = mirrorMinisFromRightPie
                ? section === 'cardtext'
                  ? !cardtextHasRenderableContent(mirrorInner?.cardtext)
                  : !Boolean(mirrorSectionFlags?.[section])
                : centerStripListMirrorEnabled && mirrorSectionFlags == null
                  ? true
                  : section === 'date'
                    ? mergedDispatchDates.length === 0
                    : section === 'envelope'
                      ? !isSectionComplete && !hasEnvelopeApplied
                      : !isSectionComplete
              return (
                <div
                  key={section}
                  className={styles.cell}
                  style={{
                    width: `${sectionSize}px`,
                    height: `${sectionSize}px`,
                  }}
                >
                  <MiniCard
                    section={section}
                    sizeMiniCard={sizeMiniCard}
                    zIndex={index}
                    position={0}
                    isPacked={true}
                    isEmpty={isEmpty}
                    hideClearButton={cardPieCopyStripActive}
                    mirrorApplyCorner={
                      showMirrorApplyButtons ? (
                        <button
                          type="button"
                          className={miniCardStyles.miniCardCornerButton}
                          disabled={
                            !canApplyMirrorSection(
                              section,
                              mirrorInner,
                              mirrorSectionFlags,
                            )
                          }
                          aria-label={`Перенести «${section}» из выбранной открытки`}
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation()
                            if (mirrorTargetLocalId == null) return
                            dispatch(
                              applyArchiveSectionToEditorRequested({
                                section,
                                sourceLocalId: mirrorTargetLocalId,
                              }),
                            )
                          }}
                        >
                          {getToolbarIcon({ key: 'applyLight' })}
                        </button>
                      ) : null
                    }
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  },
)
