import React, { useMemo } from 'react'
import { useAppSelector } from '@app/hooks'
import { CardPie } from '@features/cardPie/presentation/CardPie'
import { selectActiveCardFullData } from '@features/cardPie/infrastructure/selectors'
import {
  buildCardPieInnerDataForPlanEntry,
  cardPieInnerFromEditorActiveData,
} from '@features/cardPie/infrastructure/planEntryCardPieViewModel'
import { useDispatchPlanListEntries } from '@date/application/hooks/useDispatchPlanListEntries'
import { selectCardPieListSortDirection } from '@date/calendar/infrastructure/selectors'
import { selectEnvelopeSessionRecord } from '@envelope/infrastructure/selectors'
import {
  selectRecipientEntriesState,
  selectRecipientState,
} from '@envelope/recipient/infrastructure/selectors'
import { selectRecipientsList } from '@envelope/infrastructure/selectors'
import type { CardSection } from '@shared/config/constants'
import styles from './MobileAppShell.module.scss'

type MobileCardPieGutterMinisProps = {
  onLeftPieSectorClick: (section: CardSection) => void
}

export const MobileCardPieGutterMinis: React.FC<MobileCardPieGutterMinisProps> =
  ({ onLeftPieSectorClick }) => {
    const listSortDirection = useAppSelector(selectCardPieListSortDirection)
    const entries = useDispatchPlanListEntries({
      activeModeOnly: true,
      listSortDirection,
      showUndatedWhenAnySectionSelected: true,
      hideBranchesInCart: true,
    })
    const activeEditorData = useAppSelector(selectActiveCardFullData)
    const envelopeRecord = useAppSelector(selectEnvelopeSessionRecord)
    const recipientState = useAppSelector(selectRecipientState)
    const envelopeRecipients = useAppSelector(selectRecipientsList)
    const recipientEntries = useAppSelector(selectRecipientEntriesState)

    const planPies = useMemo(() => {
      const baseInner = cardPieInnerFromEditorActiveData(activeEditorData)
      if (baseInner == null) return []

      const ctx = { envelopeRecipients, recipientEntries }
      const envelopeComplete = Boolean(envelopeRecord?.isComplete)

      return entries
        .filter((entry) => entry.variant !== 'inactive')
        .map((entry) => ({
          id: entry.id,
          ...buildCardPieInnerDataForPlanEntry(entry, baseInner, {
            recipientState,
            envelopeComplete,
            ctx,
          }),
        }))
    }, [
      activeEditorData,
      entries,
      envelopeRecord?.isComplete,
      envelopeRecipients,
      recipientEntries,
      recipientState,
    ])

    if (planPies.length === 0) return null

    return (
      <div className={styles.mobilePieGutterMiniList} aria-label="Card pie plan">
        {planPies.map(({ id, inner, sections }) => (
          <div key={id} className={styles.mobilePieGutterMiniItem}>
            <CardPie
              fillContainer
              station="left"
              hideLeftPieCenterLogo
              hideEmptySectorPlaceholders
              pieInner={inner}
              pieSections={sections}
              onLeftPieSectorClick={onLeftPieSectorClick}
            />
          </div>
        ))}
      </div>
    )
  }
