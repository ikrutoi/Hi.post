import type { AddressFields } from '@entities/envelope/domain/types'

export const emptyAddress: AddressFields = {
  name: '',
  street: '',
  city: '',
  zip: '',
  country: '',
}
