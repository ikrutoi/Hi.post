import type { Postcard } from '@entities/postcard'
import {
  DISPATCH_PRICE_BASE_USD,
  formatDispatchPriceLine,
} from '@date/domain/dispatchPriceTable'

const DEFAULT_PLAN_PRICE_LINE = formatDispatchPriceLine(DISPATCH_PRICE_BASE_USD)

/** Строка цены для списков (CardPie, корзина, план дат). */
export function listEntryPriceLine(postcard: Postcard | undefined): string {
  const raw = postcard?.price?.trim()
  if (raw) {
    if (/\b(USD|EUR|GBP|RUB)\b|[€₽$]|руб/i.test(raw)) return raw
    return `${raw} USD`
  }
  return DEFAULT_PLAN_PRICE_LINE
}
