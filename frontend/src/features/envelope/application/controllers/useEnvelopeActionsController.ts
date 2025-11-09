import { useAppDispatch } from '@app/hooks'
import {
  setEnvelope,
  resetEnvelope,
  updateAddressField,
} from '@envelope/infrastructure/state'
import type { EnvelopeRole, AddressFields } from '@shared/config/constants'

export const useEnvelopeActionsController = () => {
  const dispatch = useAppDispatch()

  const saveEnvelope = (sender: AddressFields, recipient: AddressFields) => {
    dispatch(setEnvelope({ sender, recipient }))
  }

  const resetEnvelopeState = (role?: EnvelopeRole) => {
    dispatch(resetEnvelope(role))
  }

  const updateField = (
    role: EnvelopeRole,
    field: keyof AddressFields,
    value: string
  ) => {
    dispatch(updateAddressField({ role, field, value }))
  }

  return {
    saveEnvelope,
    resetEnvelopeState,
    updateField,
  }
}
