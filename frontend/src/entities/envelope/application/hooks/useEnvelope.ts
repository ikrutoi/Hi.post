import { useSelector } from 'react-redux'
import { useAppDispatch } from '@app/hooks'
import {
  selectEnvelope,
  selectEnvelopeUi,
} from '../../infrastructure/selectors'
import {
  setSender,
  setRecipient,
  setEnvelopeUi,
} from '../../infrastructure/state'
import type { AddressFields } from '../../domain/types'

export const useEnvelope = () => {
  const dispatch = useAppDispatch()
  const { sender, recipient } = useSelector(selectEnvelope)
  const envelopeUi = useSelector(selectEnvelopeUi)

  return {
    sender,
    recipient,
    envelopeUi,
    updateSender: (payload: Partial<AddressFields>) =>
      dispatch(setSender(payload)),
    updateRecipient: (payload: Partial<AddressFields>) =>
      dispatch(setRecipient(payload)),
    updateEnvelopeUi: (payload: Partial<typeof envelopeUi>) =>
      dispatch(setEnvelopeUi(payload)),
  }
}
