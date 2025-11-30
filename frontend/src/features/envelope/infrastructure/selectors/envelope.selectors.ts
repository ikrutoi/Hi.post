import { RootState } from '@app/state'
import type { EnvelopeRole, AddressFields } from '@shared/config/constants'
import type { RoleState, EnvelopeState } from '../../domain/types'

export const selectEnvelope = (state: RootState): EnvelopeState =>
  state.envelope

export const selectEnvelopeRole = (
  state: RootState,
  role: EnvelopeRole
): RoleState => state.envelope[role]

export const selectEnvelopeRoleFields = (
  state: RootState,
  role: EnvelopeRole
): AddressFields => state.envelope[role].data

export const selectEnvelopeRoleField = (
  state: RootState,
  role: EnvelopeRole,
  field: keyof AddressFields
): string => state.envelope[role].data[field]

export const selectIsEnvelopeRoleComplete = (
  state: RootState,
  role: EnvelopeRole
): boolean => state.envelope[role].isComplete

export const selectIsEnvelopeComplete = (state: RootState): boolean =>
  state.envelope.isComplete
