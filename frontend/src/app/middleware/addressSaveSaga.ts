import { SagaIterator } from 'redux-saga'
import { call, select, put, takeLatest } from 'redux-saga/effects'
import { templateService } from '@entities/templates/domain/services/templateService'
import { selectSenderState } from '@envelope/sender/infrastructure/selectors'
import { selectRecipientState } from '@envelope/recipient/infrastructure/selectors'
import { updateGroupStatus } from '@toolbar/infrastructure/state'
import {
  saveAddressRequested as recipientSaveRequested,
  setRecipientViewId,
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
  setSenderAppliedWithData,
} from '@envelope/sender/infrastructure/state'
import {
  addressSaveSuccess,
  setActiveAddressList,
  setAddressFormView,
  setRecipientsPendingIds,
} from '@envelope/infrastructure/state'
import {
  selectActiveAddressList,
  selectRecipientsPendingIds,
} from '@envelope/infrastructure/selectors'
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
  /** Адрес в БД всегда; `inList` — в быстром списке шаблонов, `outList` — только запись (см. Apply без id). */
  const listStatus: ListStatus =
    (action as { payload?: { listStatus?: ListStatus } }).payload?.listStatus ??
    'inList'

  try {
    const sender: SenderState = yield select(selectSenderState)
    const recipient: RecipientState = yield select(selectRecipientState)

    // Форма адреса — formDraft; карточка SenderView/RecipientView — viewDraft
    const addressData =
      role === 'sender'
        ? sender.currentView === 'senderCreate'
          ? sender.formDraft
          : sender.viewDraft
        : recipient.currentView === 'recipientCreate'
          ? recipient.formDraft
          : recipient.viewDraft

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
      const isCreateFlow =
        (role === 'sender' && sender.currentView === 'senderCreate') ||
        (role === 'recipient' && recipient.currentView === 'recipientCreate')

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

      /** addList из create: форма остаётся открытой, черновик не сбрасываем (закрытие — вариант A). */
      if (isCreateFlow && listStatus === 'inList') {
        const active: 'sender' | 'recipients' | null = yield select(
          selectActiveAddressList,
        )
        const listMode = role === 'sender' ? 'sender' : 'recipients'
        if (active !== listMode) {
          yield put(setActiveAddressList(listMode))
        }
        yield call(processEnvelopeVisuals)
        return
      }

      const id = String(result.templateId)
      if (role === 'recipient') {
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
        const pendingIds: string[] = yield select(selectRecipientsPendingIds)
        const nextPendingIds = pendingIds.includes(id)
          ? pendingIds
          : [...pendingIds, id]
        if (!pendingIds.includes(id)) {
          yield put(setRecipientsPendingIds(nextPendingIds))
        }
        if (nextPendingIds.length === 1) {
          yield put(setRecipientViewId(id))
          yield put(setRecipientView('recipientView'))
        } else {
          yield put(setRecipientViewId(null))
          yield put(setRecipientView('recipientsView'))
        }
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
        yield put(
          setSenderAppliedWithData({
            ids: [id],
            data: [cleanedAddress],
          }),
        )
      }
      if (listStatus === 'inList') {
        const active: 'sender' | 'recipients' | null = yield select(
          selectActiveAddressList,
        )
        const listMode = role === 'sender' ? 'sender' : 'recipients'
        if (active !== listMode) {
          yield put(setActiveAddressList(listMode))
        }
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
