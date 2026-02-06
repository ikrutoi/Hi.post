import { useAppDispatch, useAppSelector } from '@app/hooks'
import { selectSenderState } from '../../sender/infrastructure/selectors'
import { selectRecipientState } from '../../recipient/infrastructure/selectors'
import { selectIsEnvelopeReady } from '../../infrastructure/selectors'
import {
  updateRecipientField,
  clearRecipient,
} from '../../recipient/infrastructure/state'
import {
  updateSenderField,
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

  const isEnvelopeComplete = useAppSelector(selectIsEnvelopeReady)

  const handleFieldChange = (
    role: EnvelopeRole,
    field: AddressField,
    value: string,
  ) => {
    if (role === 'sender') {
      dispatch(updateSenderField({ field, value }))
    } else {
      dispatch(updateRecipientField({ field, value }))
    }
  }

  const clearRole = (role: EnvelopeRole) => {
    dispatch(role === 'sender' ? clearSender() : clearRecipient())
  }

  return {
    state: {
      sender,
      recipient,
      isEnvelopeComplete,
      addressFields: ADDRESS_FIELD_ORDER,
    },
    actions: {
      handleFieldChange,
      clearRole,
    },
  }
}
