import type { PayloadAction } from '@reduxjs/toolkit'
import { takeLatest, takeEvery, put, select, call } from 'redux-saga/effects'
import { toolbarAction } from '@toolbar/application/helpers'
import {
  clearSender,
  setSenderApplied,
  setSenderView,
  setSenderViewId,
  clearSenderFormData,
  saveAddressRequested as senderSaveRequested,
} from '@envelope/sender/infrastructure/state'
import {
  clearRecipient,
  setRecipientApplied,
  resetRecipientForm,
  setRecipientView,
  setRecipientViewId,
  setRecipientsViewIds,
  setRecipientMode,
  clearRecipientFormData,
  saveAddressRequested as recipientSaveRequested,
} from '@envelope/recipient/infrastructure/state'
import {
  toggleRecipientListPanel,
  toggleSenderListPanel,
  setRecipientsList,
  clearRecipientsPending,
  setSenderViewEditMode,
  setRecipientViewEditMode,
  setAddressFormView,
  addressSaveSuccess,
} from '@envelope/infrastructure/state'
import {
  selectRecipientsPendingIds,
  selectAddressFormViewRole,
  selectSenderViewEditMode,
  selectRecipientViewEditMode,
} from '@envelope/infrastructure/selectors'
import {
  selectSenderState,
  selectIsSenderComplete,
  selectSenderViewId,
} from '@envelope/sender/infrastructure/selectors'
import {
  selectRecipientState,
  selectIsRecipientComplete,
  selectRecipientViewId,
} from '@envelope/recipient/infrastructure/selectors'
import {
  addAddressTemplateRef,
  removeAddressTemplateRef,
} from '@features/previewStrip/infrastructure/state'
import { removeAddressBookEntry } from '@envelope/addressBook/infrastructure/state'
import { templateService } from '@entities/templates/domain/services/templateService'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import { senderAdapter, recipientAdapter } from '@db/adapters/storeAdapters'
import type { RecipientState, SenderState } from '@envelope/domain/types'
import type { RootState } from '@app/state'

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

function* handleSetAddressFormViewSync(
  _action: PayloadAction<{ show: boolean; role: 'sender' | 'recipient' | null }>,
) {
  // currentView и recipientViewId/senderViewId не сбрасываются при открытии формы,
  // при закрытии компонент сам выставляет view — восстанавливать id не нужно.
}

function* handleEnvelopeToolbarAction(
  action: ReturnType<typeof toolbarAction>,
) {
  const { section, key } = action.payload

  if (section === 'addressList' && key === 'listApply') {
    const recipientListPanelOpen: boolean = yield select(
      selectRecipientListPanelOpen as any,
    )
    if (!recipientListPanelOpen) return

    const recipient: RecipientState = yield select(selectRecipientState)
    if (recipient.mode !== 'recipients') return

    const entries: { id: string }[] = yield select(
      (s: RootState) => s.addressBook?.recipientEntries ?? [],
    )
    const allIds = entries.map((e) => e.id)
    yield put(setRecipientsPendingIds(allIds))
    return
  }

  if (section === 'senderFavorite' && key === 'favorite') {
    const sender: SenderState = yield select(selectSenderState)
    const raw: { id: string; address?: Record<string, string> }[] = yield call([
      senderAdapter,
      'getAll',
    ])
    const match = Array.isArray(raw)
      ? raw.find((r) => addressMatches(sender.addressFormData, r.address))
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
    } else {
      const senderComplete: boolean = yield select(selectIsSenderComplete)
      if (senderComplete) yield put(senderSaveRequested())
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
      ? raw.find((r) => addressMatches(recipient.addressFormData, r.address))
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
    } else {
      const recipientComplete: boolean = yield select(selectIsRecipientComplete)
      if (recipientComplete) yield put(recipientSaveRequested())
    }
    return
  }

  if (
    (section === 'savedAddress' ||
      section === 'senderView' ||
      section === 'recipientView') &&
    key === 'favorite'
  ) {
    const recipientViewId: string | null = yield select(selectRecipientViewId)
    const senderViewId: string | null = yield select(selectSenderViewId)
    const addressTemplateRefs: { type: string; id: string }[] = yield select(
      (s: {
        previewStripOrder: {
          addressTemplateRefs: { type: string; id: string }[]
        }
      }) => s.previewStripOrder?.addressTemplateRefs ?? [],
    )
    let type: 'sender' | 'recipient'
    let templateId: string | null
    if (section === 'senderView') {
      type = 'sender'
      templateId = senderViewId
    } else if (section === 'recipientView') {
      type = 'recipient'
      templateId = recipientViewId
    } else {
      templateId = recipientViewId ?? senderViewId
      type = recipientViewId != null ? 'recipient' : 'sender'
    }
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
    (section === 'savedAddress' ||
      section === 'senderView' ||
      section === 'recipientView') &&
    key === 'delete'
  ) {
    const recipientViewId: string | null = yield select(selectRecipientViewId)
    const senderViewId: string | null = yield select(selectSenderViewId)

    let type: 'sender' | 'recipient'
    let templateId: string | null

    if (section === 'senderView') {
      type = 'sender'
      templateId = senderViewId
    } else if (section === 'recipientView') {
      type = 'recipient'
      templateId = recipientViewId
    } else {
      type = recipientViewId != null ? 'recipient' : 'sender'
      templateId = recipientViewId ?? senderViewId
    }

    if (templateId != null) {
      try {
        const result: { success: boolean } = yield call(
          [templateService, 'deleteAddressTemplate'],
          type,
          templateId,
        )
        if (result.success) {
          yield put(removeAddressTemplateRef({ type, id: templateId }))
          yield put(removeAddressBookEntry({ id: templateId, role: type }))

          // После удаления всегда показываем пустой плейсхолдер (не переключаем на следующий адрес)
          if (type === 'recipient') {
            yield put(setRecipientViewEditMode(false))
            yield put(setRecipientViewId(null))
            yield put(setRecipientView('recipientView'))
            yield put(setAddressFormView({ show: false, role: 'recipient' }))
            yield put(clearRecipientFormData())
          } else {
            yield put(setSenderViewEditMode(false))
            yield put(setSenderViewId(null))
            yield put(setSenderView('senderView'))
            yield put(setAddressFormView({ show: false, role: 'sender' }))
            yield put(clearSenderFormData())
          }
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Failed to delete saved address from toolbar:', e)
      }
    }

    return
  }

  if (section === 'senderView' && key === 'edit') {
    const isEditMode: boolean = yield select(selectSenderViewEditMode)

    if (!isEditMode) {
      // Входим в режим редактирования сохранённого адреса отправителя
      yield put(setSenderViewEditMode(true))
      yield put(setRecipientViewEditMode(false))
      yield put(
        updateToolbarIcon({
          section: 'senderView',
          key: 'edit',
          value: 'active',
        }),
      )
      // Отключаем редактирование у получателя, если оно было активно
      yield put(
        updateToolbarIcon({
          section: 'recipientView',
          key: 'edit',
          value: 'enabled',
        }),
      )
    } else {
      // Выходим из режима редактирования
      yield put(setSenderViewEditMode(false))
      yield put(
        updateToolbarIcon({
          section: 'senderView',
          key: 'edit',
          value: 'enabled',
        }),
      )
    }

    return
  }

  if (section === 'recipientView' && key === 'edit') {
    const isEditMode: boolean = yield select(selectRecipientViewEditMode)

    if (!isEditMode) {
      // Входим в режим редактирования сохранённого адреса получателя
      yield put(setRecipientViewEditMode(true))
      yield put(setSenderViewEditMode(false))
      yield put(
        updateToolbarIcon({
          section: 'recipientView',
          key: 'edit',
          value: 'active',
        }),
      )
      // Отключаем редактирование у отправителя, если оно было активно
      yield put(
        updateToolbarIcon({
          section: 'senderView',
          key: 'edit',
          value: 'enabled',
        }),
      )
    } else {
      // Выходим из режима редактирования
      yield put(setRecipientViewEditMode(false))
      yield put(
        updateToolbarIcon({
          section: 'recipientView',
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
    section !== 'senderView' &&
    section !== 'recipientView' &&
    section !== 'recipientsView' &&
    section !== 'addressFormSenderView' &&
    section !== 'addressFormRecipientView'
  )
    return

  if (key === 'close') {
    if (section === 'sender') {
      yield put(setSenderViewId(null))
      yield put(clearSender())
      yield put(setSenderSource('form'))
    } else {
      yield put(resetRecipientForm())
      yield put(setRecipientSource('form'))
    }
  }

  if (key === 'addressPlus') {
    if (section === 'sender') {
      yield put(setAddressFormView({ show: true, role: 'sender' }))
      yield put(setSenderView('addressFormSenderView'))
      yield put(setSenderViewId(null))
    } else if (
      section === 'recipient' ||
      section === 'recipientView' ||
      section === 'recipients'
    ) {
      const wasInRecipientsMode = section === 'recipients'
      yield put(setAddressFormView({ show: true, role: 'recipient' }))
      yield put(setRecipientView('addressFormRecipientView'))
      if (wasInRecipientsMode) {
        yield put(setRecipientMode('recipients'))
        yield put(setRecipientView('addressFormRecipientView'))
      }
    }
  }

  if (key === 'apply') {
    if (section === 'sender') {
      const senderComplete: boolean = yield select(selectIsSenderComplete)
      if (senderComplete) yield put(setSenderApplied(true))
    }
    if (section === 'recipient' || section === 'recipientView') {
      const recipientComplete: boolean = yield select(selectIsRecipientComplete)
      if (recipientComplete) {
        yield put(setRecipientMode('recipient'))
        yield put(setRecipientApplied(true))
      }
    }
    if (section === 'recipients') {
      const ids: string[] = yield select(selectRecipientsPendingIds)
      const list: RecipientState[] = []
      for (const id of ids) {
        const record: { id: string; address?: Record<string, string> } | null =
          yield call([recipientAdapter, 'getById'], id)
        if (record?.address) {
          const address = record.address as RecipientState['addressFormData']
          list.push({
            currentView: 'recipientView',
            addressFormData: address,
            addressFormIsComplete: Object.values(address).every(
              (v) => (v ?? '').trim() !== ''
            ),
            recipientViewId: id,
            recipientsViewIds: [],
            applied: [id],
            enabled: false,
          })
        }
      }
      yield put(setRecipientMode('recipients'))
      yield put(setRecipientsList(list))
      yield put(
        setRecipientsViewIds(
          list.map((r) => r.recipientViewId).filter((id): id is string => id != null),
        ),
      )
    }
  }

  if (key === 'listAdd') {
    if (section === 'sender') {
      const senderComplete: boolean = yield select(selectIsSenderComplete)
      if (senderComplete) yield put(senderSaveRequested())
    } else if (section === 'recipient') {
      const recipientComplete: boolean = yield select(selectIsRecipientComplete)
      if (recipientComplete) yield put(recipientSaveRequested())
    } else if (
      section === 'addressFormSenderView' ||
      section === 'addressFormRecipientView'
    ) {
      const senderComplete: boolean = yield select(selectIsSenderComplete)
      const recipientComplete: boolean = yield select(selectIsRecipientComplete)
      const isComplete =
        section === 'addressFormSenderView'
          ? senderComplete
          : recipientComplete
      if (isComplete) {
        if (section === 'addressFormSenderView') {
          yield put(senderSaveRequested())
        } else {
          yield put(recipientSaveRequested())
        }
      }
    }
  }

  if (key === 'listDelete' && section === 'recipients') {
    yield put(setRecipientsList([]))
    yield put(setRecipientsViewIds([]))
    yield put(clearRecipientsPending())
  }

  if (key === 'listClose' && section === 'recipientsView') {
    yield put(setRecipientsList([]))
    yield put(setRecipientsViewIds([]))
    yield put(clearRecipientsPending())
  }

  if (
    key === 'listClose' &&
    (section === 'addressFormSenderView' || section === 'addressFormRecipientView')
  ) {
    const role = section === 'addressFormSenderView' ? 'sender' : 'recipient'
    yield put(setAddressFormView({ show: false, role }))
    if (role === 'sender') {
      yield put(setSenderView('senderView'))
    } else {
      const recipient: RecipientState = yield select(selectRecipientState)
      yield put(
        setRecipientView(recipient.mode === 'recipients' ? 'recipientsView' : 'recipientView'),
      )
    }
  }

  if (key === 'addressList') {
    if (section === 'sender') {
      yield put(toggleSenderListPanel())
    } else     if (
      section === 'recipient' ||
      section === 'recipients' ||
      section === 'recipientView'
    ) {
      yield put(toggleRecipientListPanel())
    }
  }

  if (key === 'favorite' && (section === 'sender' || section === 'recipient')) {
    const addressSection = section
    const sender: SenderState = yield select(selectSenderState)
    const recipient: RecipientState = yield select(selectRecipientState)
    const addressData =
      addressSection === 'sender' ? sender.addressFormData : recipient.addressFormData

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

function* handleAddressSaveSuccess(
  action: ReturnType<typeof addressSaveSuccess>,
) {
  const role = action.payload
  const formViewRole: 'sender' | 'recipient' | null = yield select(
    (s: { envelopeSelection?: { addressFormViewRole?: 'sender' | 'recipient' | null } }) =>
      s.envelopeSelection?.addressFormViewRole ?? null,
  )
  if (formViewRole !== role) return
  yield put(setAddressFormView({ show: false, role }))
  if (role === 'sender') {
    yield put(setSenderView('senderView'))
  } else {
    const recipient: RecipientState = yield select(selectRecipientState)
    yield put(
      setRecipientView(recipient.mode === 'recipients' ? 'recipientsView' : 'recipientView'),
    )
  }
}

export function* envelopeToolbarSaga() {
  yield takeLatest(toolbarAction.type, handleEnvelopeToolbarAction)
  yield takeEvery(setAddressFormView.type, handleSetAddressFormViewSync)
  yield takeEvery(addressSaveSuccess.type, handleAddressSaveSuccess)
}
