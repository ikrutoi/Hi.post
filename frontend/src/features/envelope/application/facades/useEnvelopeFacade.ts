import { useEnvelopeController } from '../controllers'
import type { EnvelopeRole, AddressFields } from '@shared/config/constants'
import type { RoleState } from '../../domain/types'

export function useEnvelopeFacade() {
  const { state, actions } = useEnvelopeController()

  return {
    state: {
      envelope: state.envelope,
      isEnvelopeComplete: state.isEnvelopeComplete,
      getRole: (role: EnvelopeRole): RoleState => state.getRole(role),
      getRoleFields: (role: EnvelopeRole): AddressFields =>
        state.getRoleFields(role),
      isRoleComplete: (role: EnvelopeRole): boolean =>
        state.isRoleComplete(role),
    },
    actions: {
      setRole: actions.setRole,
      clearRoleSection: actions.clearRoleSection,
      reset: actions.reset,
    },
  }
}
