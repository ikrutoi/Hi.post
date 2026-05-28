import clsx from 'clsx'
import React, { forwardRef, useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useRemSize } from '@shared/helpers'
import { useSizeFacade } from '@layout/application/facades'
import { useCardEditorFacade } from '@entities/cardEditor/application/facades'
import {
  areAllEligibleMirrorSectionsApplied,
  canApplyMirrorSection,
  isMirrorSectionAppliedToEditor,
} from '@cardPanel/application/helpers/mirrorSectionEditorSync'
import { useCardPanelFacade } from '../../application/facades'
import { CARD_PANEL_SECTIONS_PRIORITY } from '../../domain/types'
import type { CardPanelSection } from '../../domain/types'
import { MiniCard } from '../../MiniCard/presentation/MiniCard'
import miniCardStyles from '../../MiniCard/presentation/MiniCard.module.scss'
import styles from './MiniSectionsSlot.module.scss'
import { MiniStripCellSideProvider } from './MiniStripCellSideContext'
import { selectHasEnvelopeAppliedContent } from '@envelope/infrastructure/selectors'
import { selectCardphotoIsComplete } from '@cardphoto/infrastructure/selectors'
import { selectMergedDispatchDates } from '@date/infrastructure/selectors'
import { selectCardphotoAppliedData } from '@cardphoto/infrastructure/selectors'
import { selectSelectedAroma } from '@aroma/infrastructure/selectors'
import { selectSelectedDates } from '@date/infrastructure/selectors'
import {
  selectCardtextMiniPreviewHasRenderableContent,
  selectCardtextState,
} from '@cardtext/infrastructure/selectors'
import {
  selectAppliedRecipientDisplayAddress,
} from '@envelope/recipient/infrastructure/selectors'
import { selectAppliedSenderDisplayAddress } from '@envelope/sender/infrastructure/selectors'
import { selectCartItems } from '@cart/infrastructure/selectors'
// cspell:ignore Renderable
import { cardtextHasRenderableContent } from '@cardtext/domain/editor/editor.types'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import {
  applyArchiveSectionToEditorRequested,
  applyAllMirrorSectionsCopyRequested,
  revertAllMirrorSectionsCopyRequested,
  revertMirrorSectionCopyRequested,
} from '@cardPanel/infrastructure/state'
import { IconApplyMedium, IconApplyMediumCheck } from '@shared/ui/icons'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { setCardPieCopyStripExpanded } from '@cart/infrastructure/state'
import type { CardSection, IconKey } from '@shared/config/constants'

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
  embedded?: boolean
  rightModeActive?: boolean
  cardPieCopyStripActive?: boolean
  onPanelMiniSectionsToolbarAction?: (key: IconKey) => void
  /** CardPie Copy: open section with peek chrome (no `CardSectionToolbar`), same as list pie sectors. */
  onActivateSectionPeekNoToolbar?: (section: CardSection) => void
  onBeforeOpenMiniSection?: () => void
}

export const MiniSectionsSlot = forwardRef<
  HTMLDivElement,
  MiniSectionsSlotProps
>(function MiniSectionsSlot(
  {
    embedded = false,
    rightModeActive = false,
    cardPieCopyStripActive = false,
    onPanelMiniSectionsToolbarAction,
    onActivateSectionPeekNoToolbar,
    onBeforeOpenMiniSection,
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
  const cardphotoAppliedData = useAppSelector(selectCardphotoAppliedData)
  const selectedAroma = useAppSelector(selectSelectedAroma)
  const selectedDates = useAppSelector(selectSelectedDates)
  const cardtextState = useAppSelector(selectCardtextState)
  const cardtextMiniPreviewRenderable = useAppSelector(
    selectCardtextMiniPreviewHasRenderableContent,
  )
  const appliedRecipientAddress = useAppSelector(selectAppliedRecipientDisplayAddress)
  const appliedSenderAddress = useAppSelector(selectAppliedSenderDisplayAddress)
  const cartItems = useAppSelector(selectCartItems)
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

  const mirrorMinisFromRightPie =
    centerStripListMirrorEnabled && mirrorSectionFlags != null
  const sourcePostcard =
    mirrorTargetLocalId != null
      ? cartItems.find((p) => p.localId === mirrorTargetLocalId) ?? null
      : null

  const mirrorEditorSnapshot = {
    cardphotoAppliedData,
    cardtextApplied: cardtextState?.appliedData ?? null,
    appliedRecipientAddress,
    appliedSenderAddress,
    selectedAroma,
    selectedDates,
  }

  const allMirrorSectionsApplied = useMemo(
    () =>
      areAllEligibleMirrorSectionsApplied(
        SECTIONS_ORDER,
        mirrorInner,
        mirrorSectionFlags,
        sourcePostcard,
        mirrorEditorSnapshot,
      ),
    [
      mirrorInner,
      mirrorSectionFlags,
      sourcePostcard,
      cardphotoAppliedData,
      cardtextState?.appliedData,
      appliedRecipientAddress,
      appliedSenderAddress,
      selectedAroma,
      selectedDates,
    ],
  )

  const panelMiniSectionsToolbarStateOverride = useMemo(
    () =>
      allMirrorSectionsApplied
        ? ({ cardPieCheck: 'active' as const } satisfies Record<string, string>)
        : undefined,
    [allMirrorSectionsApplied],
  )

  const handlePanelMiniSectionsAction = useCallback(
    (key: IconKey) => {
      if (key === 'cardPieCheck') {
        if (mirrorTargetLocalId == null) return
        if (allMirrorSectionsApplied) {
          dispatch(revertAllMirrorSectionsCopyRequested())
        } else {
          dispatch(
            applyAllMirrorSectionsCopyRequested({
              sourceLocalId: mirrorTargetLocalId,
            }),
          )
        }
        return
      }
      if (key === 'cardPieEdit') {
        dispatch(setCardPieCopyStripExpanded(false))
      }
      onPanelMiniSectionsToolbarAction?.(key)
    },
    [
      dispatch,
      onPanelMiniSectionsToolbarAction,
      mirrorTargetLocalId,
      allMirrorSectionsApplied,
    ],
  )

  return (
    <div
      ref={ref}
      className={clsx(
        embedded ? styles.rootEmbedded : styles.root,
        !embedded && !rightModeActive && styles.rootLeftPieMode,
        rightModeActive &&
          cardPieCopyStripActive &&
          styles.rootRightCopyMode,
        !rightModeActive &&
          cardPieCopyStripActive &&
          styles.rootLeftCopyMode,
      )}
      style={{
        width: totalWidth != null ? `min(100%, ${totalWidth}px)` : '100%',
        minWidth: sizeCard?.width === 0 ? '8rem' : undefined,
      }}
    >
      {sectionSize != null && gapSize != null && sizeMiniCard != null && (
        <MiniStripCellSideProvider value={sectionSize}>
          {(() => {
            const miniStrip = (
              <div
                className={styles.strip}
                style={{
                  paddingLeft: `${gapSize}px`,
                  paddingRight: `${gapSize}px`,
                  gap: `${gapSize}px`,
                }}
              >
                {SECTIONS_ORDER.map((section) => {
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
                          : section === 'cardtext'
                            ? !cardtextMiniPreviewRenderable
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
                        peekToolbarOnMiniOpen={
                          cardPieCopyStripActive &&
                          onActivateSectionPeekNoToolbar != null
                        }
                        onActivateSectionPeekNoToolbar={
                          onActivateSectionPeekNoToolbar
                        }
                        onBeforeOpenSection={
                          !rightModeActive ? onBeforeOpenMiniSection : undefined
                        }
                        mirrorApplyCorner={
                          showMirrorApplyButtons ? (
                            (() => {
                              const canApply = canApplyMirrorSection(
                                section,
                                mirrorInner,
                                mirrorSectionFlags,
                              )
                              const isApplied = isMirrorSectionAppliedToEditor(
                                section,
                                mirrorInner,
                                sourcePostcard,
                                mirrorEditorSnapshot,
                              )
                              return (
                                <button
                                  type="button"
                                  className={miniCardStyles.miniCardCornerButton}
                                  disabled={!canApply}
                                  data-applied={
                                    isApplied ? 'true' : undefined
                                  }
                                  aria-pressed={isApplied}
                                  aria-label={
                                    isApplied
                                      ? `Revert "${section}" to state before copy`
                                      : `Copy "${section}" from selected postcard`
                                  }
                                  onMouseDown={(e) => e.stopPropagation()}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    if (mirrorTargetLocalId == null || !canApply) {
                                      return
                                    }
                                    if (isApplied) {
                                      dispatch(
                                        revertMirrorSectionCopyRequested({
                                          section,
                                        }),
                                      )
                                      return
                                    }
                                    dispatch(
                                      applyArchiveSectionToEditorRequested({
                                        section,
                                        sourceLocalId: mirrorTargetLocalId,
                                      }),
                                    )
                                  }}
                                >
                                  {isApplied ? (
                                    <IconApplyMediumCheck />
                                  ) : (
                                    <IconApplyMedium />
                                  )}
                                </button>
                              )
                            })()
                          ) : null
                        }
                      />
                    </div>
                  )
                })}
              </div>
            )

            return cardPieCopyStripActive ? (
              <div className={styles.copyRow}>
                {miniStrip}
                <div className={styles.panelMiniSectionsToolbar}>
                  <Toolbar
                    section="panelMiniSections"
                    mergedWithCenter
                    stateOverride={panelMiniSectionsToolbarStateOverride}
                    onActionClick={handlePanelMiniSectionsAction}
                  />
                </div>
              </div>
            ) : (
              miniStrip
            )
          })()}
        </MiniStripCellSideProvider>
      )}
    </div>
  )
})
