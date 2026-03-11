import { SagaIterator } from 'redux-saga'
import { call, select, put, takeLatest } from 'redux-saga/effects'
import { templateService } from '@entities/templates/domain/services/templateService'
import { selectSenderState } from '@envelope/sender/infrastructure/selectors'
import { selectRecipientState } from '@envelope/recipient/infrastructure/selectors'
import { updateGroupStatus } from '@toolbar/infrastructure/state'
import {
  saveAddressRequested as recipientSaveRequested,
  setRecipientViewId,
  setRecipientMode,
  setRecipientView,
  clearRecipientFormData,
  updateRecipientField,
  setRecipientAppliedWithData,
} from '@envelope/recipient/infrastructure/state'
import { saveAddressRequested as senderSaveRequested } from '@envelope/sender/infrastructure/state'
import {
  setSenderViewId,
  setSenderView,
  clearSenderFormData,
  updateSenderField,
  setSenderAppliedIds,
} from '@envelope/sender/infrastructure/state'
import { addressSaveSuccess, setAddressFormView } from '@envelope/infrastructure/state'
import { addAddressBookEntry } from '@envelope/addressBook/infrastructure/state'
import { processEnvelopeVisuals } from '@app/middleware/envelopeProcessSaga'
import type { RecipientState, SenderState } from '@envelope/domain/types'
import type {
  AddressFields,
  AddressField,
  EnvelopeRole,
} from '@shared/config/constants'
import type { ListStatus } from '@entities/envelope/domain/types'

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

function* handleAddressSave(
  action:
    | ReturnType<typeof recipientSaveRequested>
    | ReturnType<typeof senderSaveRequested>,
): SagaIterator {
  const role: EnvelopeRole = recipientSaveRequested.match(action)
    ? 'recipient'
    : 'sender'
  const listStatus: ListStatus =
    (action as { payload?: { listStatus?: ListStatus } }).payload?.listStatus ??
    'inList'

  try {
    const sender: SenderState = yield select(selectSenderState)
    const recipient: RecipientState = yield select(selectRecipientState)

    // Для сохранения нового адреса используем черновик формы
    const addressData =
      role === 'sender' ? sender.formDraft : recipient.formDraft

    if (!isAddressComplete(addressData)) {
      console.warn('Address is not complete, cannot save')
      return
    }

    const cleanedAddress = cleanupAddress(addressData)

    const result = yield call(() =>
      templateService.createAddressTemplate({
        address: cleanedAddress,
        type: role,
        listStatus,
      }),
    )

    if (result.success && result.templateId) {
      if (listStatus === 'inList') {
        yield put(
          addAddressBookEntry({
            id: String(result.templateId),
            role,
            address: cleanedAddress,
            createdAt: new Date().toISOString(),
          }),
        )
      }
      yield put(
        updateGroupStatus({
          section: role,
          groupName: 'envelope',
          status: 'enabled',
        }),
      )
      const id = String(result.templateId)
      if (role === 'recipient') {
        yield put(setRecipientViewId(id))
        yield put(setRecipientMode('recipient'))
        yield put(setRecipientView('recipientView'))
        yield put(setAddressFormView({ show: false, role: null }))
        yield put(clearRecipientFormData())
        // Заполняем viewDraft сохранённым адресом, чтобы RecipientView отобразил его
        for (const [field, value] of Object.entries(
          cleanedAddress,
        ) as [AddressField, string][]) {
          yield put(updateRecipientField({ field, value }))
        }
        // Для одиночного режима Recipient помечаем адрес как applied с локальными данными
        yield put(
          setRecipientAppliedWithData({
            ids: [id],
            data: [cleanedAddress],
          }),
        )
      } else {
        yield put(setSenderViewId(id))
        yield put(setSenderView('senderView'))
        yield put(setAddressFormView({ show: false, role: null }))
        yield put(clearSenderFormData())
        for (const [field, value] of Object.entries(
          cleanedAddress,
        ) as [AddressField, string][]) {
          yield put(updateSenderField({ field, value }))
        }
        yield put(setSenderAppliedIds([id]))
      }
      yield put(addressSaveSuccess(role))
      yield call(processEnvelopeVisuals)
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
