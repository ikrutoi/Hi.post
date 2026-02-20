import { SagaIterator } from 'redux-saga'
import { call, select, put, takeLatest } from 'redux-saga/effects'
import { templateService } from '@entities/templates/domain/services/templateService'
import { selectSenderState } from '@envelope/sender/infrastructure/selectors'
import { selectRecipientState } from '@envelope/recipient/infrastructure/selectors'
import { updateGroupStatus, updateToolbarIcon } from '@toolbar/infrastructure/state'
import { saveAddressRequested as recipientSaveRequested } from '@envelope/recipient/infrastructure/state'
import { saveAddressRequested as senderSaveRequested } from '@envelope/sender/infrastructure/state'
import {
  recipientTemplatesAdapter,
  senderTemplatesAdapter,
} from '@db/adapters/templateAdapters'
import type { RecipientState, SenderState } from '@envelope/domain/types'
import type { AddressFields, EnvelopeRole } from '@shared/config/constants'

function cleanupAddress(address: Record<string, string>): AddressFields {
  const cleanup = (text: string) => text.split(' ').filter(Boolean).join(' ')

  return {
    name: cleanup(address.name || ''),
    street: cleanup(address.street || ''),
    city: cleanup(address.city || ''),
    zip: cleanup(address.zip || ''),
    country: cleanup(address.country || ''),
  }
}

function isAddressComplete(address: Record<string, string>): boolean {
  return Object.values(address).every((val) => val.trim() !== '')
}

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

function* handleAddressSave(
  action:
    | ReturnType<typeof recipientSaveRequested>
    | ReturnType<typeof senderSaveRequested>,
): SagaIterator {
  const role: EnvelopeRole = recipientSaveRequested.match(action)
    ? 'recipient'
    : 'sender'

  try {
    const sender: SenderState = yield select(selectSenderState)
    const recipient: RecipientState = yield select(selectRecipientState)

    const addressState = role === 'sender' ? sender : recipient
    const addressData = addressState.data

    if (!isAddressComplete(addressData)) {
      console.warn('Address is not complete, cannot save')
      return
    }

    const cleanedAddress = cleanupAddress(addressData)

    const result = yield call(() =>
      templateService.createAddressTemplate({
        address: cleanedAddress,
        type: role,
      }),
    )

    if (result.success) {
      // Обновляем статус группы
      yield put(
        updateGroupStatus({
          section: role,
          groupName: 'envelope',
          status: 'enabled',
        }),
      )

      // Обновляем бэдж иконки addressList с количеством записей
      yield call(updateAddressListBadge, role)
    } else {
      console.error('Failed to save address:', result.error)
    }
  } catch (error) {
    console.error('Error saving address:', error)
  }
}

export function* addressSaveSaga(): SagaIterator {
  yield takeLatest(
    [recipientSaveRequested.type, senderSaveRequested.type],
    handleAddressSave,
  )
}
