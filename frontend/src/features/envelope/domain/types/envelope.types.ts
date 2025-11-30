import type { AddressFields } from '@shared/config/constants'

export type RoleState = {
  data: AddressFields
  isComplete: boolean
}

export type EnvelopeState = {
  sender: RoleState
  recipient: RoleState
  isComplete: boolean
}
