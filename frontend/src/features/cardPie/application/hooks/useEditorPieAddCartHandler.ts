import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { addEditorPiePlanToCart } from '@date/infrastructure/state'
import { useDispatchPlanListEntries } from '@date/application/hooks/useDispatchPlanListEntries'
import { selectCardPieListSortDirection } from '@date/calendar/infrastructure/selectors'
import type { IconKey } from '@shared/config/constants'
import { resolveEditorPieAddCartPayload } from '../helpers/resolveEditorPieAddCartPayload'

type PlanPieBranch = {
  dispatchBranchKey: string | null
}

export function useEditorPieAddCartHandler(options: {
  planPies?: PlanPieBranch[]
  selectedPlanPie?: PlanPieBranch | null
  onEditorPieToolbarAction?: (key: IconKey) => void | false
}) {
  const dispatch = useAppDispatch()
  const listSortDirection = useAppSelector(selectCardPieListSortDirection)
  const planEntries = useDispatchPlanListEntries({
    activeModeOnly: true,
    listSortDirection,
    showUndatedWhenAnySectionSelected: true,
    hideBranchesInCart: false,
  })
  const planPies = options.planPies ?? []
  const selectedPlanPie = options.selectedPlanPie ?? null
  const onEditorPieToolbarAction = options.onEditorPieToolbarAction

  return useCallback(
    (key: IconKey) => {
      if (key === 'addCart') {
        dispatch(
          addEditorPiePlanToCart(
            resolveEditorPieAddCartPayload({
              planPies,
              selectedPlanPie,
              planEntries,
            }),
          ),
        )
        return false
      }

      return onEditorPieToolbarAction?.(key)
    },
    [
      dispatch,
      onEditorPieToolbarAction,
      planEntries,
      planPies,
      selectedPlanPie,
    ],
  )
}
