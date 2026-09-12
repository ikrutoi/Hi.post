import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAppSelector } from '@app/hooks'
import { selectActiveCardFullData } from '@features/cardPie/infrastructure/selectors'
import { selectAppliedDates } from '@date/infrastructure/selectors'
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
import { selectAssemblyBranchFreeze } from '@cardPanel/infrastructure/selectors/assemblyBranchFreezeSelectors'

export type MobilePlanCardPie = {
  id: string
  dispatchBranchKey: string | null
  inner: CardPieInnerData
  sections: CardPieSectionFlags
  dispatchDate: DispatchDate | null
}

export const EMPTY_GUTTER_PLAN_PIE_ID = 'empty-gutter-pie'

export function buildEmptyGutterPlanPie(): MobilePlanCardPie {
  const inner = emptyCardPieInnerData()
  return {
    id: EMPTY_GUTTER_PLAN_PIE_ID,
    dispatchBranchKey: null,
    dispatchDate: null,
    inner,
    sections: buildPieSectionFlagsFromInner(inner, false),
  }
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
  const assemblyFreeze = useAppSelector(selectAssemblyBranchFreeze)
  const appliedDates = useAppSelector(selectAppliedDates)
  const [selectedPlanPieId, setSelectedPlanPieId] = useState<string | null>(
    null,
  )
  const prevAppliedDatesKeyRef = useRef('')

  const assemblyBase = useMemo(() => {
    const useFreeze = assemblyFreeze != null
    /**
     * After cardPieCopy, freeze is cleared and live session has the copy.
     * Do not overlay mirror-backup cardtext: that snapshot is the *pre-copy*
     * factory (often empty), so mini pies hid cardtext until reload.
     * Archive peek/edit still uses freeze.editorData.
     */
    const baseInner =
      (useFreeze
        ? cardPieInnerFromEditorActiveData(assemblyFreeze.editorData)
        : null) ??
      cardPieInnerFromEditorActiveData(activeEditorData) ??
      emptyCardPieInnerData()
    const envelopeComplete = useFreeze
      ? Boolean(assemblyFreeze.sections.envelope)
      : Boolean(envelopeRecord?.isComplete)
    return { baseInner, envelopeComplete, useFreeze }
  }, [activeEditorData, assemblyFreeze, envelopeRecord?.isComplete])

  /**
   * All gutter minis selected (overview): full session dates → counter in date sector.
   * Injected pie keeps the same isReady source as plan rows (no isProcessed flicker).
   */
  const assemblyOverviewPie = useMemo(
    () =>
      buildDefaultMobilePlanPie(
        assemblyBase.baseInner,
        assemblyBase.envelopeComplete,
      ),
    [assemblyBase],
  )

  const planPies = useMemo((): MobilePlanCardPie[] => {
    const { baseInner, envelopeComplete, useFreeze } = assemblyBase
    const ctx = { envelopeRecipients, recipientEntries }

    /**
     * Dual-mode: while freeze is active, do not merge live session recipient
     * into plan pies (archive hydrate would otherwise leak into minis).
     */
    const planRecipientState = useFreeze
      ? {
          ...recipientState,
          applied: [] as string[],
          appliedData: baseInner.recipient,
        }
      : recipientState

    const mapped = entries
      .filter((entry) => entry.variant !== 'inactive')
      .map((entry) => ({
        id: entry.id,
        dispatchBranchKey: entry.dispatchBranchKey ?? null,
        dispatchDate: entry.sourceDate ?? null,
        ...buildCardPieInnerDataForPlanEntry(entry, baseInner, {
          recipientState: planRecipientState,
          envelopeComplete,
          ctx,
        }),
      }))

    if (mapped.length > 0) return mapped

    return [buildEmptyGutterPlanPie()]
  }, [
    assemblyBase,
    entries,
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

  /**
   * After Apply with 2+ dates: select all gutter minis (overview).
   * Central CardPie then uses session `dates` → counter mode in the date sector.
   * A single mini stay on its one-day pieInner until the user cycles again.
   */
  useEffect(() => {
    const key = appliedDates
      .map((d) => `${d.year}-${d.month}-${d.day}`)
      .join('|')
    if (key === prevAppliedDatesKeyRef.current) return
    prevAppliedDatesKeyRef.current = key
    if (appliedDates.length > 1) {
      setSelectedPlanPieId(null)
    }
  }, [appliedDates])

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
    /** Central pie when no single gutter mini is selected. */
    assemblyOverviewPie,
    selectPlanPie: setSelectedPlanPieId,
    cyclePlanPie,
  }
}
