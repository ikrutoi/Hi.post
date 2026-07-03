import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAppSelector } from '@app/hooks'
import { selectActiveCardFullData } from '@features/cardPie/infrastructure/selectors'
import {
  buildCardPieInnerDataForPlanEntry,
  cardPieInnerFromEditorActiveData,
  DEFAULT_MOBILE_PLAN_PIE_ID,
  emptyCardPieInnerData,
} from '@features/cardPie/infrastructure/planEntryCardPieViewModel'
import type {
  CardPieInnerData,
  CardPieSectionFlags,
} from '@features/cardPie/infrastructure/postcardCardPieViewModel'
import { buildPieSectionFlagsFromInner } from '@features/cardPie/infrastructure/postcardCardPieViewModel'
import type { DispatchDate } from '@entities/date'
import { useDispatchPlanListEntries } from '@date/application/hooks/useDispatchPlanListEntries'
import {
  selectCardPieListSortDirection,
  selectNotebookDateTabPeekClearTick,
} from '@date/calendar/infrastructure/selectors'
import { selectEnvelopeSessionRecord } from '@envelope/infrastructure/selectors'
import {
  selectRecipientEntriesState,
  selectRecipientState,
} from '@envelope/recipient/infrastructure/selectors'
import { selectRecipientsList } from '@envelope/infrastructure/selectors'

export type MobilePlanCardPie = {
  id: string
  dispatchBranchKey: string | null
  inner: CardPieInnerData
  sections: CardPieSectionFlags
  dispatchDate: DispatchDate | null
}

function buildDefaultMobilePlanPie(
  baseInner: CardPieInnerData,
  envelopeComplete: boolean,
): MobilePlanCardPie {
  return {
    id: DEFAULT_MOBILE_PLAN_PIE_ID,
    dispatchBranchKey: null,
    dispatchDate: null,
    inner: baseInner,
    sections: buildPieSectionFlagsFromInner(baseInner, envelopeComplete),
  }
}

export function useMobilePlanCardPies() {
  const listSortDirection = useAppSelector(selectCardPieListSortDirection)
  const notebookDateTabPeekClearTick = useAppSelector(
    selectNotebookDateTabPeekClearTick,
  )
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
    const baseInner =
      cardPieInnerFromEditorActiveData(activeEditorData) ??
      emptyCardPieInnerData()
    const ctx = { envelopeRecipients, recipientEntries }
    const envelopeComplete = Boolean(envelopeRecord?.isComplete)

    const mapped = entries
      .filter((entry) => entry.variant !== 'inactive')
      .map((entry) => ({
        id: entry.id,
        dispatchBranchKey: entry.dispatchBranchKey ?? null,
        dispatchDate: entry.sourceDate ?? null,
        ...buildCardPieInnerDataForPlanEntry(entry, baseInner, {
          recipientState,
          envelopeComplete,
          ctx,
        }),
      }))

    if (mapped.length > 0) return mapped

    return [buildDefaultMobilePlanPie(baseInner, envelopeComplete)]
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
    if (selectedPlanPieId == null) return
    if (planPies.some((pie) => pie.id === selectedPlanPieId)) return
    setSelectedPlanPieId(planPies[0]?.id ?? null)
  }, [planPies, selectedPlanPieId])

  useEffect(() => {
    if (notebookDateTabPeekClearTick === 0) return
    setSelectedPlanPieId(null)
  }, [notebookDateTabPeekClearTick])

  const cyclePlanPie = useCallback((): string | null => {
    if (planPies.length === 0) return null

    let nextId: string | null
    if (selectedPlanPieId == null) {
      nextId = planPies[0].id
    } else {
      const currentIndex = planPies.findIndex(
        (pie) => pie.id === selectedPlanPieId,
      )
      if (currentIndex === -1) {
        nextId = planPies[0].id
      } else if (currentIndex >= planPies.length - 1) {
        nextId = null
      } else {
        nextId = planPies[currentIndex + 1].id
      }
    }

    setSelectedPlanPieId(nextId)
    return nextId
  }, [planPies, selectedPlanPieId])

  return {
    planPies,
    selectedPlanPie,
    selectedPlanPieId,
    selectPlanPie: setSelectedPlanPieId,
    cyclePlanPie,
  }
}
