import type { Cart } from '../domain'

interface RawCartItem {
  id: number | string
  preview: string
  recipientName: string
  date: string
  price: number
}

export const cartAdapter = {
  async getAll(): Promise<RawCartItem[]> {
    const response = await fetch('/api/cart')
    const data = await response.json()
    return data
  },

  toCart(rawItems: RawCartItem[]): Cart {
    return rawItems.map((item) => ({
      id: item.id.toString(),
      preview: item.preview,
      recipientName: item.recipientName,
      date: item.date,
      price: item.price,
    }))
  },
}
