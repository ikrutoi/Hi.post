import type { Postcard } from '@entities/postcard'

const DEFAULT_PLAN_PRICE_LINE = '6.00 USD'

/** Строка цены для списков (CardPie, корзина, план дат). */
export function listEntryPriceLine(postcard: Postcard | undefined): string {
  const raw = postcard?.price?.trim()
  if (raw) {
    if (/\b(USD|EUR|GBP|RUB)\b|[€₽$]|руб/i.test(raw)) return raw
    return `${raw} USD`
  }
  return DEFAULT_PLAN_PRICE_LINE
}
