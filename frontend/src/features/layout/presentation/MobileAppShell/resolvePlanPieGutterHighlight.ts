export type PlanPieGutterHighlight = {
  highlightPlanPieId: string | null
  highlightAllPlanPies: boolean
  highlightPlanPieIds: string[] | null
}

/**
 * Mini-pie accent while the factory (left) pie is showing.
 * Overview (several minis, no single selection) accents every mini.
 * One selected mini accents only that mini.
 * A recipient group (addressNext) accents every mini that shares that address.
 * A sole mini stays accented even when `selectedPlanPieId` is still null.
 */
export function resolvePlanPieGutterHighlight(input: {
  keepAccent: boolean
  planPieCount: number
  firstPlanPieId: string | null
  selectedPlanPieId: string | null
  highlightPlanPieIds?: string[] | null
}): PlanPieGutterHighlight {
  const none: PlanPieGutterHighlight = {
    highlightPlanPieId: null,
    highlightAllPlanPies: false,
    highlightPlanPieIds: null,
  }

  if (!input.keepAccent) return none

  const groupIds = input.highlightPlanPieIds
  if (
    groupIds != null &&
    groupIds.length > 0 &&
    input.selectedPlanPieId == null
  ) {
    return {
      highlightPlanPieId: null,
      highlightAllPlanPies: false,
      highlightPlanPieIds: groupIds,
    }
  }

  if (input.planPieCount > 1) {
    return {
      highlightPlanPieId: input.selectedPlanPieId,
      highlightAllPlanPies: input.selectedPlanPieId == null,
      highlightPlanPieIds: null,
    }
  }

  if (input.selectedPlanPieId != null) {
    return {
      highlightPlanPieId: input.selectedPlanPieId,
      highlightAllPlanPies: false,
      highlightPlanPieIds: null,
    }
  }

  return {
    highlightPlanPieId: input.firstPlanPieId,
    highlightAllPlanPies: false,
    highlightPlanPieIds: null,
  }
}
