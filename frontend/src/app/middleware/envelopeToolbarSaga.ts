import { takeLatest, put } from 'redux-saga/effects'
import { toolbarAction } from '@toolbar/application/helpers'
import { clearSender } from '@envelope/sender/infrastructure/state'
import { clearRecipient } from '@envelope/recipient/infrastructure/state'
import { updateGroupStatus } from '@toolbar/infrastructure/state'

function* handleEnvelopeToolbarAction(
  action: ReturnType<typeof toolbarAction>
) {
  const { section, key } = action.payload

  if (section !== 'sender' && section !== 'recipient') return

  if (key === 'close') {
    if (section === 'sender') {
      yield put(clearSender())
    } else {
      yield put(clearRecipient())
    }

    yield put(
      updateGroupStatus({
        section,
        groupName: 'address',
        status: 'disabled',
      })
    )
  }

  if (key === 'save') {
  }
}

export function* envelopeToolbarSaga() {
  yield takeLatest(toolbarAction.type, handleEnvelopeToolbarAction)
}
