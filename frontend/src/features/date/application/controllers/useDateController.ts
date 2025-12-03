import { useAppDispatch, useAppSelector } from '@app/hooks'
import { setDate, clearDate } from '../../infrastructure/state'
import {
  selectSelectedDate,
  selectIsDateComplete,
} from '../../infrastructure/selectors'
import type { DispatchDate } from '@entities/date/domain/types'

export const useDateController = () => {
  const dispatch = useAppDispatch()

  const selectedDate = useAppSelector(selectSelectedDate)
  const isDateComplete = useAppSelector(selectIsDateComplete)

  const chooseDate = (date: DispatchDate) => {
    dispatch(setDate(date))
  }

  const clear = () => {
    dispatch(clearDate())
  }

  return {
    state: {
      selectedDate,
      isDateComplete,
    },
    actions: {
      chooseDate,
      clear,
    },
  }
}
