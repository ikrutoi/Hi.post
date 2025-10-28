import { useAppDispatch } from '@app/hooks'
import {
  setEnvelope,
  resetEnvelope,
} from '@envelope/infrastructure/state/envelope.slice'
import type {
  AddressRole,
  AddressFields,
} from '@entities/envelope/domain/types'

export const useEnvelopeActionsController = () => {
  const dispatch = useAppDispatch()

  const saveEnvelope = (sender: AddressFields, recipient: AddressFields) => {
    dispatch(setEnvelope({ sender, recipient }))
  }

  const resetEnvelopeState = () => {
    dispatch(resetEnvelope())
  }

  const updateField = (
    role: AddressRole,
    field: keyof AddressFields,
    value: string
  ) => {
    dispatch({
      type: 'envelope/updateAddressField',
      payload: { role, field, value },
    })
  }

  return {
    saveEnvelope,
    resetEnvelopeState,
    updateField,
  }
}
