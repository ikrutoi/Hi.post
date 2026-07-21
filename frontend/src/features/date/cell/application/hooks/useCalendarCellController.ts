import { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { setCartListSelectedLocalId, setCartListStatusSegment } from '@cart/infrastructure/state'
import { useDateFacade } from '../../../application/facades'
import { useCalendarFacade } from '../../../calendar/application/facades'
import { isHistoryCalendarStrip } from '../../../calendar/application/logic/calendarStripSection'
import {
  closeDayPanel,
  openDayPanel,
  setCardPieListPanelOpen,
  setHistoryListPanelOpen,
  setHistoryListSelectedLocalId,
  updateLastViewedCalendarDate,
} from '../../../calendar/infrastructure/state/calendar.slice'
import {
  selectCartCalendarDatePickLocalId,
  selectCartCalendarDatePickMode,
  selectHistoryListSelectedLocalId,
  selectIsCardPieListPanelOpen,
  selectIsDateListPanelOpen,
  selectIsHistoryListPanelOpen,
  selectNotebookStripTab,
  selectOpenDayPanel,
  selectPostcardStatuses,
} from '../../../calendar/infrastructure/selectors/calendar.selector'
import {
  selectCartListSelectedLocalId,
  selectCartListStatusSegment,
} from '@cart/infrastructure/selectors/cartSelectors'
import { cartCalendarDatePickApplied } from '../../../calendar/application/orchestration/notebookOrchestration.events'
import { getHistoryOpenDayPanelPrimaryPostcardLocalId } from '../../../calendar/infrastructure/historyOpenDayPanelPrimaryPostcard'
import {
  nextCyclicLocalId,
  orderedHistoryDayLocalIds,
} from '../../../calendar/infrastructure/calendarDayPostcardCycle'
import { resolveCartStripDayPostcardSelection, cartListStatusSegmentForLocalId } from '../../../calendar/application/logic/cartStripDayPostcardSelection'
import { selectCartItems } from '@cart/infrastructure/selectors'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import { dispatchCardPieToolbarIconState } from '@toolbar/application/syncCardPieToolbarIcons'
import { selectIsMobileLayout } from '@features/layout/infrastructure/selectors/size.selectors'
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
  const isMobileLayout = useAppSelector(selectIsMobileLayout)
  const postcardStatuses = useAppSelector(selectPostcardStatuses)
  const cartCalendarDatePickMode = useAppSelector(
    selectCartCalendarDatePickMode,
  )
  const cartCalendarDatePickLocalId = useAppSelector(
    selectCartCalendarDatePickLocalId,
  )
  const listSelectedLocalId = useAppSelector(selectCartListSelectedLocalId)
  const cartListStatusSegment = useAppSelector(selectCartListStatusSegment)
  const historyListSelectedLocalId = useAppSelector(
    selectHistoryListSelectedLocalId,
  )
  const { selectedDate, selectedDates, isMultiDateMode, chooseDate } =
    useDateFacade()

  const { lastViewedCalendarDate } = useCalendarFacade()
  const { activeSection } = useSectionMenuFacade()

  /** Режим «Дата» на полосе календаря: открыть список CardPie при выборе даты, если панель была закрыта. */
  const maybeOpenCardPieListAfterDatePick = useCallback(
    (clickRemovesSelection: boolean) => {
      if (isMobileLayout) {
        if (cardPieListPanelOpen) {
          dispatch(setCardPieListPanelOpen(false))
          dispatchCardPieToolbarIconState(dispatch, false)
        }
        return
      }
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
      isMobileLayout,
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
    if (!isMobileLayout) {
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
    } else {
      dispatch(openDayPanel({ dateKey, dayData }))
    }
    const primaryLid = getHistoryOpenDayPanelPrimaryPostcardLocalId(
      dayData,
      cartItems,
      postcardStatuses,
    )
    if (primaryLid != null) {
      dispatch(setHistoryListSelectedLocalId(primaryLid))
      const postcard = cartItems.find((p) => p.localId === primaryLid)
      if (postcard?.date != null) {
        dispatch(
          updateLastViewedCalendarDate({
            year: postcard.date.year,
            month: postcard.date.month,
          }),
        )
      }
    }
  }

  const openCartDayPanelWithListHighlight = (
    dateKey: string,
    dayData: CardCalendarIndex,
  ) => {
    const result = resolveCartStripDayPostcardSelection({
      dateKey,
      dayData,
      cartItems,
      openDayPanelDateKey: openDayPanelState?.dateKey,
      listSelectedLocalId,
      listStatusSegment: cartListStatusSegment,
      notebookStripTabIsCart: notebookStripTab === 'cart',
    })

    const syncViewToPostcardMonth = (localId: number) => {
      const postcard = cartItems.find((p) => p.localId === localId)
      if (postcard?.date == null) return
      /** Основной месяц даты отправки — не соседний месяц сетки (dayAfter/dayBefore). */
      dispatch(
        updateLastViewedCalendarDate({
          year: postcard.date.year,
          month: postcard.date.month,
        }),
      )
    }

    if (result.kind === 'cycle') {
      dispatch(
        setCartListStatusSegment(
          cartListStatusSegmentForLocalId(cartItems, result.localId),
        ),
      )
      dispatch(setCartListSelectedLocalId(result.localId))
      syncViewToPostcardMonth(result.localId)
      return
    }

    dispatch(openDayPanel({ dateKey, dayData }))
    if (result.localId == null) return
    dispatch(
      setCartListStatusSegment(
        cartListStatusSegmentForLocalId(cartItems, result.localId),
      ),
    )
    dispatch(setCartListSelectedLocalId(result.localId))
    syncViewToPostcardMonth(result.localId)
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
    /**
     * Полоса «Корзина» + dateEdit / cardPieEdit: клик по доступному дню применяет новую дату
     * к открытке `localId` и переводит сегмент списка на `cart` (см. `cartCalendarDatePickSaga`).
     * Режим pick не сбрасывается — можно сразу выбрать другую дату.
     */
    if (
      notebookStripTab === 'cart' &&
      cartCalendarDatePickMode &&
      cartCalendarDatePickLocalId != null &&
      !isDisabledDate &&
      triggerMonthNav !== true &&
      calendarViewDate?.year != null &&
      calendarViewDate?.month != null
    ) {
      let pickedDate: DispatchDate | null = null
      if (direction === 'current' && dayCurrent != null) {
        pickedDate = {
          year: calendarViewDate.year,
          month: calendarViewDate.month,
          day: dayCurrent,
        }
      } else if (direction === 'before' || direction === 'after') {
        const day = dayBefore ?? dayAfter ?? null
        if (day != null) {
          const { year, month } = shiftMonth(calendarViewDate, direction)
          pickedDate = { year, month, day }
        }
      }
      if (pickedDate) {
        dispatch(
          cartCalendarDatePickApplied({
            localId: cartCalendarDatePickLocalId,
            date: pickedDate,
          }),
        )
        return
      }
    }

    const allowCartDayClickWhenDisabled =
      notebookStripTab === 'cart' &&
      Boolean(dayData) &&
      calendarDayHasCards(dayData)

    if (
      direction === 'current' &&
      (!isDisabledDate || allowCartDayClickWhenDisabled) &&
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

      const isHistorySection = isHistoryCalendarStrip(
        activeSection,
        notebookStripTab,
      )
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
        if (notebookStripTab === 'cart') {
          openCartDayPanelWithListHighlight(dateKey, dayData)
        } else if (isHistorySection) {
          const historyLids = orderedHistoryDayLocalIds(
            dayData,
            cartItems,
            postcardStatuses,
          )
          if (openDayPanelState?.dateKey === dateKey) {
            if (historyLids.length > 1) {
              const next = nextCyclicLocalId(
                historyLids,
                historyListSelectedLocalId,
              )
              if (next != null) {
                dispatch(setHistoryListSelectedLocalId(next))
              }
            } else {
              dispatch(closeDayPanel())
            }
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
      (!isDisabledDate || allowCartDayClickWhenDisabled) &&
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

        const isHistorySection = isHistoryCalendarStrip(
          activeSection,
          notebookStripTab,
        )
        const applyDispatchDateSelection =
          !isHistorySection && notebookStripTab !== 'cart'

        if (applyDispatchDateSelection) {
          chooseDate(dispatchDate)
          maybeOpenCardPieListAfterDatePick(clickRemovesSelection)
        }

        if (dateListPanelOpen) {
          dispatch(closeDayPanel())
        } else if (dateKey && dayData && calendarDayHasCards(dayData)) {
          if (notebookStripTab === 'cart') {
            openCartDayPanelWithListHighlight(dateKey, dayData)
          } else if (isHistorySection) {
            const historyLids = orderedHistoryDayLocalIds(
              dayData,
              cartItems,
              postcardStatuses,
            )
            if (openDayPanelState?.dateKey === dateKey) {
              if (historyLids.length > 1) {
                const next = nextCyclicLocalId(
                  historyLids,
                  historyListSelectedLocalId,
                )
                if (next != null) {
                  dispatch(setHistoryListSelectedLocalId(next))
                }
              } else {
                dispatch(closeDayPanel())
              }
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
