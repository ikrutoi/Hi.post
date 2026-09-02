export type PlanPieGutterHighlight = {
  highlightPlanPieId: string | null
  highlightAllPlanPies: boolean
}

/**
 * Mini-pie accent while the factory (left) pie is showing.
 * Overview (several minis, no single selection) accents every mini.
 * One selected mini accents only that mini.
 * A sole mini stays accented even when `selectedPlanPieId` is still null.
 */
export function resolvePlanPieGutterHighlight(input: {
  keepAccent: boolean
  planPieCount: number
  firstPlanPieId: string | null
  selectedPlanPieId: string | null
}): PlanPieGutterHighlight {
  if (!input.keepAccent) {
    return { highlightPlanPieId: null, highlightAllPlanPies: false }
  }

  if (input.planPieCount > 1) {
    return {
      highlightPlanPieId: input.selectedPlanPieId,
      highlightAllPlanPies: input.selectedPlanPieId == null,
    }
  }

  if (input.selectedPlanPieId != null) {
    return {
      highlightPlanPieId: input.selectedPlanPieId,
      highlightAllPlanPies: false,
    }
  }

  return {
    highlightPlanPieId: input.firstPlanPieId,
    highlightAllPlanPies: false,
  }
}
