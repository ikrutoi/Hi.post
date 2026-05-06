import clsx from 'clsx'
import React, { forwardRef, useCallback } from 'react'
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
import { MiniStripCellSideProvider } from './MiniStripCellSideContext'
import { selectHasEnvelopeAppliedContent } from '@envelope/infrastructure/selectors'
import { selectCardphotoIsComplete } from '@cardphoto/infrastructure/selectors'
import { selectMergedDispatchDates } from '@date/infrastructure/selectors'
import { selectCardphotoAppliedData } from '@cardphoto/infrastructure/selectors'
import { selectSelectedAroma } from '@aroma/infrastructure/selectors'
import { selectSelectedDates } from '@date/infrastructure/selectors'
import { selectCardtextState } from '@cardtext/infrastructure/selectors'
import {
  selectAppliedRecipientDisplayAddress,
} from '@envelope/recipient/infrastructure/selectors'
import { selectAppliedSenderDisplayAddress } from '@envelope/sender/infrastructure/selectors'
import { selectCartItems } from '@cart/infrastructure/selectors'
// cspell:ignore Renderable
import { cardtextHasRenderableContent } from '@cardtext/domain/editor/editor.types'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { applyArchiveSectionToEditorRequested } from '@cardPanel/infrastructure/state'
import { getToolbarIcon } from '@shared/utils/icons'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { setCardPieCopyStripExpanded } from '@cart/infrastructure/state'
import type {
  CardPieInnerData,
  CardPieSectionFlags,
} from '@features/cardPie/infrastructure/postcardCardPieViewModel'
import type { AddressFields, CardSection, IconKey } from '@shared/config/constants'
import type { DispatchDate } from '@entities/date'

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

function sameAddress(
  a: Readonly<AddressFields> | null | undefined,
  b: Readonly<AddressFields> | null | undefined,
): boolean {
  if (a == null && b == null) return true
  if (a == null || b == null) return false
  return (
    String(a.name ?? '') === String(b.name ?? '') &&
    String(a.street ?? '') === String(b.street ?? '') &&
    String(a.city ?? '') === String(b.city ?? '') &&
    String(a.zip ?? '') === String(b.zip ?? '') &&
    String(a.country ?? '') === String(b.country ?? '')
  )
}

function sameDates(a: DispatchDate[], b: DispatchDate[]): boolean {
  if (a.length !== b.length) return false
  return a.every((d, i) => {
    const x = b[i]
    return d.year === x.year && d.month === x.month && d.day === x.day
  })
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

  const handlePanelMiniSectionsAction = useCallback(
    (key: IconKey) => {
      if (key === 'cardPieCheck') {
        dispatch(setCardPieCopyStripExpanded(false))
        return
      }
      if (key === 'cardPieEdit') {
        dispatch(setCardPieCopyStripExpanded(false))
      }
      onPanelMiniSectionsToolbarAction?.(key)
    },
    [dispatch, onPanelMiniSectionsToolbarAction],
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
                        mirrorApplyCorner={
                          showMirrorApplyButtons ? (
                            <button
                              type="button"
                              className={miniCardStyles.miniCardCornerButton}
                              disabled={(() => {
                                const hasMirrorData = canApplyMirrorSection(
                                  section,
                                  mirrorInner,
                                  mirrorSectionFlags,
                                )
                                if (!hasMirrorData) return true

                                if (section === 'cardphoto') {
                                  const sourceMeta =
                                    sourcePostcard?.card?.cardphoto
                                      ?.appliedData ??
                                    sourcePostcard?.card?.cardphoto
                                      ?.assetData ??
                                    null
                                  if (!sourceMeta) return true
                                  return (
                                    sourceMeta.id === cardphotoAppliedData?.id
                                  )
                                }

                                if (section === 'cardtext') {
                                  const src = mirrorInner?.cardtext
                                  const applied =
                                    cardtextState?.appliedData ?? null
                                  if (!src || !applied) return false
                                  if (src.id != null && applied.id != null) {
                                    return String(src.id) === String(applied.id)
                                  }
                                  return (
                                    src.plainText === applied.plainText &&
                                    src.cardtextLines === applied.cardtextLines
                                  )
                                }

                                if (section === 'envelope') {
                                  return (
                                    sameAddress(
                                      mirrorInner?.recipient ?? null,
                                      appliedRecipientAddress,
                                    ) &&
                                    sameAddress(
                                      mirrorInner?.sender ?? null,
                                      appliedSenderAddress,
                                    )
                                  )
                                }

                                if (section === 'aroma') {
                                  return (
                                    (mirrorInner?.aroma?.index ?? null) ===
                                    (selectedAroma?.index ?? null)
                                  )
                                }

                                if (section === 'date') {
                                  const srcDates = mirrorInner?.dates ?? []
                                  return sameDates(srcDates, selectedDates)
                                }

                                return false
                              })()}
                              aria-label={`Transfer "${section}" from selected postcard`}
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
            )

            return cardPieCopyStripActive ? (
              <div className={styles.copyRow}>
                {miniStrip}
                <div className={styles.panelMiniSectionsToolbar}>
                  <Toolbar
                    section="panelMiniSections"
                    mergedWithCenter
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
