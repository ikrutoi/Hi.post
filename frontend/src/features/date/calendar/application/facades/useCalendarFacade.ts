import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  setPostcardStatuses,
  setPostcardStatusesCount,
  updateLastViewedCalendarDate,
  setHistoryListPanelOpen,
  setDateListPanelOpen,
} from '../../infrastructure/state'
import {
  selectLastCalendarViewDate,
  selectPostcardStatuses,
  selectPostcardStatusesCount,
  selectIsHistoryListPanelOpen,
  selectIsDateListPanelOpen,
} from '../../infrastructure/selectors'
import type { CalendarViewDate } from '@entities/date/domain/types'
import {
  PostcardStatuses,
  PostcardStatusesCount,
} from '@/entities/postcard/domain/types'

export const useCalendarFacade = () => {
  const dispatch = useAppDispatch()
  const lastViewedCalendarDate = useAppSelector(selectLastCalendarViewDate)
  const postcardStatuses = useAppSelector(selectPostcardStatuses)
  const postcardStatusesCount = useAppSelector(selectPostcardStatusesCount)
  const historyListPanelOpen = useAppSelector(selectIsHistoryListPanelOpen)
  const dateListPanelOpen = useAppSelector(selectIsDateListPanelOpen)
  const setCalendarViewDate = (date: CalendarViewDate) => {
    dispatch(updateLastViewedCalendarDate(date))
  }

  return {
    lastViewedCalendarDate,
    postcardStatuses,
    postcardStatusesCount,
    historyListPanelOpen,
    dateListPanelOpen,
    setCalendarViewDate,
    setPostcardStatuses: (statuses: PostcardStatuses) =>
      dispatch(setPostcardStatuses(statuses)),
    setPostcardStatusesCount: (statusesCount: PostcardStatusesCount) =>
      dispatch(setPostcardStatusesCount(statusesCount)),
  }
}
