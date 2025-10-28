import { DispatchDate } from '@entities/date/domain/types'

export interface CartItem {
  localId: number
  id: string
  preview: string
  recipientName: string
  date: DispatchDate
  price: number
}

export interface Cart {
  items: CartItem[]
  totalPrice: number
  currency: string
}

export interface CartDayItem {
  id: string
  date: DispatchDate
  img: string
  title?: string
  preview?: string
  recipientName?: string
  price?: number
}

export interface CartState {
  items: CartItem[]
  totalPrice: number
  isLoading: boolean
}
