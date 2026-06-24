import { useEffect, useMemo, useState } from 'react'
import { useAppSelector } from '@app/hooks'
import { selectActiveCardFullData } from '@features/cardPie/infrastructure/selectors'
import {
  buildCardPieInnerDataForPlanEntry,
  cardPieInnerFromEditorActiveData,
} from '@features/cardPie/infrastructure/planEntryCardPieViewModel'
import type {
  CardPieInnerData,
  CardPieSectionFlags,
} from '@features/cardPie/infrastructure/postcardCardPieViewModel'
import type { DispatchDate } from '@entities/date'
import { useDispatchPlanListEntries } from '@date/application/hooks/useDispatchPlanListEntries'
import { selectCardPieListSortDirection } from '@date/calendar/infrastructure/selectors'
import { selectEnvelopeSessionRecord } from '@envelope/infrastructure/selectors'
import {
  selectRecipientEntriesState,
  selectRecipientState,
} from '@envelope/recipient/infrastructure/selectors'
import { selectRecipientsList } from '@envelope/infrastructure/selectors'

export type MobilePlanCardPie = {
  id: string
  inner: CardPieInnerData
  sections: CardPieSectionFlags
  dispatchDate: DispatchDate | null
}

export function useMobilePlanCardPies() {
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
  const [selectedPlanPieId, setSelectedPlanPieId] = useState<string | null>(
    null,
  )

  const planPies = useMemo((): MobilePlanCardPie[] => {
    const baseInner = cardPieInnerFromEditorActiveData(activeEditorData)
    if (baseInner == null) return []

    const ctx = { envelopeRecipients, recipientEntries }
    const envelopeComplete = Boolean(envelopeRecord?.isComplete)

    return entries
      .filter((entry) => entry.variant !== 'inactive')
      .map((entry) => ({
        id: entry.id,
        dispatchDate: entry.sourceDate ?? null,
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

  const selectedPlanPie = useMemo(
    () => planPies.find((pie) => pie.id === selectedPlanPieId) ?? null,
    [planPies, selectedPlanPieId],
  )

  useEffect(() => {
    if (
      selectedPlanPieId != null &&
      !planPies.some((pie) => pie.id === selectedPlanPieId)
    ) {
      setSelectedPlanPieId(null)
    }
  }, [planPies, selectedPlanPieId])

  return {
    planPies,
    selectedPlanPie,
    selectedPlanPieId,
    selectPlanPie: setSelectedPlanPieId,
  }
}
