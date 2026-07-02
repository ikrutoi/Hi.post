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
import {
  isCartCalendarStrip,
  isHistoryCalendarStrip,
  resolveCardPreviewSection,
} from './calendarStripSection'
import type {
  CalendarViewDate,
  DispatchDate,
} from '@entities/date/domain/types'
import type { MonthDirection } from '@entities/date/domain/types'
import type { HandleCellClickParams } from '../../../cell/domain/types'
import type { CardCalendarIndex } from '@entities/card/domain/types'
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
  /** Волна рамки при dateEdit (полоса «Корзина», порядок сетки: before → current → after). */
  cartDatePickWaveStrongKeys?: ReadonlySet<string>
  cartDatePickWaveFadingKey?: string | null
  /** День отправки открытки с правым CardPie из списка (корзина / история). */
  rightArchiveCardPieHighlightDate?: DispatchDate | null
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
  cartDatePickWaveStrongKeys,
  cartDatePickWaveFadingKey,
  rightArchiveCardPieHighlightDate,
}: BuildMonthCellsParams) => {
  const { activeSection } = useSectionMenuFacade()
  const photoPreview = useAppSelector(selectCardphotoPreview)
  const notebookStripTab = useAppSelector(selectNotebookStripTab)
  const cartCalendarDatePickMode = useAppSelector(selectCartCalendarDatePickMode)
  const cartCalendarStrip = isCartCalendarStrip(activeSection, notebookStripTab)
  const historyCalendarStrip = isHistoryCalendarStrip(
    activeSection,
    notebookStripTab,
  )
  const cardPreviewSection = resolveCardPreviewSection(
    activeSection,
    notebookStripTab,
  )
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
      !historyCalendarStrip &&
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
        cartListPanelOpen: cartCalendarStrip,
        historyCalendarStrip,
      })

    const isDisabled = isDisabledDate(day, cellDate, currentDate)

    const historyEmptyNoPreview =
      historyCalendarStrip &&
      direction === 'current' &&
      isEmptyCalendarDay(dayData) &&
      !isDisabled

    /** История: dayBefore/dayAfter с открытками на день — pointer. */
    const historyAdjacentPointer =
      historyCalendarStrip &&
      direction !== 'current' &&
      dayData != null &&
      calendarDayHasCards(dayData) &&
      !isDisabled

    /** Дата: dayBefore/dayAfter не disabled — выбор даты / панель дня, pointer (не полоска «Корзина»). */
    const dateAdjacentPointer =
      activeSection === 'date' &&
      !historyCalendarStrip &&
      direction !== 'current' &&
      !isDisabled &&
      !cartCalendarStrip

    const adjacentMonthPointer = historyAdjacentPointer || dateAdjacentPointer
    /**
     * В режиме Корзина pointer только у дней текущего месяца с превью; соседний месяц — обычный курсор.
     * Дни из merged dispatch (ветки шаблонов / список CardPiePanel) не помечаем pointer — иначе при тех же датах в корзине остаётся «рука».
     */
    const cartPreviewPointer =
      cartCalendarStrip &&
      direction === 'current' &&
      dayData != null &&
      calendarDayHasCards(dayData) &&
      !isSelectedDate

    const cartDateEditPickBorder =
      cartCalendarStrip && cartCalendarDatePickMode && !isDisabled

    const dateStripEnabledDayBorder =
      activeSection === 'date' && !cartCalendarStrip && !isDisabled

    const cartDatePickWaveStrong =
      cartDateEditPickBorder &&
      Boolean(dateKey && cartDatePickWaveStrongKeys?.has(dateKey))
    const cartDatePickWaveFading =
      cartDateEditPickBorder &&
      Boolean(dateKey && cartDatePickWaveFadingKey === dateKey)

    const isRightArchiveCardPieDay =
      rightArchiveCardPieHighlightDate != null &&
      rightArchiveCardPieHighlightDate.year === currentViewYear &&
      rightArchiveCardPieHighlightDate.month === currentViewMonth &&
      rightArchiveCardPieHighlightDate.day === day

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
        cartDatePickWaveStrong={cartDatePickWaveStrong}
        cartDatePickWaveFading={cartDatePickWaveFading}
        dateStripEnabledDayBorder={dateStripEnabledDayBorder}
        suppressDispatchSelectionStyle={cartCalendarStrip}
        rightArchiveCardPieDay={isRightArchiveCardPieDay}
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
