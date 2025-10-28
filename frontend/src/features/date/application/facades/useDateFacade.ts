import { useAppDispatch, useAppSelector } from '@app/hooks'
import { dateActions } from '@features/date/infrastructure/state'
import { selectDispatchDate } from '@features/date/infrastructure/selectors'
import type { DispatchDate } from '@entities/date/domain/types'

export const useDateFacade = () => {
  const dispatch = useAppDispatch()
  const dispatchDate = useAppSelector(selectDispatchDate)

  const setDispatchDate = (payload: DispatchDate) => {
    dispatch(dateActions.updateDispatchDate(payload))
  }

  const reset = () => {
    dispatch(dateActions.resetDispatchDate())
  }

  const isSelected = dispatchDate.isSelected

  return {
    state: {
      dispatchDate,
      isSelected,
    },
    actions: {
      setDispatchDate,
      reset,
    },
  }
}
