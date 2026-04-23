import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useDateFacade } from '../../../application/facades'
import { useCalendarFacade } from '../../../calendar/application/facades'
import {
  closeDayPanel,
  openDayPanel,
} from '../../../calendar/infrastructure/state/calendar.slice'
import { selectIsDateListPanelOpen } from '../../../calendar/infrastructure/selectors/calendar.selector'
import { shiftMonth } from '../../../calendar/application/helpers'
import { useSwitcherFacade } from '../../../switcher/application/facades'
import { useDateSwitcherController } from '../../../switcher/application/hooks'
import type {
  CalendarViewDate,
  DispatchDate,
  MonthDirection,
  Switcher,
} from '@entities/date/domain/types'
import type { CardCalendarIndex } from '@entities/card/domain/types'
import type { HandleCellClickParams } from '../../domain/types'

function hasCards(dayData: CardCalendarIndex): boolean {
  return (
    !!dayData.processed ||
    dayData.cart.length > 0 ||
    dayData.ready.length > 0 ||
    dayData.sent.length > 0 ||
    dayData.delivered.length > 0 ||
    dayData.error.length > 0
  )
}

function sameDispatchDate(a: DispatchDate, b: DispatchDate): boolean {
  return a.year === b.year && a.month === b.month && a.day === b.day
}

interface UseCalendarCellControllerParams {
  triggerFlash: (part: Switcher) => void
}

export const useCalendarCellController = ({
  triggerFlash,
}: UseCalendarCellControllerParams) => {
  const dispatch = useAppDispatch()
  const dateListPanelOpen = useAppSelector(selectIsDateListPanelOpen)
  const { selectedDate, selectedDates, isMultiDateMode, chooseDate } =
    useDateFacade()

  const { lastViewedCalendarDate } = useCalendarFacade()
  const { actions: actionsSwitcherController } = useDateSwitcherController()
  const { decrementMonth, incrementMonth } = actionsSwitcherController

  useEffect(() => {
    if (selectedDate) {
    }
  }, [selectedDate])

  const handleCellClickLogic = ({
    isDisabledDate,
    dayBefore,
    dayCurrent,
    dayAfter,
    calendarViewDate,
    direction,
    dateKey,
    dayData,
    triggerMonthNav,
  }: HandleCellClickParams) => {
    if (
      direction === 'current' &&
      !isDisabledDate &&
      dayCurrent != null &&
      calendarViewDate?.year != null &&
      calendarViewDate?.month != null
    ) {
      const dispatchDate = {
        year: calendarViewDate.year,
        month: calendarViewDate.month,
        day: dayCurrent,
      }
      const clickRemovesSelection = isMultiDateMode
        ? selectedDates.some((d) => sameDispatchDate(d, dispatchDate))
        : Boolean(selectedDate && sameDispatchDate(selectedDate, dispatchDate))

      chooseDate(dispatchDate)

      /**
       * Список дат открыт — показываем только план (слоты × даты), без drill-down по пайплайну дня
       * (иначе одна строка из корзины, превью корзины и «залипание» при клике на день без карт).
       */
      if (dateListPanelOpen) {
        dispatch(closeDayPanel())
      } else if (
        !clickRemovesSelection &&
        dateKey &&
        dayData &&
        hasCards(dayData)
      ) {
        dispatch(openDayPanel({ dateKey, dayData }))
      } else {
        dispatch(closeDayPanel())
      }
    }

    /** dayBefore / dayAfter: клик вне кнопки листания — как у дня текущего месяца (выбор / панель). */
    if (
      (direction === 'before' || direction === 'after') &&
      triggerMonthNav !== true &&
      !isDisabledDate &&
      calendarViewDate?.year != null &&
      calendarViewDate?.month != null
    ) {
      const day = dayBefore ?? dayAfter ?? null
      if (day != null) {
        const { year, month } = shiftMonth(calendarViewDate, direction)
        const dispatchDate = { year, month, day }
        const clickRemovesSelection = isMultiDateMode
          ? selectedDates.some((d) => sameDispatchDate(d, dispatchDate))
          : Boolean(
              selectedDate && sameDispatchDate(selectedDate, dispatchDate),
            )

        chooseDate(dispatchDate)

        if (dateListPanelOpen) {
          dispatch(closeDayPanel())
        } else if (
          !clickRemovesSelection &&
          dateKey &&
          dayData &&
          hasCards(dayData)
        ) {
          dispatch(openDayPanel({ dateKey, dayData }))
        } else {
          dispatch(closeDayPanel())
        }
      }
    }

    if (direction === 'before' && triggerMonthNav) {
      decrementMonth()
      triggerFlash('month')
      if (lastViewedCalendarDate?.month === 0) {
        triggerFlash('year')
      }
    }

    if (direction === 'after' && triggerMonthNav) {
      incrementMonth()
      triggerFlash('month')
      if (lastViewedCalendarDate?.month === 11) {
        triggerFlash('year')
      }
    }
  }

  return { handleCellClickLogic }
}
