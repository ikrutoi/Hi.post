import { takeLatest, put, select } from 'redux-saga/effects'
import { toolbarAction } from '@toolbar/application/helpers'
import { clearSender } from '@envelope/sender/infrastructure/state'
import { clearRecipient } from '@envelope/recipient/infrastructure/state'
import { selectSenderState } from '@envelope/sender/infrastructure/selectors'
import { selectRecipientState } from '@envelope/recipient/infrastructure/selectors'
import { updateGroupStatus } from '@toolbar/infrastructure/state'
import type { RecipientState, SenderState } from '@envelope/domain/types'

function* handleEnvelopeToolbarAction(
  action: ReturnType<typeof toolbarAction>,
) {
  const { section, key } = action.payload

  if (section !== 'sender' && section !== 'recipient') return

  if (key === 'close') {
    if (section === 'sender') {
      yield put(clearSender())
    } else {
      yield put(clearRecipient())
    }
  }

  if (key === 'favorite') {
    const sender: SenderState = yield select(selectSenderState)
    const recipient: RecipientState = yield select(selectRecipientState)

    const addressToSave = section === 'sender' ? sender.data : recipient.data

    // yield put(addToAddressBook(addressToSave))

    console.log('Address saved to book:', addressToSave)
  }
}

export function* envelopeToolbarSaga() {
  yield takeLatest(toolbarAction.type, handleEnvelopeToolbarAction)
}
