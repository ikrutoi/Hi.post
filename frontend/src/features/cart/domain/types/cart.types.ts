import { DispatchDate } from '@entities/date/domain/types'

export interface CartItem {
  id: string
  preview: string
  recipientName: string
  date: DispatchDate
  price: number
}

export type Cart = CartItem[]

export interface CartState {
  items: CartItem[]
  totalPrice: number
  isLoading: boolean
}
