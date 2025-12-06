import { takeLatest, put, select } from 'redux-saga/effects'
import {
  recomputeEnvelope,
  setEnvelopeComplete,
  clearRole,
  clearEnvelope,
} from '@envelope/infrastructure/state'
import {
  updateField as updateRecipientField,
  clearRecipient,
} from '@envelope/recipient/infrastructure/state'
import {
  updateField as updateSenderField,
  setEnabled,
  clearSender,
} from '@envelope/sender/infrastructure/state'
import { selectIsSenderComplete } from '@envelope/sender/infrastructure/selectors'
import { selectIsRecipientComplete } from '@envelope/recipient/infrastructure/selectors'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { EnvelopeRole } from '@shared/config/constants'

function* handleRecomputeEnvelope() {
  const senderComplete: boolean = yield select(selectIsSenderComplete)
  const recipientComplete: boolean = yield select(selectIsRecipientComplete)

  yield put(
    recomputeEnvelope({
      sender: senderComplete,
      recipient: recipientComplete,
    })
  )
}

function* handleClearRole(action: PayloadAction<EnvelopeRole>) {
  yield put(clearRole(action.payload))
  yield* handleRecomputeEnvelope()
}

function* handleClearEnvelope() {
  yield put(clearEnvelope())
  yield put(setEnvelopeComplete(false))
}

export function* envelopeSaga() {
  yield takeLatest(setEnvelopeComplete.type, handleRecomputeEnvelope)
  yield takeLatest(clearRole.type, handleClearRole)
  yield takeLatest(clearEnvelope.type, handleClearEnvelope)

  yield takeLatest(updateRecipientField.type, handleRecomputeEnvelope)
  yield takeLatest(clearRecipient.type, handleRecomputeEnvelope)

  yield takeLatest(updateSenderField.type, handleRecomputeEnvelope)
  yield takeLatest(setEnabled.type, handleRecomputeEnvelope)
  yield takeLatest(clearSender.type, handleRecomputeEnvelope)
}
