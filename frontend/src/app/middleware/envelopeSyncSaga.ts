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
import { updateToolbarSection } from '@toolbar/infrastructure/state'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { EnvelopeRole } from '@shared/config/constants'
import {
  buildSenderToolbarState,
  buildRecipientToolbarState,
} from '@envelope/domain/helpers'
import { selectSenderState } from '@envelope/sender/infrastructure/selectors'
import { selectRecipientState } from '@envelope/recipient/infrastructure/selectors'
import type { SenderState, RecipientState } from '@envelope/domain/types'

function* handleRecomputeEnvelope() {
  const senderState: SenderState = yield select(selectSenderState)
  const recipientState: RecipientState = yield select(selectRecipientState)

  const senderComplete = senderState.isComplete
  const recipientComplete = recipientState.isComplete

  const senderHasData = Object.values(senderState.data).some(
    (val) => val.trim() !== ''
  )
  const recipientHasData = Object.values(recipientState.data).some(
    (val) => val.trim() !== ''
  )

  yield put(
    recomputeEnvelope({
      sender: senderComplete,
      recipient: recipientComplete,
    })
  )

  yield put(
    updateToolbarSection({
      section: 'sender',
      value: buildSenderToolbarState(senderComplete, senderHasData),
    })
  )
  yield put(
    updateToolbarSection({
      section: 'recipient',
      value: buildRecipientToolbarState(recipientComplete, recipientHasData),
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
