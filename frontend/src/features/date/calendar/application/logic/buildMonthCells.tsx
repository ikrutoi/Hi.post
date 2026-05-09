import { useAppSelector } from '@app/hooks'
import { selectCardphotoPreview } from '@cardphoto/infrastructure/selectors'
import {
  selectCartCalendarDatePickMode,
  selectNotebookStripTab,
} from '@date/calendar/infrastructure/selectors'
import { Cell } from '@date/cell/presentation/Cell'
import { CardPreview } from '@features/date/cardPreview/presentation/CardPreview'
import { shiftMonth } from '../helpers'
import { isDisabledDate } from '@entities/date/utils'
import { useSectionMenuFacade } from '@entities/sectionEditorMenu/application/facades'
import { shouldAdjacentSessionPlaceholderNavSwap } from './adjacentSessionPlaceholderNavSwap'
import type {
  CalendarViewDate,
  DispatchDate,
} from '@entities/date/domain/types'
import type { MonthDirection } from '@entities/date/domain/types'
import type { HandleCellClickParams } from '../../../cell/domain/types'
import type { CardCalendarIndex } from '@entities/card/domain/types'
import type { CardSection } from '@shared/config/constants'
import {
  calendarDayHasCards,
  isEmptyCalendarDay,
} from '../../../cell/domain/calendarDayContent'

interface BuildMonthCellsParams {
  days: number[]
  direction: MonthDirection
  calendarViewDate: CalendarViewDate
  highlightDates: DispatchDate[]
  currentDate: { day: number; month: number; year: number }
  handleClickCell: (params: HandleCellClickParams) => void
  chooseDate?: (date: DispatchDate) => void
  cardsMap: Record<string, CardCalendarIndex>
}

export const buildMonthCells = ({
  days,
  direction,
  calendarViewDate,
  highlightDates,
  currentDate,
  handleClickCell,
  chooseDate,
  cardsMap,
}: BuildMonthCellsParams) => {
  const { activeSection } = useSectionMenuFacade()
  const photoPreview = useAppSelector(selectCardphotoPreview)
  const notebookStripTab = useAppSelector(selectNotebookStripTab)
  const cartCalendarDatePickMode = useAppSelector(selectCartCalendarDatePickMode)
  const isCartCalendarStrip =
    activeSection === 'date' && notebookStripTab === 'cart'
  const cardPreviewSection: CardSection | 'cart' | null =
    activeSection === 'history'
      ? 'history'
      : isCartCalendarStrip
        ? 'cart'
        : activeSection
  if (!calendarViewDate) return []

  const { year: currentViewYear, month: currentViewMonth } = shiftMonth(
    calendarViewDate,
    direction,
  )

  return days.map((day) => {
    const dateKey = `${currentViewYear}-${currentViewMonth}-${day}`
    const dayData = cardsMap[dateKey]

    const isToday =
      day === currentDate.day &&
      currentViewMonth === currentDate.month &&
      currentViewYear === currentDate.year

    const isSelectedDate =
      activeSection !== 'history' &&
      highlightDates.some(
        (d) =>
          d.year === currentViewYear &&
          d.month === currentViewMonth &&
          d.day === day,
      )

    const cellDate = {
      year: currentViewYear,
      month: currentViewMonth,
    }

    const adjacentSessionPlaceholderNavSwap =
      shouldAdjacentSessionPlaceholderNavSwap({
        direction,
        isSelectedDate,
        activeSection,
        dayData,
        photoPreview,
        cartListPanelOpen: isCartCalendarStrip,
      })

    const isDisabled = isDisabledDate(day, cellDate, currentDate)

    const historyEmptyNoPreview =
      activeSection === 'history' &&
      direction === 'current' &&
      isEmptyCalendarDay(dayData) &&
      !isDisabled

    /** История: dayBefore/dayAfter с открытками на день — pointer. */
    const historyAdjacentPointer =
      activeSection === 'history' &&
      direction !== 'current' &&
      dayData != null &&
      calendarDayHasCards(dayData) &&
      !isDisabled

    /** Дата: dayBefore/dayAfter не disabled — выбор даты / панель дня, pointer (не полоска «Корзина»). */
    const dateAdjacentPointer =
      activeSection === 'date' &&
      direction !== 'current' &&
      !isDisabled &&
      !isCartCalendarStrip

    const adjacentMonthPointer = historyAdjacentPointer || dateAdjacentPointer
    /**
     * В режиме Корзина pointer только у дней текущего месяца с превью; соседний месяц — обычный курсор.
     * Дни из merged dispatch (ветки шаблонов / список CardPiePanel) не помечаем pointer — иначе при тех же датах в корзине остаётся «рука».
     */
    const cartPreviewPointer =
      isCartCalendarStrip &&
      direction === 'current' &&
      dayData != null &&
      calendarDayHasCards(dayData) &&
      !isSelectedDate

    const cartDateEditPickBorder =
      isCartCalendarStrip && cartCalendarDatePickMode && !isDisabled

    const dateStripEnabledDayBorder =
      activeSection === 'date' && !isCartCalendarStrip && !isDisabled

    return (
      <Cell
        key={`${direction}-${day}`}
        {...(direction === 'before' ? { dayBefore: day } : {})}
        {...(direction === 'current' ? { dayCurrent: day } : {})}
        {...(direction === 'after' ? { dayAfter: day } : {})}
        calendarViewDate={calendarViewDate}
        direction={direction}
        isToday={isToday}
        isDisabledDate={isDisabled}
        isSelectedDate={isSelectedDate}
        onClickCell={handleClickCell}
        dateKey={dateKey}
        dayData={dayData}
        adjacentSessionPlaceholderNavSwap={adjacentSessionPlaceholderNavSwap}
        historyEmptyNoPreview={historyEmptyNoPreview}
        adjacentMonthPointer={adjacentMonthPointer}
        cartPreviewPointer={cartPreviewPointer}
        cartDateEditPickBorder={cartDateEditPickBorder}
        dateStripEnabledDayBorder={dateStripEnabledDayBorder}
        suppressDispatchSelectionStyle={isCartCalendarStrip}
      >
        {dayData && (
          <CardPreview
            data={dayData}
            section={cardPreviewSection}
            isSelectedDate={isSelectedDate}
            isDisabledDate={isDisabled}
            calendarDispatchDate={{
              year: currentViewYear,
              month: currentViewMonth,
              day,
            }}
            adjacentSessionPlaceholderNavSwap={adjacentSessionPlaceholderNavSwap}
            isAdjacentMonthEdge={direction !== 'current'}
          />
        )}
      </Cell>
    )
  })
}
