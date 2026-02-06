import { select, put, takeEvery } from 'redux-saga/effects'
import {
  updateRecipientField,
  clearRecipient,
} from '@envelope/recipient/infrastructure/state'
import {
  updateSenderField,
  setEnabled,
  clearSender,
} from '@envelope/sender/infrastructure/state'
import { selectSenderState } from '@envelope/sender/infrastructure/selectors'
import { selectRecipientState } from '@envelope/recipient/infrastructure/selectors'
import {
  buildRecipientToolbarState,
  buildSenderToolbarState,
} from '@envelope/domain/helpers'
import { updateToolbarSection } from '@toolbar/infrastructure/state'
import type { RecipientState, SenderState } from '@envelope/domain/types'

function* processEnvelopeVisuals() {
  const sender: SenderState = yield select(selectSenderState)
  const recipient: RecipientState = yield select(selectRecipientState)

  const checkHasData = (data: Record<string, string>) =>
    Object.values(data).some((v) => v.trim() !== '')

  const senderToolbar = buildSenderToolbarState(
    sender.isComplete,
    checkHasData(sender.data),
  )

  const recipientToolbar = buildRecipientToolbarState(
    recipient.isComplete,
    checkHasData(recipient.data),
  )

  yield put(updateToolbarSection({ section: 'sender', value: senderToolbar }))
  yield put(
    updateToolbarSection({ section: 'recipient', value: recipientToolbar }),
  )
}

export function* envelopeProcessSaga() {
  yield takeEvery(
    [
      updateRecipientField.type,
      updateSenderField.type,
      setEnabled.type,
      clearRecipient.type,
      clearSender.type,
    ],
    processEnvelopeVisuals,
  )
}
