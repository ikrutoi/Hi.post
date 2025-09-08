import { useAppDispatch, useAppSelector } from '@app/hooks'
import { updateDispatchDate } from '../state/dateSlice'
import { selectDispatchDate } from '../state/dateSelectors'
import type { DispatchDate } from '../../domain'

export const useDateFacade = () => {
  const dispatch = useAppDispatch()
  const dispatchDate = useAppSelector(selectDispatchDate)

  const setDispatchDate = (payload: DispatchDate) => {
    dispatch(updateDispatchDate(payload))
  }

  return {
    dispatchDate,
    setDispatchDate,
  }
}
