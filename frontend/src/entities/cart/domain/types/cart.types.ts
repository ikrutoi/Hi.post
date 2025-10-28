import type { DispatchDate } from '@entities/date/domain/types'
import type { AddressFields } from '@shared/config/constants'

export interface CartItem {
  LocalId: number
  id: string
  cardphoto: string
  recipient: AddressFields
  date: DispatchDate
  price: string
}

export type CartState = CartItem[]
