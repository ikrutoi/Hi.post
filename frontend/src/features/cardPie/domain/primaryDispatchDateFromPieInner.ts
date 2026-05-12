import type { DispatchDate } from '@entities/date/domain/types'
import { POSTCARD_DISPATCH_DATE_FALLBACK } from '@entities/postcard'
import type { CardPieInnerData } from '@features/cardPie/infrastructure/postcardCardPieViewModel'

function isFilledDispatchDate(d: DispatchDate | null | undefined): d is DispatchDate {
  return (
    d != null &&
    !(
      d.year === POSTCARD_DISPATCH_DATE_FALLBACK.year &&
      d.month === POSTCARD_DISPATCH_DATE_FALLBACK.month &&
      d.day === POSTCARD_DISPATCH_DATE_FALLBACK.day
    )
  )
}

/** Первая подходящая дата отправки из данных секции CardPie (список / одиночная). */
export function primaryDispatchDateFromPieInner(
  inner: CardPieInnerData | null,
): DispatchDate | null {
  if (inner == null) return null
  if (inner.dates.length > 0 && isFilledDispatchDate(inner.dates[0])) {
    return inner.dates[0]
  }
  if (isFilledDispatchDate(inner.date)) return inner.date
  return null
}
