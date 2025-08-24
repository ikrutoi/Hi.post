export interface BaseAddress {
  name: string
  street: string
  city: string
  zip: string
  country: string
}

export const initialBaseAddress: BaseAddress = {
  name: '',
  street: '',
  city: '',
  zip: '',
  country: '',
}

export type SenderAddress = BaseAddress
export type RecipientAddress = BaseAddress
