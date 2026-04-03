import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  setDate,
  pickDispatchDate,
  setSelectedDates,
  setMultiDateMode,
  clearDate,
} from '../../infrastructure/state'
import {
  selectSelectedDate,
  selectSelectedDates,
  selectMergedDispatchDates,
  selectIsMultiDateMode,
  selectIsDateComplete,
} from '../../infrastructure/selectors'
import type { DispatchDate } from '@entities/date/domain/types'

export const useDateFacade = () => {
  const dispatch = useAppDispatch()
  const selectedDate = useAppSelector(selectSelectedDate)
  const selectedDates = useAppSelector(selectSelectedDates)
  const mergedDispatchDates = useAppSelector(selectMergedDispatchDates)
  const isMultiDateMode = useAppSelector(selectIsMultiDateMode)
  const isDateComplete = useAppSelector(selectIsDateComplete)

  const chooseDate = (date: DispatchDate) => {
    dispatch(pickDispatchDate(date))
  }

  const setManyDates = (dates: DispatchDate[]) => {
    dispatch(setSelectedDates(dates))
  }

  const toggleMultiDateMode = (enabled: boolean) => {
    dispatch(setMultiDateMode(enabled))
  }

  const clear = () => {
    dispatch(clearDate())
  }

  return {
    selectedDate,
    selectedDates,
    mergedDispatchDates,
    isMultiDateMode,
    isDateComplete,
    format: 'DD.MM.YYYY',
    chooseDate,
    setManyDates,
    toggleMultiDateMode,
    clear,
  }
}
