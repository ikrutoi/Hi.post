import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  updateDispatchDate,
  resetDispatchDate,
} from '../../infrastructure/state'
import { selectDispatchDate } from '../../infrastructure/selectors'
import type { DispatchDate } from '@entities/date/domain/types'

export const useDateController = () => {
  const dispatch = useAppDispatch()
  const dispatchDate = useAppSelector(selectDispatchDate)

  const setDispatchDate = (payload: DispatchDate) => {
    dispatch(updateDispatchDate(payload))
  }

  const isDateSelected = dispatchDate !== null

  return {
    dispatchDate,
    setDispatchDate,
    resetDispatchDate,
    isDateSelected,
  }
}
