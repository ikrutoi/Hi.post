import { useAppDispatch, useAppSelector } from '@app/hooks'
import { selectSenderState } from '../../sender/infrastructure/selectors'
import {
  selectRecipientAddress,
  selectRecipientState,
} from '../../recipient/infrastructure/selectors'
import { selectIsEnvelopeReady } from '../../infrastructure/selectors'
import {
  updateRecipientField,
  clearRecipient,
} from '../../recipient/infrastructure/state'
import {
  updateSenderField,
  setEnabled,
  clearSender,
} from '../../sender/infrastructure/state'
import {
  ADDRESS_FIELD_ORDER,
  type AddressField,
  type EnvelopeRole,
} from '@shared/config/constants'

export const useEnvelopeFacade = () => {
  const dispatch = useAppDispatch()

  const sender = useAppSelector(selectSenderState)
  const recipient = useAppSelector(selectRecipientState)
  const addressRecipient = useAppSelector(selectRecipientAddress)
  const isEnvelopeComplete = useAppSelector(selectIsEnvelopeReady)

  const handleFieldChange = (
    role: EnvelopeRole,
    field: AddressField,
    value: string,
  ) => {
    const action = role === 'sender' ? updateSenderField : updateRecipientField
    dispatch(action({ field, value }))
  }

  const toggleSenderEnabled = (enabled: boolean) => {
    dispatch(setEnabled(enabled))
  }

  const clearRole = (role: EnvelopeRole) => {
    dispatch(role === 'sender' ? clearSender() : clearRecipient())
  }

  const fullClear = () => {
    dispatch(clearRecipient())
    if (sender.enabled) {
      dispatch(clearSender())
    }
  }

  return {
    sender,
    recipient,
    addressRecipient,
    isEnvelopeComplete,
    addressFields: ADDRESS_FIELD_ORDER,
    isSenderVisible: sender.enabled,

    handleFieldChange,
    toggleSenderEnabled,
    clearRole,
    fullClear,
  }
}
