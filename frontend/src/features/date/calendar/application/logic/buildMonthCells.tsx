import { useAppSelector } from '@app/hooks'
import { selectCardphotoPreview } from '@cardphoto/infrastructure/selectors'
import { Cell } from '@date/cell/presentation/Cell'
import { CardPreview } from '@features/date/cardPreview/presentation/CardPreview'
import { shiftMonth } from '../helpers'
import { isDisabledDate } from '@entities/date/utils'
import { useSectionMenuFacade } from '@entities/sectionEditorMenu/application/facades'
import {
  shouldAdjacentMonthDimCardphotoPreview,
  shouldAdjacentSessionPlaceholderNavSwap,
} from './adjacentSessionPlaceholderNavSwap'
import type {
  CalendarViewDate,
  DispatchDate,
} from '@entities/date/domain/types'
import type { MonthDirection } from '@entities/date/domain/types'
import type { HandleCellClickParams } from '../../../cell/domain/types'
import type { CardCalendarIndex } from '@entities/card/domain/types'

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
      })

    const adjacentMonthCardphotoDim = shouldAdjacentMonthDimCardphotoPreview({
      direction,
      isSelectedDate,
      activeSection,
      photoPreview,
    })

    return (
      <Cell
        key={`${direction}-${day}`}
        {...(direction === 'before' ? { dayBefore: day } : {})}
        {...(direction === 'current' ? { dayCurrent: day } : {})}
        {...(direction === 'after' ? { dayAfter: day } : {})}
        calendarViewDate={calendarViewDate}
        direction={direction}
        isToday={isToday}
        isDisabledDate={isDisabledDate(day, cellDate, currentDate)}
        isSelectedDate={isSelectedDate}
        onClickCell={handleClickCell}
        dateKey={dateKey}
        dayData={dayData}
        adjacentSessionPlaceholderNavSwap={adjacentSessionPlaceholderNavSwap}
        adjacentMonthCardphotoDim={adjacentMonthCardphotoDim}
      >
        {dayData && (
          <CardPreview
            data={dayData}
            section={activeSection}
            isSelectedDate={isSelectedDate}
            calendarDispatchDate={{
              year: currentViewYear,
              month: currentViewMonth,
              day,
            }}
            adjacentSessionPlaceholderNavSwap={adjacentSessionPlaceholderNavSwap}
          />
        )}
      </Cell>
    )
  })
}
