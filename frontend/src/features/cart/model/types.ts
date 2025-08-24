export interface CartPostcard {
  id: string
  preview: string
  recipientName: string
  date: string
  price: number
}

export type Cart = CartPostcard[]
