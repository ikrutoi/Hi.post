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
import { selectMirrorSectionBackup } from '@cardPanel/infrastructure/selectors/mirrorSectionBackupSelectors'
import { selectAssemblyBranchFreeze } from '@cardPanel/infrastructure/selectors/assemblyBranchFreezeSelectors'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import {
  cardtextHasRenderableContent,
  createInitialCardtextContent,
} from '@cardtext/domain/editor/editor.types'

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
  const cardtextMirrorBackup = useAppSelector((s) =>
    selectMirrorSectionBackup(s, 'cardtext'),
  )
  const assemblyFreeze = useAppSelector(selectAssemblyBranchFreeze)
  const { activePieSide } = useRightListArchiveMini()
  const [selectedPlanPieId, setSelectedPlanPieId] = useState<string | null>(
    null,
  )

  const planPies = useMemo((): MobilePlanCardPie[] => {
    const useFreeze = assemblyFreeze != null
    let baseInner =
      (useFreeze
        ? cardPieInnerFromEditorActiveData(assemblyFreeze.editorData)
        : null) ??
      cardPieInnerFromEditorActiveData(activeEditorData) ??
      emptyCardPieInnerData()
    /**
     * Fallback: cardtext backup if freeze missing (legacy path).
     */
    if (
      !useFreeze &&
      activePieSide === 'right' &&
      cardtextMirrorBackup?.section === 'cardtext'
    ) {
      const backupSession = cardtextMirrorBackup.session
      const assemblyCardtext =
        backupSession.appliedData != null &&
        cardtextHasRenderableContent(backupSession.appliedData)
          ? backupSession.appliedData
          : backupSession.assetData != null &&
              cardtextHasRenderableContent(backupSession.assetData)
            ? backupSession.assetData
            : null
      if (assemblyCardtext != null) {
        baseInner = {
          ...baseInner,
          cardtext: assemblyCardtext,
        }
      } else if (
        backupSession.appliedData == null &&
        backupSession.assetData == null
      ) {
        baseInner = {
          ...baseInner,
          cardtext: createInitialCardtextContent(),
        }
      }
    }
    const ctx = { envelopeRecipients, recipientEntries }
    const envelopeComplete = useFreeze
      ? Boolean(assemblyFreeze.sections.envelope)
      : Boolean(envelopeRecord?.isComplete)

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

    return [buildDefaultMobilePlanPie(baseInner, envelopeComplete)]
  }, [
    activeEditorData,
    activePieSide,
    assemblyFreeze,
    cardtextMirrorBackup,
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
