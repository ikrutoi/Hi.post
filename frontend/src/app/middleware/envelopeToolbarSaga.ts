import { takeLatest, put } from 'redux-saga/effects'
import { toolbarAction } from '@toolbar/application/helpers'
import { clearSender } from '@envelope/sender/infrastructure/state'
import { clearRecipient } from '@envelope/recipient/infrastructure/state'
import { recomputeEnvelope } from '@envelope/infrastructure/state'

function* handleEnvelopeToolbarAction(
  action: ReturnType<typeof toolbarAction>
) {
  const { section, key } = action.payload

  switch (section) {
    case 'sender':
      if (key === 'remove') {
        yield put(clearSender())
        // yield put(recomputeEnvelope({ sender: false, recipient: true }))
      }
      if (key === 'save') {
      }
      break

    case 'recipient':
      if (key === 'remove') {
        yield put(clearRecipient())
        // yield put(recomputeEnvelope({ sender: true, recipient: false }))
      }
      if (key === 'save') {
      }
      break

    default:
      break
  }
}

export function* envelopeToolbarSaga() {
  yield takeLatest(toolbarAction.type, handleEnvelopeToolbarAction)
}
