import { byKey } from '../../../addressForm/domain/types'
import type { AddressLayout } from '@envelope/addressForm/domain/types'
import type { AddressFields } from '@shared/config/constants'

export const senderLayout: AddressLayout = [
  byKey.name,
  byKey.street,
  [byKey.zip, byKey.city],
  byKey.country,
]

export type SenderView = 'addressFormSenderView' | 'senderView'

export const SENDER_SORTED_BY = ['name', 'country', 'city', 'order'] as const
export type SenderSortedBy = (typeof SENDER_SORTED_BY)[number]

export type SenderSortDirection = 'asc' | 'desc'

export type SenderSortOptions = {
  sortedBy: SenderSortedBy
  direction: SenderSortDirection
}

export type SenderState = {
  currentView: SenderView
  formDraft: AddressFields
  viewDraft: AddressFields
  formIsComplete: boolean
  formIsEmpty: boolean
  sortOptions: SenderSortOptions
  senderViewId: string | null
  applied: string[]
  enabled: boolean
}
