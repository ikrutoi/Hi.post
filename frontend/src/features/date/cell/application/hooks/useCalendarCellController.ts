import { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useDateFacade } from '../../../application/facades'
import { useCalendarFacade } from '../../../calendar/application/facades'
import {
  closeDayPanel,
  openDayPanel,
  setCardPieListPanelOpen,
  setHistoryListPanelOpen,
  setHistoryListSelectedLocalId,
} from '../../../calendar/infrastructure/state/calendar.slice'
import {
  selectIsCardPieListPanelOpen,
  selectIsDateListPanelOpen,
  selectIsHistoryListPanelOpen,
  selectNotebookStripTab,
  selectOpenDayPanel,
  selectPostcardStatuses,
} from '../../../calendar/infrastructure/selectors/calendar.selector'
import { getHistoryOpenDayPanelPrimaryPostcardLocalId } from '../../../calendar/infrastructure/historyOpenDayPanelPrimaryPostcard'
import { selectCartItems } from '@cart/infrastructure/selectors'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import { shiftMonth } from '../../../calendar/application/helpers'
import { useDateSwitcherController } from '../../../switcher/application/hooks'
import { useSectionMenuFacade } from '@entities/sectionEditorMenu/application/facades'
import type {
  CalendarViewDate,
  DispatchDate,
  MonthDirection,
  Switcher,
} from '@entities/date/domain/types'
import type { HandleCellClickParams } from '../../domain/types'
import type { CardCalendarIndex } from '@entities/card/domain/types'
import { calendarDayHasCards } from '../../domain/calendarDayContent'

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
  const historyListPanelOpen = useAppSelector(selectIsHistoryListPanelOpen)
  const openDayPanelState = useAppSelector(selectOpenDayPanel)
  const cartItems = useAppSelector(selectCartItems)
  const notebookStripTab = useAppSelector(selectNotebookStripTab)
  const cardPieListPanelOpen = useAppSelector(selectIsCardPieListPanelOpen)
  const postcardStatuses = useAppSelector(selectPostcardStatuses)
  const { selectedDate, selectedDates, isMultiDateMode, chooseDate } =
    useDateFacade()

  const { lastViewedCalendarDate } = useCalendarFacade()
  const { activeSection } = useSectionMenuFacade()

  /** Режим «Дата» на полосе календаря: открыть список CardPie при выборе даты, если панель была закрыта. */
  const maybeOpenCardPieListAfterDatePick = useCallback(
    (clickRemovesSelection: boolean) => {
      if (
        activeSection !== 'date' ||
        notebookStripTab === 'cart' ||
        cardPieListPanelOpen ||
        clickRemovesSelection
      ) {
        return
      }
      dispatch(setCardPieListPanelOpen(true))
    },
    [
      activeSection,
      cardPieListPanelOpen,
      dispatch,
      notebookStripTab,
    ],
  )
  const { actions: actionsSwitcherController } = useDateSwitcherController()
  const { decrementMonth, incrementMonth } = actionsSwitcherController

  useEffect(() => {
    if (selectedDate) {
    }
  }, [selectedDate])

  const openHistoryDayPanelWithListHighlight = (
    dateKey: string,
    dayData: CardCalendarIndex,
  ) => {
    if (!historyListPanelOpen) {
      dispatch(setHistoryListPanelOpen(true))
      dispatch(
        updateToolbarIcon({
          section: 'history',
          key: 'listHistory',
          value: 'active',
        }),
      )
    }
    dispatch(openDayPanel({ dateKey, dayData }))
    const primaryLid = getHistoryOpenDayPanelPrimaryPostcardLocalId(
      dayData,
      cartItems,
      postcardStatuses,
    )
    if (primaryLid != null) {
      dispatch(setHistoryListSelectedLocalId(primaryLid))
    }
  }

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

      const isHistorySection = activeSection === 'history'
      /** В закладке корзины календарь только для навигации по дням — не трогаем dispatch-дату редактора / CardPie / список CardPiePanel. */
      const applyDispatchDateSelection =
        !isHistorySection && notebookStripTab !== 'cart'

      if (applyDispatchDateSelection) {
        chooseDate(dispatchDate)
        maybeOpenCardPieListAfterDatePick(clickRemovesSelection)
      }

      if (dateListPanelOpen) {
        dispatch(closeDayPanel())
      } else if (dateKey && dayData && calendarDayHasCards(dayData)) {
        if (isHistorySection) {
          if (openDayPanelState?.dateKey === dateKey) {
            dispatch(closeDayPanel())
          } else {
            openHistoryDayPanelWithListHighlight(dateKey, dayData)
          }
        } else if (!clickRemovesSelection) {
          dispatch(openDayPanel({ dateKey, dayData }))
        } else {
          dispatch(closeDayPanel())
        }
      } else {
        dispatch(closeDayPanel())
      }
    }

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

        const isHistorySection = activeSection === 'history'
        const applyDispatchDateSelection =
          !isHistorySection && notebookStripTab !== 'cart'

        if (applyDispatchDateSelection) {
          chooseDate(dispatchDate)
          maybeOpenCardPieListAfterDatePick(clickRemovesSelection)
        }

        if (dateListPanelOpen) {
          dispatch(closeDayPanel())
        } else if (dateKey && dayData && calendarDayHasCards(dayData)) {
          if (isHistorySection) {
            if (openDayPanelState?.dateKey === dateKey) {
              dispatch(closeDayPanel())
            } else {
              openHistoryDayPanelWithListHighlight(dateKey, dayData)
            }
          } else if (!clickRemovesSelection) {
            dispatch(openDayPanel({ dateKey, dayData }))
          } else {
            dispatch(closeDayPanel())
          }
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
