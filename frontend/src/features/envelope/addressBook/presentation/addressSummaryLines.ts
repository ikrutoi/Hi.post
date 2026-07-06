import type { AddressField } from '@shared/config/constants'
import { ADDRESS_FIELD_ORDER } from '@shared/config/constants'
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

export type AddressPreviewLine = {
  field: AddressField
  text: string
  isName: boolean
}

export function formatAddressPreviewLines(
  entry: AddressBookEntry,
): AddressPreviewLine[] {
  return ADDRESS_FIELD_ORDER.map((field) => {
    const text =
      field === 'name'
        ? entry.address.name?.trim() || entry.label?.trim() || '—'
        : entry.address[field]?.trim() || '—'
    return { field, text, isName: field === 'name' }
  })
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
