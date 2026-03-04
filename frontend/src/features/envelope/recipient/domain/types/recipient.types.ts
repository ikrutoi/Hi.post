import { byKey } from '../../../addressForm/domain/types'
import type { AddressLayout } from '@envelope/addressForm/domain/types'
import type { AddressFields } from '@shared/config/constants'

export const recipientLayout: AddressLayout = [
  byKey.name,
  byKey.street,
  [byKey.zip, byKey.city],
  byKey.country,
]

export type RecipientView =
  | 'addressFormRecipientView'
  | 'recipientView'
  | 'recipientsView'

export type RecipientMode = 'recipient' | 'recipients'

export type CurrentRecipientsList = 'first' | 'second'

export const SORTED_BY = ['name', 'country', 'city', 'order'] as const
export type SortedBy = (typeof SORTED_BY)[number]

export type SortDirection = 'asc' | 'desc'

export type SortOptions = {
  sortedBy: SortedBy
  direction: SortDirection
}

export type RecipientState = {
  currentView: RecipientView
  formDraft: AddressFields
  viewDraft: AddressFields
  formIsComplete: boolean
  formIsEmpty: boolean
  sortOptions: SortOptions
  recipientViewId: string | null
  recipientsViewSortDirection: SortDirection
  recipientsViewIdsFirstList: string[]
  recipientsViewIdsSecondList: string[]
  currentRecipientsList: CurrentRecipientsList
  applied: string[]
  mode: RecipientMode
}
