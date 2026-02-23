import { takeLatest, put, select, call } from 'redux-saga/effects'
import { toolbarAction } from '@toolbar/application/helpers'
import { clearSender } from '@envelope/sender/infrastructure/state'
import { clearRecipient } from '@envelope/recipient/infrastructure/state'
import { toggleRecipientListPanel } from '@envelope/infrastructure/state'
import { selectSenderState } from '@envelope/sender/infrastructure/selectors'
import { selectRecipientState } from '@envelope/recipient/infrastructure/selectors'
import {
  addAddressTemplateRef,
  removeAddressTemplateRef,
} from '@features/previewStrip/infrastructure/state'
import { senderAdapter, recipientAdapter } from '@db/adapters/storeAdapters'
import type { RecipientState, SenderState } from '@envelope/domain/types'

function addressMatches(
  data: Record<string, string>,
  address: Record<string, string> | undefined,
) {
  if (!address) return false
  const fields = ['name', 'street', 'city', 'zip', 'country'] as const
  return fields.every(
    (f) => (data[f] ?? '').trim() === (address[f] ?? '').trim(),
  )
}

function* handleEnvelopeToolbarAction(
  action: ReturnType<typeof toolbarAction>,
) {
  const { section, key } = action.payload

  if (section === 'senderFavorite' && key === 'favorite') {
    const sender: SenderState = yield select(selectSenderState)
    const raw: { id: string; address?: Record<string, string> }[] =
      yield call([senderAdapter, 'getAll'])
    const match = Array.isArray(raw)
      ? raw.find((r) => addressMatches(sender.data, r.address))
      : null
    const entryId = match ? String(match.id) : null
    const addressTemplateRefs: { type: string; id: string }[] = yield select(
      (s: { previewStripOrder: { addressTemplateRefs: { type: string; id: string }[] } }) =>
        s.previewStripOrder?.addressTemplateRefs ?? [],
    )
    const isInFavorites = entryId
      ? addressTemplateRefs.some(
          (r) => r.type === 'sender' && r.id === entryId,
        )
      : false
    if (entryId) {
      if (isInFavorites) {
        yield put(removeAddressTemplateRef({ type: 'sender', id: entryId }))
      } else {
        yield put(addAddressTemplateRef({ type: 'sender', id: entryId }))
      }
    }
    return
  }

  if (section === 'recipientFavorite' && key === 'favorite') {
    const recipient: RecipientState = yield select(selectRecipientState)
    const raw: { id: string; address?: Record<string, string> }[] =
      yield call([recipientAdapter, 'getAll'])
    const match = Array.isArray(raw)
      ? raw.find((r) => addressMatches(recipient.data, r.address))
      : null
    const entryId = match ? String(match.id) : null
    const addressTemplateRefs: { type: string; id: string }[] = yield select(
      (s: { previewStripOrder: { addressTemplateRefs: { type: string; id: string }[] } }) =>
        s.previewStripOrder?.addressTemplateRefs ?? [],
    )
    const isInFavorites = entryId
      ? addressTemplateRefs.some(
          (r) => r.type === 'recipient' && r.id === entryId,
        )
      : false
    if (entryId) {
      if (isInFavorites) {
        yield put(removeAddressTemplateRef({ type: 'recipient', id: entryId }))
      } else {
        yield put(addAddressTemplateRef({ type: 'recipient', id: entryId }))
      }
    }
    return
  }

  if (section !== 'sender' && section !== 'recipient') return

  if (key === 'close') {
    if (section === 'sender') {
      yield put(clearSender())
    } else {
      yield put(clearRecipient())
    }
  }

  if (key === 'addressList' && section === 'recipient') {
    yield put(toggleRecipientListPanel())
  }

  if (key === 'favorite') {
    const sender: SenderState = yield select(selectSenderState)
    const recipient: RecipientState = yield select(selectRecipientState)
    const addressData = section === 'sender' ? sender.data : recipient.data

    const adapter =
      section === 'sender' ? senderAdapter : recipientAdapter
    const raw: { id: string; address?: Record<string, string> }[] =
      yield call([adapter, 'getAll'])
    const match = Array.isArray(raw)
      ? raw.find((r) => addressMatches(addressData, r.address))
      : null
    const entryId = match ? String(match.id) : null

    const addressTemplateRefs: { type: string; id: string }[] = yield select(
      (s: { previewStripOrder: { addressTemplateRefs: { type: string; id: string }[] } }) =>
        s.previewStripOrder?.addressTemplateRefs ?? [],
    )
    const isInFavorites = entryId
      ? addressTemplateRefs.some(
          (r) => r.type === section && r.id === entryId,
        )
      : false

    if (entryId) {
      if (isInFavorites) {
        yield put(removeAddressTemplateRef({ type: section, id: entryId }))
      } else {
        yield put(addAddressTemplateRef({ type: section, id: entryId }))
      }
    }
  }
}

export function* envelopeToolbarSaga() {
  yield takeLatest(toolbarAction.type, handleEnvelopeToolbarAction)
}
