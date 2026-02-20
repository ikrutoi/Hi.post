import { select, put, takeEvery, call } from 'redux-saga/effects'
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
import { updateToolbarSection, updateToolbarIcon } from '@toolbar/infrastructure/state'
import {
  recipientTemplatesAdapter,
  senderTemplatesAdapter,
} from '@db/adapters/templateAdapters'
import type { RecipientState, SenderState } from '@envelope/domain/types'
import type { EnvelopeRole } from '@shared/config/constants'

function* updateAddressListBadge(role: EnvelopeRole) {
  try {
    const adapter =
      role === 'recipient' ? recipientTemplatesAdapter : senderTemplatesAdapter
    const count: number = yield call([adapter, 'count'])

    yield put(
      updateToolbarIcon({
        section: role,
        key: 'addressList',
        value: {
          options: {
            badge: count > 0 ? count : null,
          },
        },
      }),
    )
  } catch (error) {
    console.error(`Error updating addressList badge for ${role}:`, error)
  }
}

export function* processEnvelopeVisuals() {
  const sender: SenderState = yield select(selectSenderState)
  const recipient: RecipientState = yield select(selectRecipientState)

  const checkHasData = (data: Record<string, string>) =>
    Object.values(data).some((v) => v.trim() !== '')

  const senderToolbar = buildSenderToolbarState(
    sender.isComplete,
    checkHasData(sender.data),
  )

  console.log('processEnvelopeVisuals recipient', recipient)
  const recipientToolbar = buildRecipientToolbarState(
    recipient.isComplete,
    checkHasData(recipient.data),
  )
  console.log('processEnvelopeVisuals recipientToolbar', recipientToolbar)

  yield put(updateToolbarSection({ section: 'sender', value: senderToolbar }))
  yield put(
    updateToolbarSection({ section: 'recipient', value: recipientToolbar }),
  )

  // Обновляем бэджи с количеством записей
  yield call(updateAddressListBadge, 'sender')
  yield call(updateAddressListBadge, 'recipient')
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
