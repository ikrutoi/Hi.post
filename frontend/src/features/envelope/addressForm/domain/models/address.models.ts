import type { AddressFields } from '@shared/config/constants'

export const initialSection = {
  data: {
    name: '',
    street: '',
    zip: '',
    city: '',
    country: '',
  } as AddressFields,
  isComplete: false,
}
