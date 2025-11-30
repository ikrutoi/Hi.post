import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  updateRole,
  clearRole,
  resetEnvelope,
} from '../../infrastructure/state'
import {
  selectEnvelope,
  selectEnvelopeRole,
  selectEnvelopeRoleFields,
  selectIsEnvelopeRoleComplete,
  selectIsEnvelopeComplete,
} from '../../infrastructure/selectors'
import type { EnvelopeRole, AddressFields } from '@shared/config/constants'
import type { RoleState } from '../../domain/types'

export function useEnvelopeController() {
  const dispatch = useAppDispatch()

  const envelope = useAppSelector(selectEnvelope)
  const isEnvelopeComplete = useAppSelector(selectIsEnvelopeComplete)

  const getRole = (role: EnvelopeRole): RoleState =>
    useAppSelector((state) => selectEnvelopeRole(state, role))

  const getRoleFields = (role: EnvelopeRole): AddressFields =>
    useAppSelector((state) => selectEnvelopeRoleFields(state, role))

  const isRoleComplete = (role: EnvelopeRole): boolean =>
    useAppSelector((state) => selectIsEnvelopeRoleComplete(state, role))

  const setRole = (role: EnvelopeRole, data: RoleState) =>
    dispatch(updateRole({ role, data }))

  const clearRoleSection = (role: EnvelopeRole) => dispatch(clearRole(role))

  const reset = () => dispatch(resetEnvelope())

  return {
    state: {
      envelope,
      isEnvelopeComplete,
      getRole,
      getRoleFields,
      isRoleComplete,
    },
    actions: {
      setRole,
      clearRoleSection,
      reset,
    },
  }
}
