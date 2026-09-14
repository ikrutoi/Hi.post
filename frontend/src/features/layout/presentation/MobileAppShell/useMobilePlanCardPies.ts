import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { selectActiveCardFullData } from '@features/cardPie/infrastructure/selectors'
import { selectAppliedDates } from '@date/infrastructure/selectors'
import {
  dispatchDateKeyFromDispatchDate,
  parseDispatchBranchKey,
  parseDispatchDateKey,
} from '@date/domain/dispatchBranchKey'
import { nextFocusedDispatchDateKey } from '@date/domain/helpers/nextFocusedDispatchDateKey'
import { updateLastViewedCalendarDate } from '@date/calendar/infrastructure/state'
import {
  buildCardPieInnerDataForPlanEntry,
  buildDateGroupCardPieInner,
  buildRecipientGroupCardPieInner,
  cardPieInnerFromEditorActiveData,
  DEFAULT_MOBILE_PLAN_PIE_ID,
  emptyCardPieInnerData,
} from '@features/cardPie/infrastructure/planEntryCardPieViewModel'
import { nextFocusedRecipientSlotKey } from '@envelope/domain/helpers/nextFocusedRecipientSlotKey'
import { bindAssemblyRecipientCycle } from './assemblyRecipientCycleBridge'
import { bindAssemblyDateCycle } from './assemblyDateCycleBridge'
import { resolveAddressForRecipientId } from '@features/cardPie/infrastructure/postcardCardPieViewModel'
import {
  selectRecipientApplied,
  selectRecipientEntriesState,
  selectRecipientState,
} from '@envelope/recipient/infrastructure/selectors'
import {
  selectArchiveEnvelopeSandboxActive,
  selectArchiveSandboxRecipientApplied,
} from '@cardPanel/infrastructure/selectors/archiveEnvelopeSandboxSelectors'
import { setArchiveRecipientViewId } from '@cardPanel/infrastructure/state'
import { setRecipientViewId } from '@envelope/recipient/infrastructure/state'
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

export function planPieRecipientSlotKey(
  pie: Pick<MobilePlanCardPie, 'dispatchBranchKey'>,
): string | null {
  if (pie.dispatchBranchKey == null) return null
  return parseDispatchBranchKey(pie.dispatchBranchKey)?.recipientSlotKey ?? null
}

export function planPieDispatchDateKey(
  pie: Pick<MobilePlanCardPie, 'dispatchBranchKey' | 'dispatchDate' | 'inner'>,
): string | null {
  if (pie.dispatchDate != null) {
    return dispatchDateKeyFromDispatchDate(pie.dispatchDate)
  }
  const fromBranch =
    pie.dispatchBranchKey != null
      ? parseDispatchBranchKey(pie.dispatchBranchKey)?.date
      : null
  if (fromBranch != null) return dispatchDateKeyFromDispatchDate(fromBranch)
  const fromInner = pie.inner.dates[0] ?? pie.inner.date
  if (fromInner == null) return null
  return dispatchDateKeyFromDispatchDate(fromInner)
}

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
  const dispatch = useAppDispatch()
  const listSortDirection = useAppSelector(selectCardPieListSortDirection)
  const notebookDateTabPeekClearTick = useAppSelector(
    selectNotebookDateTabPeekClearTick,
  )
  const entries = useDispatchPlanListEntries({
    activeModeOnly: true,
    listSortDirection,
    showUndatedWhenAnySectionSelected: true,
    hideBranchesInCart: false,
  })
  const activeEditorData = useAppSelector(selectActiveCardFullData)
  const envelopeRecord = useAppSelector(selectEnvelopeSessionRecord)
  const recipientState = useAppSelector(selectRecipientState)
  const envelopeRecipients = useAppSelector(selectRecipientsList)
  const recipientEntries = useAppSelector(selectRecipientEntriesState)
  const assemblyFreeze = useAppSelector(selectAssemblyBranchFreeze)
  const appliedDates = useAppSelector(selectAppliedDates)
  const sandboxActive = useAppSelector(selectArchiveEnvelopeSandboxActive)
  const sessionAppliedRecipientIds = useAppSelector(selectRecipientApplied)
  const sandboxAppliedRecipientIds = useAppSelector(
    selectArchiveSandboxRecipientApplied,
  )
  const appliedRecipientIds = sandboxActive
    ? sandboxAppliedRecipientIds
    : sessionAppliedRecipientIds
  const [selectedPlanPieId, setSelectedPlanPieId] = useState<string | null>(
    null,
  )
  const [focusedRecipientSlotKey, setFocusedRecipientSlotKey] = useState<
    string | null
  >(null)
  const [focusedDispatchDateKey, setFocusedDispatchDateKey] = useState<
    string | null
  >(null)
  const prevAppliedDatesKeyRef = useRef('')
  const prevAppliedRecipientsKeyRef = useRef('')

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

  const focusedRecipientPies = useMemo(() => {
    if (focusedRecipientSlotKey == null) return []
    return planPies.filter(
      (pie) => planPieRecipientSlotKey(pie) === focusedRecipientSlotKey,
    )
  }, [focusedRecipientSlotKey, planPies])

  const focusedDatePies = useMemo(() => {
    if (focusedDispatchDateKey == null) return []
    return planPies.filter(
      (pie) => planPieDispatchDateKey(pie) === focusedDispatchDateKey,
    )
  }, [focusedDispatchDateKey, planPies])

  useEffect(() => {
    if (selectedPlanPieId == null) return
    if (planPies.some((pie) => pie.id === selectedPlanPieId)) return
    setSelectedPlanPieId(planPies[0]?.id ?? null)
  }, [planPies, selectedPlanPieId])

  useEffect(() => {
    if (notebookDateTabPeekClearTick === 0) return
    setSelectedPlanPieId(null)
    setFocusedRecipientSlotKey(null)
    setFocusedDispatchDateKey(null)
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
      setFocusedRecipientSlotKey(null)
      setFocusedDispatchDateKey(null)
    }
  }, [appliedDates])

  useEffect(() => {
    const key = appliedRecipientIds.join('|')
    if (key === prevAppliedRecipientsKeyRef.current) return
    prevAppliedRecipientsKeyRef.current = key
    if (appliedRecipientIds.length > 1) {
      setSelectedPlanPieId(null)
      setFocusedRecipientSlotKey(null)
      setFocusedDispatchDateKey(null)
    }
  }, [appliedRecipientIds])

  const selectPlanPie = useCallback((id: string | null) => {
    setFocusedRecipientSlotKey(null)
    setFocusedDispatchDateKey(null)
    setSelectedPlanPieId(id)
  }, [])

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

    setFocusedRecipientSlotKey(null)
    setFocusedDispatchDateKey(null)
    setSelectedPlanPieId(nextId)
    return nextId
  }, [planPies, selectedPlanPieId])

  const recipientCycleIds = useMemo(() => {
    const fromPies: string[] = []
    const seen = new Set<string>()
    for (const pie of planPies) {
      const key = planPieRecipientSlotKey(pie)
      if (key == null || key === 'session' || seen.has(key)) continue
      seen.add(key)
      fromPies.push(key)
    }
    if (fromPies.length > 1) return fromPies
    if (appliedRecipientIds.length > 1) return appliedRecipientIds
    const viewIds =
      recipientState?.currentRecipientsList === 'second'
        ? (recipientState.recipientsViewIdsSecondList ?? [])
        : (recipientState?.recipientsViewIdsFirstList ?? [])
    if (viewIds.length > 1) return viewIds
    return fromPies.length > 0 ? fromPies : appliedRecipientIds
  }, [appliedRecipientIds, planPies, recipientState])

  const cycleFocusedRecipient = useCallback((): string | null => {
    if (recipientCycleIds.length <= 1) return focusedRecipientSlotKey
    const next = nextFocusedRecipientSlotKey(
      recipientCycleIds,
      focusedRecipientSlotKey,
    )
    setFocusedRecipientSlotKey(next)
    setFocusedDispatchDateKey(null)
    setSelectedPlanPieId(null)
    if (sandboxActive) {
      dispatch(setArchiveRecipientViewId(next))
    } else {
      dispatch(setRecipientViewId(next))
    }
    return next
  }, [
    dispatch,
    focusedRecipientSlotKey,
    recipientCycleIds,
    sandboxActive,
  ])

  useEffect(() => bindAssemblyRecipientCycle(cycleFocusedRecipient), [
    cycleFocusedRecipient,
  ])

  const dateCycleKeys = useMemo(() => {
    const fromApplied: string[] = []
    const appliedSeen = new Set<string>()
    for (const d of appliedDates) {
      const key = dispatchDateKeyFromDispatchDate(d)
      if (appliedSeen.has(key)) continue
      appliedSeen.add(key)
      fromApplied.push(key)
    }
    if (fromApplied.length > 1) return fromApplied
    const fromPies: string[] = []
    const pieSeen = new Set<string>()
    for (const pie of planPies) {
      const key = planPieDispatchDateKey(pie)
      if (key == null || pieSeen.has(key)) continue
      pieSeen.add(key)
      fromPies.push(key)
    }
    if (fromPies.length > 1) return fromPies
    return fromApplied.length > 0 ? fromApplied : fromPies
  }, [appliedDates, planPies])

  const cycleFocusedDispatchDate = useCallback((): string | null => {
    if (dateCycleKeys.length <= 1) return focusedDispatchDateKey
    const next = nextFocusedDispatchDateKey(
      dateCycleKeys,
      focusedDispatchDateKey,
    )
    setFocusedDispatchDateKey(next)
    setFocusedRecipientSlotKey(null)
    setSelectedPlanPieId(null)
    if (sandboxActive) {
      dispatch(setArchiveRecipientViewId(null))
    } else {
      dispatch(setRecipientViewId(null))
    }
    const focusedDate = next != null ? parseDispatchDateKey(next) : null
    if (focusedDate != null) {
      dispatch(
        updateLastViewedCalendarDate({
          year: focusedDate.year,
          month: focusedDate.month,
        }),
      )
    }
    return next
  }, [
    dateCycleKeys,
    dispatch,
    focusedDispatchDateKey,
    sandboxActive,
  ])

  useEffect(() => bindAssemblyDateCycle(cycleFocusedDispatchDate), [
    cycleFocusedDispatchDate,
  ])

  const focusedRecipientInner = useMemo(() => {
    if (focusedRecipientSlotKey == null) return null
    if (focusedRecipientPies.length > 0) {
      return buildRecipientGroupCardPieInner(
        assemblyOverviewPie.inner,
        focusedRecipientPies.map((pie) => pie.inner),
      )
    }
    const address = resolveAddressForRecipientId(
      focusedRecipientSlotKey,
      envelopeRecipients ?? [],
      recipientEntries ?? [],
    )
    if (address == null) return null
    return {
      ...assemblyOverviewPie.inner,
      recipient: address,
      recipientCount: 1 as const,
      recipientPreviewLines: [],
    }
  }, [
    assemblyOverviewPie.inner,
    envelopeRecipients,
    focusedRecipientPies,
    focusedRecipientSlotKey,
    recipientEntries,
  ])

  const focusedDateInner = useMemo(() => {
    if (focusedDispatchDateKey == null) return null
    const focusedDate = parseDispatchDateKey(focusedDispatchDateKey)
    if (focusedDatePies.length > 0) {
      return buildDateGroupCardPieInner(
        assemblyOverviewPie.inner,
        focusedDatePies.map((pie) => pie.inner),
        focusedDate,
      )
    }
    if (focusedDate == null) return null
    return {
      ...assemblyOverviewPie.inner,
      date: focusedDate,
      dates: [focusedDate],
      datePreviewLines: [String(focusedDate.day)],
    }
  }, [
    assemblyOverviewPie.inner,
    focusedDatePies,
    focusedDispatchDateKey,
  ])

  return {
    planPies,
    selectedPlanPie,
    selectedPlanPieId,
    focusedRecipientSlotKey,
    focusedRecipientPies,
    focusedRecipientInner,
    focusedDispatchDateKey,
    focusedDatePies,
    focusedDateInner,
    /** Central pie when no single gutter mini is selected. */
    assemblyOverviewPie,
    selectPlanPie,
    cyclePlanPie,
    cycleFocusedRecipient,
    cycleFocusedDispatchDate,
  }
}
