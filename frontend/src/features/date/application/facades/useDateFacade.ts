import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  updateDispatchDate,
  resetDispatchDate,
} from '@features/date/infrastructure/state'
import { selectDispatchDate } from '@features/date/infrastructure/selectors'
import type { DispatchDate } from '@entities/date/domain/types'

export const useDateFacade = () => {
  const dispatch = useAppDispatch()
  const selectedDispatchDate = useAppSelector(selectDispatchDate)

  const setSelectedDispatchDate = (payload: DispatchDate) => {
    dispatch(updateDispatchDate(payload))
  }

  const resetSelectedDispatchDate = () => {
    dispatch(resetDispatchDate())
  }

  const isSelected = selectedDispatchDate !== null

  return {
    state: {
      selectedDispatchDate,
      isSelected,
    },
    actions: {
      setSelectedDispatchDate,
      resetSelectedDispatchDate,
    },
  }
}
