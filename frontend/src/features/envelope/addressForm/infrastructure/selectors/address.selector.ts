import { RootState } from '@app/state'
import { createSelector } from '@reduxjs/toolkit'
import type { EnvelopeRole, AddressFields } from '@shared/config/constants'
import type { RoleState, SenderState } from '../../../domain/types'

export const selectRoleState = (
  state: RootState,
  role: EnvelopeRole
): RoleState | SenderState => state.address[role]

export const selectAddressByRole = createSelector(
  [selectRoleState],
  (roleState): AddressFields => roleState.data
)

export const selectAddressField = (
  state: RootState,
  role: EnvelopeRole,
  field: keyof AddressFields
): string => state.address[role].data[field]

export const selectCompletedFields = createSelector(
  [selectRoleState],
  (roleState): (keyof AddressFields)[] =>
    (Object.keys(roleState.data) as (keyof AddressFields)[]).filter(
      (key) => roleState.data[key].trim() !== ''
    )
)

export const selectIsAddressComplete = createSelector(
  [selectRoleState, (_: RootState, role: EnvelopeRole) => role],
  (roleState, role): boolean => {
    if (role === 'sender' && 'enabled' in roleState && !roleState.enabled) {
      return true
    }
    return Object.values(roleState.data).every((val) => val.trim() !== '')
  }
)

export const selectIsSenderEnabled = (state: RootState): boolean =>
  state.address.sender.enabled
