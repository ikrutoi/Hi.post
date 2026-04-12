import type { Cart } from '@cart/domain/types'

interface RawPostcardRow {
  id: number | string
  preview: string
  recipientName: string
  date: string
  price: number
}

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
