import type { AppDispatch } from '@app/state'
import {
  setSender,
  setRecipient,
  setEnvelopeUi,
} from '../../infrastructure/state'
import type { Address } from '../../domain/types'

export const envelopeController = (dispatch: AppDispatch) => ({
  updateSender: (payload: Partial<Address>) => dispatch(setSender(payload)),
  updateRecipient: (payload: Partial<Address>) =>
    dispatch(setRecipient(payload)),
  updateEnvelopeUi: (
    payload: Partial<ReturnType<typeof setEnvelopeUi>['payload']>
  ) => dispatch(setEnvelopeUi(payload)),
})
