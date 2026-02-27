import { takeLatest, put, select, call } from 'redux-saga/effects'
import { toolbarAction } from '@toolbar/application/helpers'
import {
  clearSender,
  restoreSender,
  setSenderApplied,
  saveAddressRequested as senderSaveRequested,
} from '@envelope/sender/infrastructure/state'
import {
  clearRecipient,
  setRecipientApplied,
  restoreRecipient,
  saveAddressRequested as recipientSaveRequested,
} from '@envelope/recipient/infrastructure/state'
import {
  toggleRecipientListPanel,
  toggleSenderListPanel,
  setRecipientsList,
  setRecipientMode,
  setRecipientTemplateId,
  setSenderTemplateId,
  clearRecipientSelection,
  setSenderSavedAddressEditMode,
  setRecipientSavedAddressEditMode,
  clearSenderDraft,
  clearRecipientDraft,
} from '@envelope/infrastructure/state'
import { selectSelectedRecipientIds } from '@envelope/infrastructure/selectors'
import { selectSenderState } from '@envelope/sender/infrastructure/selectors'
import { selectRecipientState } from '@envelope/recipient/infrastructure/selectors'
import {
  addAddressTemplateRef,
  removeAddressTemplateRef,
} from '@features/previewStrip/infrastructure/state'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
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

  if (
    (section === 'savedAddress' ||
      section === 'senderSavedAddress' ||
      section === 'recipientSavedAddress') &&
    key === 'favorite'
  ) {
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

  if (section === 'senderSavedAddress' && key === 'edit') {
    const isEditMode: boolean = yield select(
      (s: {
        envelopeSelection?: { savedSenderAddressEditMode?: boolean }
      }) => s.envelopeSelection?.savedSenderAddressEditMode ?? false,
    )

    if (!isEditMode) {
      // Входим в режим редактирования сохранённого адреса отправителя
      yield put(setSenderSavedAddressEditMode(true))
      yield put(setRecipientSavedAddressEditMode(false))
      yield put(
        updateToolbarIcon({
          section: 'senderSavedAddress',
          key: 'edit',
          value: 'active',
        }),
      )
      // Отключаем редактирование у получателя, если оно было активно
      yield put(
        updateToolbarIcon({
          section: 'recipientSavedAddress',
          key: 'edit',
          value: 'enabled',
        }),
      )
    } else {
      // Выходим из режима редактирования
      yield put(setSenderSavedAddressEditMode(false))
      yield put(
        updateToolbarIcon({
          section: 'senderSavedAddress',
          key: 'edit',
          value: 'enabled',
        }),
      )
    }

    return
  }

  if (section === 'recipientSavedAddress' && key === 'edit') {
    const isEditMode: boolean = yield select(
      (s: {
        envelopeSelection?: { savedRecipientAddressEditMode?: boolean }
      }) => s.envelopeSelection?.savedRecipientAddressEditMode ?? false,
    )

    if (!isEditMode) {
      // Входим в режим редактирования сохранённого адреса получателя
      yield put(setRecipientSavedAddressEditMode(true))
      yield put(setSenderSavedAddressEditMode(false))
      yield put(
        updateToolbarIcon({
          section: 'recipientSavedAddress',
          key: 'edit',
          value: 'active',
        }),
      )
      // Отключаем редактирование у отправителя, если оно было активно
      yield put(
        updateToolbarIcon({
          section: 'senderSavedAddress',
          key: 'edit',
          value: 'enabled',
        }),
      )
    } else {
      // Выходим из режима редактирования
      yield put(setRecipientSavedAddressEditMode(false))
      yield put(
        updateToolbarIcon({
          section: 'recipientSavedAddress',
          key: 'edit',
          value: 'enabled',
        }),
      )
    }

    return
  }

  if (
    section !== 'sender' &&
    section !== 'recipient' &&
    section !== 'recipients' &&
    section !== 'recipientSavedAddress'
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

  if (key === 'addressPlus') {
    if (section === 'sender') {
      const senderDraft: Record<string, string> | null = yield select(
        (s: { envelopeSelection?: { senderDraft?: Record<string, string> | null } }) =>
          s.envelopeSelection?.senderDraft ?? null,
      )
      if (senderDraft != null && Object.keys(senderDraft).length > 0) {
        const isComplete = Object.values(senderDraft).every(
          (v) => (v ?? '').trim() !== '',
        )
        yield put(
          restoreSender({
            data: senderDraft as import('@envelope/domain/types').SenderState['data'],
            isComplete,
            enabled: true,
            applied: false,
          }),
        )
        yield put(setSenderTemplateId(null))
        yield put(clearSenderDraft())
      } else {
        yield put(setSenderTemplateId(null))
        yield put(clearSender())
      }
    } else if (
      section === 'recipient' ||
      section === 'recipientSavedAddress'
    ) {
      const recipientDraft: Record<string, string> | null = yield select(
        (s: { envelopeSelection?: { recipientDraft?: Record<string, string> | null } }) =>
          s.envelopeSelection?.recipientDraft ?? null,
      )
      if (recipientDraft != null && Object.keys(recipientDraft).length > 0) {
        const isComplete = Object.values(recipientDraft).every(
          (v) => (v ?? '').trim() !== '',
        )
        yield put(
          restoreRecipient({
            data: recipientDraft as import('@envelope/domain/types').RecipientState['data'],
            isComplete,
            enabled: false,
            applied: false,
          }),
        )
        yield put(setRecipientTemplateId(null))
        yield put(clearRecipientDraft())
      } else {
        yield put(setRecipientTemplateId(null))
        yield put(clearRecipient())
      }
    }
  }

  if (key === 'apply') {
    if (section === 'sender') {
      const sender: SenderState = yield select(selectSenderState)
      if (sender.isComplete) yield put(setSenderApplied(true))
    }
    if (section === 'recipient' || section === 'recipientSavedAddress') {
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

  if (key === 'listAdd') {
    if (section === 'sender') {
      const sender: SenderState = yield select(selectSenderState)
      if (sender.isComplete) yield put(senderSaveRequested())
    } else if (section === 'recipient') {
      const recipient: RecipientState = yield select(selectRecipientState)
      if (recipient.isComplete) yield put(recipientSaveRequested())
    }
  }

  if (key === 'listDelete' && section === 'recipients') {
    yield put(setRecipientsList([]))
    yield put(clearRecipientSelection())
  }

  if (key === 'addressList') {
    if (section === 'sender') {
      yield put(toggleSenderListPanel())
    } else if (
      section === 'recipient' ||
      section === 'recipients' ||
      section === 'recipientSavedAddress'
    ) {
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
