import type { AddressFields } from '@shared/config/constants'

export type RecipientState = {
  data: AddressFields
  isComplete: boolean
}

export type SenderState = {
  data: AddressFields
  isComplete: boolean
  enabled: boolean
}

export type EnvelopeState = {
  sender: { isComplete: boolean }
  recipient: { isComplete: boolean }
  isComplete: boolean
}
