import type { ListStatus } from '@entities/envelope/domain/types'

export const ADDRESS_BOOK_MODE = ['sender', 'recipients'] as const
export type AddressBookMode = (typeof ADDRESS_BOOK_MODE)[number]

export interface AddressBookEntry {
  id: string
  role: 'sender' | 'recipient'
  address: {
    name: string
    street: string
    city: string
    zip: string
    country: string
  }
  label?: string
  createdAt: string
  listStatus?: ListStatus
  favorite?: boolean | null
}
