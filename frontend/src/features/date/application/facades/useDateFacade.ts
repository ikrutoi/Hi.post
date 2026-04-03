import { useAppDispatch, useAppSelector } from '@app/hooks'
import { setDate, setSelectedDates, clearDate } from '../../infrastructure/state'
import {
  selectSelectedDate,
  selectSelectedDates,
  selectMergedDispatchDates,
  selectIsDateComplete,
} from '../../infrastructure/selectors'
import type { DispatchDate } from '@entities/date/domain/types'

export const useDateFacade = () => {
  const dispatch = useAppDispatch()
  const selectedDate = useAppSelector(selectSelectedDate)
  const selectedDates = useAppSelector(selectSelectedDates)
  const mergedDispatchDates = useAppSelector(selectMergedDispatchDates)
  const isDateComplete = useAppSelector(selectIsDateComplete)

  const chooseDate = (date: DispatchDate) => {
    dispatch(setDate(date))
  }

  const setManyDates = (dates: DispatchDate[]) => {
    dispatch(setSelectedDates(dates))
  }

  const clear = () => {
    dispatch(clearDate())
  }

  return {
    selectedDate,
    selectedDates,
    mergedDispatchDates,
    isDateComplete,
    format: 'DD.MM.YYYY',
    chooseDate,
    setManyDates,
    clear,
  }
}
