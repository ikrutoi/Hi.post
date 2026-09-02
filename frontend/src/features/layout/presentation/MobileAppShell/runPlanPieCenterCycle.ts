import { store, type AppDispatch } from '@app/state/store'
import { selectViewAroma } from '@aroma/infrastructure/selectors'
import { clearViewAroma } from '@aroma/infrastructure/state'
import { updateLastViewedCalendarDate } from '@date/calendar/infrastructure/state'
import type { MobilePlanCardPie } from './useMobilePlanCardPies'

/** Center-logo press: next mini, then overview (all minis accented). */
export function runPlanPieCenterCycle(input: {
  dispatch: AppDispatch
  planPies: MobilePlanCardPie[]
  cyclePlanPie: () => string | null
}): void {
  if (selectViewAroma(store.getState())) {
    input.dispatch(clearViewAroma())
  }

  const nextPlanPieId = input.cyclePlanPie()
  if (nextPlanPieId == null) return

  const pie = input.planPies.find((entry) => entry.id === nextPlanPieId)
  if (pie?.dispatchDate == null) return

  input.dispatch(
    updateLastViewedCalendarDate({
      year: pie.dispatchDate.year,
      month: pie.dispatchDate.month,
    }),
  )
}
