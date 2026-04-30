import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  setPostcardStatuses,
  setPostcardStatusesCount,
  updateLastViewedCalendarDate,
  setHistoryListPanelOpen,
  setDateListPanelOpen,
  setDateCalendarHistoryOverlay,
} from '../../infrastructure/state'
import {
  selectLastCalendarViewDate,
  selectPostcardStatuses,
  selectPostcardStatusesCount,
  selectIsHistoryListPanelOpen,
  selectIsDateListPanelOpen,
  selectIsCardPieListPanelOpen,
  selectDateCalendarHistoryOverlay,
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
  const cardPieListPanelOpen = useAppSelector(selectIsCardPieListPanelOpen)
  const dateCalendarHistoryOverlay = useAppSelector(
    selectDateCalendarHistoryOverlay,
  )
  const setCalendarViewDate = (date: CalendarViewDate) => {
    dispatch(updateLastViewedCalendarDate(date))
  }

  return {
    lastViewedCalendarDate,
    postcardStatuses,
    postcardStatusesCount,
    historyListPanelOpen,
    dateListPanelOpen,
    cardPieListPanelOpen,
    dateCalendarHistoryOverlay,
    setCalendarViewDate,
    setDateCalendarHistoryOverlay: (value: boolean) =>
      dispatch(setDateCalendarHistoryOverlay(value)),
    setPostcardStatuses: (statuses: PostcardStatuses) =>
      dispatch(setPostcardStatuses(statuses)),
    setPostcardStatusesCount: (statusesCount: PostcardStatusesCount) =>
      dispatch(setPostcardStatusesCount(statusesCount)),
  }
}
