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

export type RecipientState = {
  currentView: RecipientView
  addressFormData: AddressFields
  addressFormIsComplete: boolean
  recipientViewId: string | null
  previousRecipientViewId: string | null
  recipientsViewIds: string[]
  applied: string[]
  mode: RecipientMode
}
