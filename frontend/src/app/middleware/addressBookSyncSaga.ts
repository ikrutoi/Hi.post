import { call, put, takeEvery, all } from 'redux-saga/effects'
import { senderAdapter, recipientAdapter } from '@db/adapters/storeAdapters'
import type { AddressTemplateItem } from '@entities/envelope/domain/types'
import type { AddressBookEntry } from '@envelope/addressBook/domain/types'
import { setAddressBookEntries } from '@envelope/addressBook/infrastructure/state'
import { incrementAddressBookReloadVersion } from '@features/previewStrip/infrastructure/state'

function toAddressBookEntry(
  item: AddressTemplateItem,
  role: 'sender' | 'recipient',
): AddressBookEntry {
  const address = item.address ?? {}
  return {
    id: String(item.id),
    role,
    address: {
      name: address.name ?? '',
      street: address.street ?? '',
      city: address.city ?? '',
      zip: address.zip ?? '',
      country: address.country ?? '',
    },
    label: undefined,
    createdAt: new Date().toISOString(),
  }
}

function* syncAddressBookFromDb() {
  try {
    const [senderRaw, recipientRaw]: [
      Awaited<ReturnType<typeof senderAdapter.getAll>>,
      Awaited<ReturnType<typeof recipientAdapter.getAll>>,
    ] = yield all([
      call([senderAdapter, 'getAll']),
      call([recipientAdapter, 'getAll']),
    ])
    const senderEntries = Array.isArray(senderRaw)
      ? senderRaw.map((r) => toAddressBookEntry(r as AddressTemplateItem, 'sender'))
      : []
    const recipientEntries = Array.isArray(recipientRaw)
      ? recipientRaw.map((r) =>
          toAddressBookEntry(r as AddressTemplateItem, 'recipient'),
        )
      : []
    yield put(
      setAddressBookEntries({ sender: senderEntries, recipient: recipientEntries }),
    )
  } catch (e) {
    console.warn('addressBookSyncSaga:', e)
  }
}

export function* addressBookSyncSaga() {
  yield takeEvery(incrementAddressBookReloadVersion.type, syncAddressBookFromDb)
}
