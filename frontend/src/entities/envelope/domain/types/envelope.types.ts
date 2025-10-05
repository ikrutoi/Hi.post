export type Address = {
  street: string
  zip: string
  city: string
  country: string
  name: string
}

export type EnvelopeState = {
  sender: Address
  recipient: Address
  ui: {
    miniAddressClose: 'sender' | 'recipient' | null
    envelopeSave: 'sender' | 'recipient' | null
    envelopeSaveSecond: boolean | null
    envelopeRemoveAddress: boolean | null
  }
}
