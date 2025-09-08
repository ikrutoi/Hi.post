export interface AddressBookEntry {
  id: string
  role: 'sender' | 'recipient'
  address: {
    name: string
    street: string
    city: string
    zip: string
    country: string
  }
  label?: string
  createdAt: string
}
