import { SagaIterator } from 'redux-saga'
import { call, select, put, takeLeading } from 'redux-saga/effects'
import { templateService } from '@entities/templates/domain/services/templateService'
import { selectSenderState } from '@envelope/sender/infrastructure/selectors'
import { selectRecipientState } from '@envelope/recipient/infrastructure/selectors'
import { updateGroupStatus } from '@toolbar/infrastructure/state'
import {
  saveAddressRequested as recipientSaveRequested,
  setRecipientViewId,
  setRecipientView,
  clearRecipientFormData,
  setRecipientAppliedWithData,
  setRecipientViewDraft,
} from '@envelope/recipient/infrastructure/state'
import { saveAddressRequested as senderSaveRequested } from '@envelope/sender/infrastructure/state'
import {
  setSenderViewId,
  setSenderView,
  clearSenderFormData,
  setSenderAppliedWithData,
  setSenderViewDraft,
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
import { incrementAddressTemplatesReloadVersion } from '@features/previewStrip/infrastructure/state'
import { processEnvelopeVisuals } from '@app/middleware/envelopeProcessSaga'
import {
  getMatchingEntryId,
  normalizeAddressFields,
} from '@envelope/domain/helpers'
import type { AddressBookEntry } from '@envelope/addressBook/domain/types'
import type { RootState } from '@app/state'
import type { RecipientState, SenderState } from '@envelope/domain/types'
import type { AddressFields, EnvelopeRole } from '@shared/config/constants'
import type { ListStatus } from '@entities/envelope/domain/types'
import type { AddressSaveRequestedPayload } from '@envelope/domain/types/addressSave.types'

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
  return Object.values(address).every((val) => (val ?? '').trim() !== '')
}

function pickAddressDataForSave(
  role: EnvelopeRole,
  sender: SenderState,
  recipient: RecipientState,
  payloadDraft?: AddressFields,
): AddressFields {
  if (payloadDraft != null) return payloadDraft
  if (role === 'sender') {
    return sender.currentView === 'senderCreate'
      ? sender.formDraft
      : sender.viewDraft
  }
  return recipient.currentView === 'recipientCreate'
    ? recipient.formDraft
    : recipient.viewDraft
}

export function* handleAddressSave(
  action:
    | ReturnType<typeof recipientSaveRequested>
    | ReturnType<typeof senderSaveRequested>,
): SagaIterator {
  const role: EnvelopeRole = recipientSaveRequested.match(action)
    ? 'recipient'
    : 'sender'
  /** Адрес в БД всегда; `inList` — в быстром списке шаблонов, `outList` — только запись (см. Apply без id). */
  const payload = (
    action as { payload?: AddressSaveRequestedPayload }
  ).payload
  const listStatus: ListStatus = payload?.listStatus ?? 'inList'
  /** applyLight на create-форме: только вьюшка, без applied/appliedData */
  const viewOnly = payload?.viewOnly === true
  const payloadDraft = payload?.draft

  try {
    const sender: SenderState = yield select(selectSenderState)
    const recipient: RecipientState = yield select(selectRecipientState)

    const addressData = pickAddressDataForSave(
      role,
      sender,
      recipient,
      payloadDraft,
    )

    if (!isAddressComplete(addressData)) {
      console.warn('Address is not complete, cannot save')
      return
    }

    const cleanedAddress = cleanupAddress(addressData)

    const isCreateFlow =
      (role === 'sender' && sender.currentView === 'senderCreate') ||
      (role === 'recipient' && recipient.currentView === 'recipientCreate')

    const bookEntries: AddressBookEntry[] = yield select(
      (s: RootState) =>
        role === 'sender'
          ? (s.addressBook?.senderEntries ?? [])
          : (s.addressBook?.recipientEntries ?? []),
    )
    const existingId = getMatchingEntryId(
      cleanedAddress,
      bookEntries.map((e) => ({
        id: e.id,
        address: normalizeAddressFields(e.address ?? {}),
      })),
    )

    if (viewOnly && isCreateFlow && existingId != null) {
      // Дубликат: кнопка disabled, но на всякий случай открываем существующий шаблон.
      yield call(openAddressViewAfterSave, role, cleanedAddress, existingId, {
        viewOnly,
        listStatus,
      })
      return
    }

    const result = yield call(() =>
      templateService.createAddressTemplate({
        address: cleanedAddress,
        type: role,
        listStatus,
      }),
    )

    if (result.success && result.templateId) {
      yield put(incrementAddressTemplatesReloadVersion())

      yield put(
        addAddressBookEntry({
          id: String(result.templateId),
          role,
          address: cleanedAddress,
          createdAt: new Date().toISOString(),
          listStatus,
          favorite: listStatus === 'outList' ? null : false,
        }),
      )

      /** addList из create: форма остаётся открытой, черновик не сбрасываем (закрытие — вариант A). */
      if (isCreateFlow && listStatus === 'inList') {
        yield put(
          updateGroupStatus({
            section: toolbarSectionForRole(role),
            groupName: 'envelope',
            status: 'enabled',
          }),
        )
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

      yield call(
        openAddressViewAfterSave,
        role,
        cleanedAddress,
        String(result.templateId),
        { viewOnly, listStatus },
      )
    } else {
      console.error('Failed to save address:', result.error)
    }
  } catch (error) {
    console.error('Error saving address:', error)
  }
}

function toolbarSectionForRole(
  role: EnvelopeRole,
): 'sender' | 'recipients' {
  return role === 'sender' ? 'sender' : 'recipients'
}

function* openAddressViewAfterSave(
  role: EnvelopeRole,
  cleanedAddress: AddressFields,
  id: string,
  ctx: {
    viewOnly: boolean
    listStatus: ListStatus
  },
): SagaIterator {
  const { viewOnly, listStatus } = ctx

  yield put(
    updateGroupStatus({
      section: toolbarSectionForRole(role),
      groupName: 'envelope',
      status: 'enabled',
    }),
  )

  if (role === 'recipient') {
    const pendingIds: string[] = yield select(selectRecipientsPendingIds)
    const nextPendingIds = pendingIds.includes(id)
      ? pendingIds
      : [...pendingIds, id]

    yield put(setRecipientViewDraft(cleanedAddress))
    yield put(setAddressFormView({ show: false, role: null }))
    yield put(clearRecipientFormData())
    if (!viewOnly) {
      yield put(
        setRecipientAppliedWithData({
          ids: [id],
          data: [cleanedAddress],
        }),
      )
    }
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
    yield put(setSenderViewDraft(cleanedAddress))
    yield put(setSenderViewId(id))
    yield put(setSenderView('senderView'))
    yield put(setAddressFormView({ show: false, role: null }))
    yield put(clearSenderFormData())
    if (!viewOnly) {
      yield put(
        setSenderAppliedWithData({
          ids: [id],
          data: [cleanedAddress],
        }),
      )
    }
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
}

export function* addressSaveSaga(): SagaIterator {
  yield takeLeading(
    [recipientSaveRequested.type, senderSaveRequested.type],
    handleAddressSave,
  )
}
