export interface ToolbarCartItem {
  day: number
  preview: string
  recipientName: string
  date: string
  price: number
}

export type Cart = ToolbarCartItem[]
