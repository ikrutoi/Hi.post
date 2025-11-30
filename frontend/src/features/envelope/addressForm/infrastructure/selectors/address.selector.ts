import { RootState } from '@app/state'
import type { EnvelopeRole, AddressFields } from '@shared/config/constants'

export const selectAddressByRole = (
  state: RootState,
  role: EnvelopeRole
): AddressFields => state.address[role].data

export const selectAddressField = (
  state: RootState,
  role: EnvelopeRole,
  field: keyof AddressFields
): string => state.address[role].data[field]

export const selectCompletedFields = (
  state: RootState,
  role: EnvelopeRole
): (keyof AddressFields)[] => {
  const fields = state.address[role].data
  return (Object.keys(fields) as (keyof AddressFields)[]).filter(
    (key) => fields[key].trim() !== ''
  )
}

export const selectIsAddressComplete = (
  state: RootState,
  role: EnvelopeRole
): boolean => {
  return state.address[role].isComplete
}
