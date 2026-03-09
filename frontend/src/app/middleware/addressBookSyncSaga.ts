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

function entriesMatch(a: AddressBookEntry[], b: AddressBookEntry[]): boolean {
  if (a.length !== b.length) return false

  const mapB = new Map(b.map((e) => [e.id, e]))

  for (const entryA of a) {
    const entryB = mapB.get(entryA.id)
    if (!entryB) return false

    const addrA = entryA.address
    const addrB = entryB.address

    if (
      addrA.name !== addrB.name ||
      addrA.street !== addrB.street ||
      addrA.city !== addrB.city ||
      addrA.zip !== addrB.zip ||
      addrA.country !== addrB.country
    ) {
      return false
    }
  }

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
    listStatus: item.listStatus,
    favorite: item.favorite ?? null,
  }
}

/** В список быстрого доступа попадают только inList и старые записи без listStatus */
function isInQuickAccessList(item: AddressTemplateItem): boolean {
  const s = item.listStatus
  return s === undefined || s === 'inList'
}

function* syncAddressBookFromDb() {
  try {
    const current: {
      senderEntries: AddressBookEntry[]
      recipientEntries: AddressBookEntry[]
    } = yield select((s: { addressBook?: { senderEntries?: AddressBookEntry[]; recipientEntries?: AddressBookEntry[] } }) => ({
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

    const byLocalIdAsc = (a: { localId?: number }, b: { localId?: number }) =>
      (a.localId ?? 0) - (b.localId ?? 0)

    const senderSorted = Array.isArray(senderRaw)
      ? [...senderRaw].sort(byLocalIdAsc)
      : []
    const recipientSorted = Array.isArray(recipientRaw)
      ? [...recipientRaw].sort(byLocalIdAsc)
      : []

    const senderEntries = senderSorted
      .filter((r) => isInQuickAccessList(r as AddressTemplateItem))
      .map((r) => toAddressBookEntry(r as AddressTemplateItem, 'sender'))
    const recipientEntries = recipientSorted
      .filter((r) => isInQuickAccessList(r as AddressTemplateItem))
      .map((r) => toAddressBookEntry(r as AddressTemplateItem, 'recipient'))

    const senderChanged = !entriesMatch(current.senderEntries, senderEntries)
    const recipientChanged = !entriesMatch(
      current.recipientEntries,
      recipientEntries,
    )

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
