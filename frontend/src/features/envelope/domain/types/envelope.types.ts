import type { AddressFields } from '@shared/config/constants'

export interface EnvelopeSessionRecord {
  sender: SenderState
  recipient: RecipientState
  isComplete: boolean
}

export type RecipientState = {
  data: AddressFields
  isComplete: boolean
  enabled: boolean
}

export type SenderState = {
  data: AddressFields
  isComplete: boolean
  enabled: boolean
}
