import { useMemo } from 'react'
import { useAppSelector } from '@app/hooks'
import {
  selectAppliedDates,
  selectDraftDispatchDates,
} from '@date/infrastructure/selectors'
import { dispatchPriceLineForDate } from '@date/domain/dispatchPriceTable'

/**
 * Цена даты, которую сейчас выбирают в календаре.
 * Черновик важнее уже применённой даты: цифра на марке смотрит туда же.
 * Несколько дат — цена первой. Строки плана считают каждую дату отдельно.
 */
export function useDispatchPriceLine(): string {
  const draftDates = useAppSelector(selectDraftDispatchDates)
  const appliedDates = useAppSelector(selectAppliedDates)
  const date = draftDates[0] ?? appliedDates[0] ?? null
  const year = date?.year
  const month = date?.month
  const day = date?.day

  return useMemo(
    () =>
      dispatchPriceLineForDate(
        year == null || month == null || day == null
          ? null
          : { year, month, day },
      ),
    [year, month, day],
  )
}
