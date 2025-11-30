import { useAddressController } from '../controllers'
import type { EnvelopeRole } from '@shared/config/constants'

export function useAddressFacade(role: EnvelopeRole) {
  const { state, actions } = useAddressController(role)

  return {
    state: {
      address: state.address,
      completedFields: state.completedFields,
      isComplete: state.isComplete,
    },
    actions: {
      onValueChange: actions.onValueChange,
      clearSection: actions.clearSection,
      markComplete: actions.markComplete,
    },
  }
}
