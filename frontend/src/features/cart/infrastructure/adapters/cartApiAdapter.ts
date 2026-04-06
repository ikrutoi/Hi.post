import type { Cart } from '@cart/domain/types'

/** Сырой ряд ответа API до сборки в `Postcard` с полным `Card`. */
interface RawPostcardRow {
  id: number | string
  preview: string
  recipientName: string
  date: string
  price: number
}

/**
 * Заготовка под синхронизацию с бэком.
 * `toCartState` должен собирать полноценные `Postcard` (включая вложенный `Card`).
 */
export const cartApiAdapter = {
  async getAll(): Promise<RawPostcardRow[]> {
    const response = await fetch('/api/cart')
    const data = await response.json()
    return data
  },

  toCartState(_rawItems: RawPostcardRow[]): Cart {
    void _rawItems
    return {
      items: [],
      amount: { value: 0, currency: 'BYN' },
    }
  },
}
