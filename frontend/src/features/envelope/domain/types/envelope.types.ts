import type { AddressFields } from '@shared/config/constants'

export type RecipientMode = 'recipient' | 'recipients'

export type RecipientState = {
  data: AddressFields
  isComplete: boolean
  enabled: boolean
  applied: boolean
}

export type SenderState = {
  data: AddressFields
  isComplete: boolean
  enabled: boolean
  applied: boolean
}

export interface EnvelopeSessionRecord {
  sender: SenderState
  recipient: RecipientState
  recipients: RecipientState[]
  recipientMode: RecipientMode
  isComplete: boolean
}
