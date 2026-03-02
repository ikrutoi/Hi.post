import { call, put, select, takeEvery, all } from 'redux-saga/effects'
import { senderAdapter, recipientAdapter } from '@db/adapters/storeAdapters'
import type { AddressTemplateItem } from '@entities/envelope/domain/types'
import type { AddressBookEntry } from '@envelope/addressBook/domain/types'
import { setAddressBookEntries } from '@envelope/addressBook/infrastructure/state'
import { incrementAddressBookReloadVersion } from '@features/previewStrip/infrastructure/state'
import {
  setActiveSection,
  restoreEditorSession,
} from '@entities/sectionEditorMenu/infrastructure/state'

function idsMatch(
  a: { id: string }[],
  b: { id: string }[],
): boolean {
  if (a.length !== b.length) return false
  const setA = new Set(a.map((e) => e.id))
  const setB = new Set(b.map((e) => e.id))
  if (setA.size !== setB.size) return false
  for (const id of setA) if (!setB.has(id)) return false
  return true
}

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
    const current: {
      senderEntries: { id: string }[]
      recipientEntries: { id: string }[]
    } = yield select((s: { addressBook?: { senderEntries?: { id: string }[]; recipientEntries?: { id: string }[] } }) => ({
      senderEntries: s.addressBook?.senderEntries ?? [],
      recipientEntries: s.addressBook?.recipientEntries ?? [],
    }))

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

    const senderChanged =
      !idsMatch(current.senderEntries, senderEntries)
    const recipientChanged =
      !idsMatch(current.recipientEntries, recipientEntries)

    if (senderChanged || recipientChanged) {
      yield put(
        setAddressBookEntries({
          ...(senderChanged ? { sender: senderEntries } : {}),
          ...(recipientChanged ? { recipient: recipientEntries } : {}),
        }),
      )
    }
  } catch (e) {
    console.warn('addressBookSyncSaga:', e)
  }
}

function* loadAddressBookWhenEnvelopeSectionOpens(
  action: { payload: string },
) {
  if (action.payload === 'envelope') {
    yield put(incrementAddressBookReloadVersion())
  }
}

export function* addressBookSyncSaga() {
  yield takeEvery(setActiveSection.type, loadAddressBookWhenEnvelopeSectionOpens)
  yield takeEvery(
    restoreEditorSession.type,
    loadAddressBookWhenEnvelopeSectionOpens,
  )
  yield takeEvery(incrementAddressBookReloadVersion.type, syncAddressBookFromDb)
}
