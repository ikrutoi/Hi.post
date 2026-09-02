import type { DateListPanelItem } from '@date/presentation/DateListPanel'

type PlanPieBranch = {
  dispatchBranchKey: string | null
}

export function resolveEditorPieAddCartPayload(input: {
  planPies: PlanPieBranch[]
  selectedPlanPie: PlanPieBranch | null
  planEntries: Pick<DateListPanelItem, 'dispatchBranchKey' | 'variant'>[]
}): {
  branchKeys: string[]
  clearEditorAfterAdd: boolean
} {
  const selectedKey = input.selectedPlanPie?.dispatchBranchKey
  if (selectedKey) {
    return {
      branchKeys: [selectedKey],
      clearEditorAfterAdd: input.planPies.length === 1,
    }
  }

  const fromPlanPies = input.planPies
    .map((pie) => pie.dispatchBranchKey)
    .filter((key): key is string => Boolean(key))
  if (fromPlanPies.length > 0) {
    return {
      branchKeys: fromPlanPies,
      clearEditorAfterAdd: input.planPies.length === 1,
    }
  }

  const fromEntries = input.planEntries
    .filter(
      (entry) => entry.variant !== 'inactive' && entry.dispatchBranchKey,
    )
    .map((entry) => entry.dispatchBranchKey as string)
  if (fromEntries.length > 0) {
    return {
      branchKeys: fromEntries,
      clearEditorAfterAdd: fromEntries.length === 1,
    }
  }

  return {
    branchKeys: [],
    clearEditorAfterAdd: true,
  }
}

/**
 * Delete on the central pie: drop only the selected factory branch when
 * several minis exist and the pie shows that one entity (date × recipient).
 * `null` → clear the whole factory (overview or last remaining mini).
 */
export function resolveEditorPieDeleteBranchKey(input: {
  planPies: PlanPieBranch[]
  selectedPlanPie: PlanPieBranch | null
}): string | null {
  const selectedKey = input.selectedPlanPie?.dispatchBranchKey
  if (!selectedKey) return null
  const branchCount = input.planPies.filter((pie) => pie.dispatchBranchKey)
    .length
  if (branchCount <= 1) return null
  return selectedKey
}
