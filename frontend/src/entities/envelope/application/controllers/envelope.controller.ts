import type { AppDispatch } from '@app/state'
import {
  setSender,
  setRecipient,
  setEnvelopeUi,
} from '../../infrastructure/state'
import type { AddressFields } from '../../domain/types'

export const envelopeController = (dispatch: AppDispatch) => ({
  updateSender: (payload: Partial<AddressFields>) =>
    dispatch(setSender(payload)),
  updateRecipient: (payload: Partial<AddressFields>) =>
    dispatch(setRecipient(payload)),
  updateEnvelopeUi: (
    payload: Partial<ReturnType<typeof setEnvelopeUi>['payload']>
  ) => dispatch(setEnvelopeUi(payload)),
})
