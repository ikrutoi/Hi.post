import type { AddressFields, EnvelopeRole } from '@shared/config/constants'
import type { TemplateBase, TemplateMetadata } from './template.types'

export type AddressType = EnvelopeRole

export interface AddressTemplate extends TemplateBase, TemplateMetadata {
  address: AddressFields
  type: AddressType
  cardId?: string
}

export interface CreateAddressTemplatePayload {
  address: AddressFields
  type: AddressType
  name?: string
  id?: string
  cardId?: string
}

export interface UpdateAddressTemplatePayload {
  address?: AddressFields
  name?: string
}
