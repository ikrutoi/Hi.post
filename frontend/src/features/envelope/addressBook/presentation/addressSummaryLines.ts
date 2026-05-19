import type { AddressBookEntry } from '../domain/types'

export type AddressSummaryLines = {
  nameLine: string
  cityCountryLine: string
}

export type AddressGridCellLines = {
  nameLine: string
  cityLine: string
  countryLine: string
}

export function formatAddressGridCellLines(
  entry: AddressBookEntry,
): AddressGridCellLines {
  const name = entry.address.name?.trim() || entry.label?.trim() || ''
  const city = entry.address.city?.trim() || ''
  const country = entry.address.country?.trim() || ''
  return {
    nameLine: name || '—',
    cityLine: city || '—',
    countryLine: country || '—',
  }
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
