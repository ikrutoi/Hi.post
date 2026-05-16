import type { AddressBookEntry } from '../domain/types'

export type AddressSummaryLines = {
  nameLine: string
  cityCountryLine: string
}

export function formatAddressSummaryLines(
  entry: AddressBookEntry,
): AddressSummaryLines {
  const name =
    entry.address.name?.trim() || entry.label?.trim() || ''
  const cityCountry = [entry.address.city, entry.address.country]
    .map((s) => s?.trim())
    .filter(Boolean)
    .join(', ')
  return {
    nameLine: name || '—',
    cityCountryLine: cityCountry || '—',
  }
}
