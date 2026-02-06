import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  updateAddressField,
  toggleSender,
  clearEnvelope,
  clearRole,
} from '../../infrastructure/state'
import { selectIsEnvelopeReady } from '../../infrastructure/selectors'
import { selectRecipientState } from '../../recipient/infrastructure/selectors'
import { selectSenderState } from '../../sender/infrastructure/selectors'
import type { EnvelopeRole, AddressField } from '@shared/config/constants'

export const useEnvelopeController = () => {
  const dispatch = useAppDispatch()

  const sender = useAppSelector(selectSenderState)
  const recipient = useAppSelector(selectRecipientState)
  const isEnvelopeComplete = useAppSelector(selectIsEnvelopeReady)

  const actions = {
    updateField: (role: EnvelopeRole, field: AddressField, value: string) =>
      dispatch(updateAddressField({ role, field, value })),

    toggleSenderEnabled: (enabled: boolean) => dispatch(toggleSender(enabled)),

    clearRole: (role: EnvelopeRole) => dispatch(clearRole(role)),

    reset: () => dispatch(clearEnvelope()),
  }

  return {
    sender,
    recipient,
    isEnvelopeComplete,
    actions,
  }
}
