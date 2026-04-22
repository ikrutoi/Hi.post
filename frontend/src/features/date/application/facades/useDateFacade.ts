import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  pickDispatchDate,
  setSelectedDates,
  clearDate,
  // setHistoryMode,
} from '../../infrastructure/state'
import {
  selectSelectedDate,
  selectSelectedDates,
  selectMergedDispatchDates,
  selectIsMultiDateMode,
  selectIsDateComplete,
  // selectIsHistoryMode,
} from '../../infrastructure/selectors'
import type { DispatchDate } from '@entities/date/domain/types'

export const useDateFacade = () => {
  const dispatch = useAppDispatch()
  const selectedDate = useAppSelector(selectSelectedDate)
  const selectedDates = useAppSelector(selectSelectedDates)
  const mergedDispatchDates = useAppSelector(selectMergedDispatchDates)
  const isMultiDateMode = useAppSelector(selectIsMultiDateMode)
  // const isHistoryMode = useAppSelector(selectIsHistoryMode)
  const isDateComplete = useAppSelector(selectIsDateComplete)

  const chooseDate = (date: DispatchDate) => {
    dispatch(pickDispatchDate(date))
  }

  const setManyDates = (dates: DispatchDate[]) => {
    dispatch(setSelectedDates(dates))
  }

  // const toggleHistoryMode = (enabled: boolean) => {
  //   dispatch(setHistoryMode(enabled))
  // }

  const clear = () => {
    dispatch(clearDate())
  }

  return {
    selectedDate,
    selectedDates,
    mergedDispatchDates,
    isMultiDateMode,
    isDateComplete,
    // isHistoryMode,
    format: 'DD.MM.YYYY',
    chooseDate,
    setManyDates,
    // toggleHistoryMode,
    clear,
  }
}
