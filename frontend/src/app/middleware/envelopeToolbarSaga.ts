import { takeLatest, put, select, call } from 'redux-saga/effects'
import { toolbarAction } from '@toolbar/application/helpers'
import {
  clearSender,
  setSenderApplied,
  saveAddressRequested as senderSaveRequested,
} from '@envelope/sender/infrastructure/state'
import {
  clearRecipient,
  setRecipientApplied,
  saveAddressRequested as recipientSaveRequested,
} from '@envelope/recipient/infrastructure/state'
import {
  toggleRecipientListPanel,
  toggleSenderListPanel,
  setRecipientsList,
  setRecipientMode,
  setRecipientTemplateId,
  setSenderTemplateId,
} from '@envelope/infrastructure/state'
import { selectSelectedRecipientIds } from '@envelope/infrastructure/selectors'
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
    const raw: { id: string; address?: Record<string, string> }[] = yield call([
      senderAdapter,
      'getAll',
    ])
    const match = Array.isArray(raw)
      ? raw.find((r) => addressMatches(sender.data, r.address))
      : null
    const entryId = match ? String(match.id) : null
    const addressTemplateRefs: { type: string; id: string }[] = yield select(
      (s: {
        previewStripOrder: {
          addressTemplateRefs: { type: string; id: string }[]
        }
      }) => s.previewStripOrder?.addressTemplateRefs ?? [],
    )
    const isInFavorites = entryId
      ? addressTemplateRefs.some((r) => r.type === 'sender' && r.id === entryId)
      : false
    if (entryId) {
      if (isInFavorites) {
        yield put(removeAddressTemplateRef({ type: 'sender', id: entryId }))
      } else {
        yield put(addAddressTemplateRef({ type: 'sender', id: entryId }))
      }
    } else if (sender.isComplete) {
      yield put(senderSaveRequested())
    }
    return
  }

  if (section === 'recipientFavorite' && key === 'favorite') {
    const recipient: RecipientState = yield select(selectRecipientState)
    const raw: { id: string; address?: Record<string, string> }[] = yield call([
      recipientAdapter,
      'getAll',
    ])
    const match = Array.isArray(raw)
      ? raw.find((r) => addressMatches(recipient.data, r.address))
      : null
    const entryId = match ? String(match.id) : null
    const addressTemplateRefs: { type: string; id: string }[] = yield select(
      (s: {
        previewStripOrder: {
          addressTemplateRefs: { type: string; id: string }[]
        }
      }) => s.previewStripOrder?.addressTemplateRefs ?? [],
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
    } else if (recipient.isComplete) {
      yield put(recipientSaveRequested())
    }
    return
  }

  if (section === 'savedAddress' && key === 'favorite') {
    const envelopeSelection: {
      recipientTemplateId: string | null
      senderTemplateId: string | null
    } = yield select(
      (s: {
        envelopeSelection: {
          recipientTemplateId: string | null
          senderTemplateId: string | null
        }
      }) => s.envelopeSelection ?? { recipientTemplateId: null, senderTemplateId: null },
    )
    const addressTemplateRefs: { type: string; id: string }[] = yield select(
      (s: {
        previewStripOrder: {
          addressTemplateRefs: { type: string; id: string }[]
        }
      }) => s.previewStripOrder?.addressTemplateRefs ?? [],
    )
    const templateId = envelopeSelection.recipientTemplateId ?? envelopeSelection.senderTemplateId
    const type = envelopeSelection.recipientTemplateId != null ? 'recipient' : 'sender'
    if (templateId != null) {
      const isInFavorites = addressTemplateRefs.some(
        (r) => r.type === type && r.id === templateId,
      )
      if (isInFavorites) {
        yield put(removeAddressTemplateRef({ type, id: templateId }))
      } else {
        yield put(addAddressTemplateRef({ type, id: templateId }))
      }
    }
    return
  }

  if (
    section !== 'sender' &&
    section !== 'recipient' &&
    section !== 'recipients'
  )
    return

  if (key === 'close') {
    if (section === 'sender') {
      yield put(setSenderTemplateId(null))
      yield put(clearSender())
    } else {
      yield put(setRecipientTemplateId(null))
      yield put(clearRecipient())
    }
  }

  if (key === 'apply') {
    if (section === 'sender') {
      const sender: SenderState = yield select(selectSenderState)
      if (sender.isComplete) yield put(setSenderApplied(true))
    }
    if (section === 'recipient') {
      const recipient: RecipientState = yield select(selectRecipientState)
      if (recipient.isComplete) {
        yield put(setRecipientMode('recipient'))
        yield put(setRecipientApplied(true))
      }
    }
    if (section === 'recipients') {
      const ids: string[] = yield select(selectSelectedRecipientIds)
      const list: RecipientState[] = []
      for (const id of ids) {
        const record: { id: string; address?: Record<string, string> } | null =
          yield call([recipientAdapter, 'getById'], id)
        if (record?.address) {
          const isComplete = Object.values(record.address).every(
            (v) => (v ?? '').trim() !== '',
          )
          list.push({
            data: record.address as RecipientState['data'],
            isComplete,
            enabled: false,
            applied: true,
          })
        }
      }
      yield put(setRecipientMode('recipients'))
      yield put(setRecipientsList(list))
    }
  }

  if (key === 'addressList') {
    if (section === 'sender') {
      yield put(toggleSenderListPanel())
    } else if (section === 'recipient' || section === 'recipients') {
      yield put(toggleRecipientListPanel())
    }
  }

  if (key === 'favorite' && (section === 'sender' || section === 'recipient')) {
    const addressSection = section
    const sender: SenderState = yield select(selectSenderState)
    const recipient: RecipientState = yield select(selectRecipientState)
    const addressData =
      addressSection === 'sender' ? sender.data : recipient.data

    const adapter =
      addressSection === 'sender' ? senderAdapter : recipientAdapter
    const raw: { id: string; address?: Record<string, string> }[] = yield call([
      adapter,
      'getAll',
    ])
    const match = Array.isArray(raw)
      ? raw.find((r) => addressMatches(addressData, r.address))
      : null
    const entryId = match ? String(match.id) : null

    const addressTemplateRefs: { type: string; id: string }[] = yield select(
      (s: {
        previewStripOrder: {
          addressTemplateRefs: { type: string; id: string }[]
        }
      }) => s.previewStripOrder?.addressTemplateRefs ?? [],
    )
    const isInFavorites = entryId
      ? addressTemplateRefs.some(
          (r) => r.type === addressSection && r.id === entryId,
        )
      : false

    if (entryId) {
      if (isInFavorites) {
        yield put(
          removeAddressTemplateRef({ type: addressSection, id: entryId }),
        )
      } else {
        yield put(addAddressTemplateRef({ type: addressSection, id: entryId }))
      }
    }
  }
}

export function* envelopeToolbarSaga() {
  yield takeLatest(toolbarAction.type, handleEnvelopeToolbarAction)
}
