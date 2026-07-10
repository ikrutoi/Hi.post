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
