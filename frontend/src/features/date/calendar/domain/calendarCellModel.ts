import { DispatchDate } from '@entities/date/domain'

export interface CartCard {
  id: string
  personalId: string
  img: string
  dispatchDate: DispatchDate
}

export interface PostcardBase {
  date: string
  img: string
  id: string
  personalId: string
}
