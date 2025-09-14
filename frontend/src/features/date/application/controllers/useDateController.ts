import { useAppDispatch, useAppSelector } from '@app/hooks'
import { updateDispatchDate } from '../state/date.slice'
import { selectDispatchDate } from '../selectors/date.selector'
import type { DispatchDate } from '@entities/date/domain/types'

export const useDateController = () => {
  const dispatch = useAppDispatch()
  const dispatchDate = useAppSelector(selectDispatchDate)

  const setDispatchDate = (payload: DispatchDate) => {
    dispatch(updateDispatchDate(payload))
  }

  const resetDispatchDate = () => {
    dispatch(updateDispatchDate({ isSelected: false }))
  }

  const isDateSelected = dispatchDate.isSelected

  return {
    dispatchDate,
    setDispatchDate,
    resetDispatchDate,
    isDateSelected,
  }
}
