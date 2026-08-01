import React from 'react'
import { CardPie } from '@features/cardPie/presentation/CardPie'
import { isPostcardPieAllComplete } from '@features/cardPie/infrastructure/postcardCardPieViewModel'
import type { MobilePlanCardPie } from './useMobilePlanCardPies'
import styles from './MobileAppShell.module.scss'

type MobileCardPieGutterMinisProps = {
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
    planPies,
    selectedPlanPieId,
    highlightPlanPieId,
    highlightAllPlanPies = false,
    onSelectPlanPie,
  }) => {
    /** `null` must not fall through to `selectedPlanPieId` (archive mode clears accent). */
    const accentPlanPieId =
      highlightPlanPieId !== undefined ? highlightPlanPieId : selectedPlanPieId

    return (
      <div className={styles.mobilePieGutterMiniList} aria-label="Card pie plan">
        {planPies.map(({ id, inner, sections }) => (
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
            data-ready={isPostcardPieAllComplete(sections) ? 'true' : undefined}
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
    )
  }
