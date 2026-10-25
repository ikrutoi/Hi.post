import type { DispatchDate } from '@entities/date/domain/types'
import { markStampYearCountFromDispatch } from '@envelope/domain/markStampYearDigit'

/** Первый год отправки. Единственное место, где меняется базовая цена. */
export const DISPATCH_PRICE_BASE_USD = 7

/** Цена на сотом году и на любом более дальнем сроке. */
export const DISPATCH_PRICE_MAX_USD = 1_000_000

export const DISPATCH_PRICE_YEAR_COUNT = 100

/**
 * Насколько круче концы относительно середины.
 * 0 — ровная экспонента. Больше значение — круче первый и последний участки,
 * середина спокойнее. Кривая симметрична: год N и год (101−N) дают в произведении
 * базу × потолок.
 */
export const DISPATCH_PRICE_END_BEND = 2.95

function symmetricProgress(t: number): number {
  const bend = DISPATCH_PRICE_END_BEND
  if (bend === 0) return t
  const rise = Math.sinh(bend * (2 * t - 1))
  return (rise + Math.sinh(bend)) / (2 * Math.sinh(bend))
}

/**
 * Симметричная экспонента: первый год — база, сотый — потолок.
 * Подъём круче в начале и в конце, середина между ними спокойнее.
 * Промежуточные годы — целые доллары.
 */
function buildDispatchPriceUsdByYear(): readonly number[] {
  const logRatio = Math.log(DISPATCH_PRICE_MAX_USD / DISPATCH_PRICE_BASE_USD)
  const lastIndex = DISPATCH_PRICE_YEAR_COUNT - 1
  const rows: number[] = []

  for (let year = 1; year <= DISPATCH_PRICE_YEAR_COUNT; year += 1) {
    if (year === 1) {
      rows.push(DISPATCH_PRICE_BASE_USD)
      continue
    }
    if (year === DISPATCH_PRICE_YEAR_COUNT) {
      rows.push(DISPATCH_PRICE_MAX_USD)
      continue
    }
    const t = (year - 1) / lastIndex
    const amount = DISPATCH_PRICE_BASE_USD * Math.exp(logRatio * symmetricProgress(t))
    rows.push(Math.round(amount))
  }

  return rows
}

/** Индекс 0 — первый год, индекс 99 — сотый. Дальше таблицу не читают. */
export const DISPATCH_PRICE_USD_BY_YEAR: readonly number[] =
  buildDispatchPriceUsdByYear()

export function formatDispatchPriceLine(amountUsd: number): string {
  return `${amountUsd.toFixed(2)} USD`
}

/** `null` и нечисло — базовая цена. Срок короче 1 и длиннее 100 прижимается к краям таблицы. */
export function dispatchPriceUsdForYearStep(yearStep: number | null): number {
  if (yearStep == null || !Number.isFinite(yearStep)) {
    return DISPATCH_PRICE_USD_BY_YEAR[0]
  }
  const step = Math.min(
    DISPATCH_PRICE_YEAR_COUNT,
    Math.max(1, Math.ceil(yearStep)),
  )
  return DISPATCH_PRICE_USD_BY_YEAR[step - 1]
}

/**
 * Цена выбранной даты. Срок 1…100 — тот же, что цифра на марке.
 * Дата не выбрана — базовая цена.
 */
export function dispatchPriceLineForDate(
  date: DispatchDate | null | undefined,
  now: Date = new Date(),
): string {
  const yearStep = markStampYearCountFromDispatch(now, date ?? null)
  return formatDispatchPriceLine(dispatchPriceUsdForYearStep(yearStep))
}
