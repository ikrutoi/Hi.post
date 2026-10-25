import { describe, expect, it } from 'vitest'
import {
  DISPATCH_PRICE_BASE_USD,
  DISPATCH_PRICE_MAX_USD,
  DISPATCH_PRICE_USD_BY_YEAR,
  DISPATCH_PRICE_YEAR_COUNT,
  dispatchPriceLineForDate,
  dispatchPriceUsdForYearStep,
} from './dispatchPriceTable'

describe('dispatch price table', () => {
  it('has one row per year of the horizon', () => {
    expect(DISPATCH_PRICE_USD_BY_YEAR).toHaveLength(DISPATCH_PRICE_YEAR_COUNT)
    expect(DISPATCH_PRICE_USD_BY_YEAR[0]).toBe(DISPATCH_PRICE_BASE_USD)
    expect(DISPATCH_PRICE_USD_BY_YEAR[99]).toBe(DISPATCH_PRICE_MAX_USD)
  })

  it('rises slowly at first and reaches the cap only at the last year', () => {
    const year2 = DISPATCH_PRICE_USD_BY_YEAR[1]
    const year15 = DISPATCH_PRICE_USD_BY_YEAR[14]
    const year50 = DISPATCH_PRICE_USD_BY_YEAR[49]
    const span = DISPATCH_PRICE_MAX_USD - DISPATCH_PRICE_BASE_USD

    expect(year2).toBeGreaterThan(DISPATCH_PRICE_BASE_USD + 0.5)
    expect(year15).toBeGreaterThan(year2)
    expect(year15 - DISPATCH_PRICE_BASE_USD).toBeLessThan(span * 0.01)
    expect(year50).toBeGreaterThan(year15)
    expect(year50).toBeLessThan(DISPATCH_PRICE_MAX_USD / 10)
    expect(DISPATCH_PRICE_USD_BY_YEAR[89]).toBeGreaterThan(year50)

    const ends = DISPATCH_PRICE_BASE_USD * DISPATCH_PRICE_MAX_USD
    for (const year of [2, 10, 25]) {
      const early = DISPATCH_PRICE_USD_BY_YEAR[year - 1]
      const late = DISPATCH_PRICE_USD_BY_YEAR[DISPATCH_PRICE_YEAR_COUNT - year]
      expect(Math.abs(early * late - ends) / ends).toBeLessThan(0.01)
    }

    for (let i = 1; i < DISPATCH_PRICE_USD_BY_YEAR.length; i += 1) {
      expect(DISPATCH_PRICE_USD_BY_YEAR[i]).toBeGreaterThanOrEqual(
        DISPATCH_PRICE_USD_BY_YEAR[i - 1],
      )
    }
  })

  it('clamps a horizon past 100 years to the last row', () => {
    expect(dispatchPriceUsdForYearStep(null)).toBe(DISPATCH_PRICE_BASE_USD)
    expect(dispatchPriceUsdForYearStep(1)).toBe(DISPATCH_PRICE_BASE_USD)
    expect(dispatchPriceUsdForYearStep(100)).toBe(DISPATCH_PRICE_MAX_USD)
    expect(dispatchPriceUsdForYearStep(140)).toBe(DISPATCH_PRICE_MAX_USD)
  })

  it('prices a near date at the base and a date a century out at the cap', () => {
    const now = new Date(2026, 9, 25)
    expect(
      dispatchPriceLineForDate({ year: 2026, month: 11, day: 15 }, now),
    ).toBe('7.00 USD')
    expect(
      dispatchPriceLineForDate({ year: 2130, month: 0, day: 1 }, now),
    ).toBe('1000000.00 USD')
    expect(dispatchPriceLineForDate(null, now)).toBe('7.00 USD')
  })
})
