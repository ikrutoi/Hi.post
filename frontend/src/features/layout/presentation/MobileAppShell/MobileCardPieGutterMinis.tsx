import React from 'react'
import { CardPie } from '@features/cardPie/presentation/CardPie'
import type { MobilePlanCardPie } from './useMobilePlanCardPies'
import styles from './MobileAppShell.module.scss'

type MobileCardPieGutterMinisProps = {
  planPies: MobilePlanCardPie[]
  selectedPlanPieId: string | null
  onSelectPlanPie: (id: string) => void
}

export const MobileCardPieGutterMinis: React.FC<MobileCardPieGutterMinisProps> =
  ({ planPies, selectedPlanPieId, onSelectPlanPie }) => {
    if (planPies.length === 0) return null

    return (
      <div className={styles.mobilePieGutterMiniList} aria-label="Card pie plan">
        {planPies.map(({ id, inner, sections }) => (
          <button
            key={id}
            type="button"
            className={styles.mobilePieGutterMiniItem}
            data-selected={selectedPlanPieId === id ? 'true' : undefined}
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
              hideLeftPieCenterLogo
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
