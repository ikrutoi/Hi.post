import type { PayloadAction } from '@reduxjs/toolkit'
import { takeLatest, takeEvery, put, select, call } from 'redux-saga/effects'
import { toolbarAction } from '@toolbar/application/helpers'
import {
  clearSender,
  setSenderApplied,
  setSenderAppliedIds,
  setSenderAppliedWithData,
  setSenderView,
  setSenderViewId,
  clearSenderFormData,
  toggleSenderSortDirection,
  saveAddressRequested as senderSaveRequested,
} from '@envelope/sender/infrastructure/state'
import {
  clearRecipient,
  setRecipientApplied,
  resetRecipientForm,
  setRecipientView,
  setRecipientViewId,
  setRecipientsViewIds,
  setRecipientsViewIdsSecondList,
  setCurrentRecipientsList,
  setRecipientMode,
  clearRecipientFormData,
  clearRecipientViewDraft,
  toggleRecipientSortDirection,
  toggleRecipientsViewSortDirection,
  setRecipientAppliedIds,
  setRecipientAppliedWithData,
  setRecipientAppliedData,
  saveAddressRequested as recipientSaveRequested,
} from '@envelope/recipient/infrastructure/state'
import {
  setActiveAddressList,
  closeAddressList,
  setRecipientsList,
  setRecipientsPendingIds,
  clearRecipientsPending,
  setSenderViewEditMode,
  setRecipientViewEditMode,
  setAddressFormView,
  addressSaveSuccess,
  removeRecipientFromListByIndex,
  removeRecipientFromListById,
  toggleRecipientSelection,
} from '@envelope/infrastructure/state'
import {
  selectRecipientsPendingIds,
  selectRecipientListPanelOpen,
  selectSenderListPanelOpen,
  selectActiveAddressList,
  selectAddressFormViewRole,
  selectSenderViewEditMode,
  selectRecipientViewEditMode,
} from '@envelope/infrastructure/selectors'
import {
  selectSenderState,
  selectIsSenderComplete,
  selectSenderViewId,
  selectSenderAddress,
} from '@envelope/sender/infrastructure/selectors'
import {
  selectRecipientState,
  selectIsRecipientComplete,
  selectRecipientViewId,
  selectRecipientView,
  selectRecipientDisplayAddress,
} from '@envelope/recipient/infrastructure/selectors'
import {
  addAddressTemplateRef,
  removeAddressTemplateRef,
  incrementAddressBookReloadVersion,
  incrementAddressTemplatesReloadVersion,
} from '@features/previewStrip/infrastructure/state'
import {
  removeAddressBookEntry,
  setAddressBookEntries,
} from '@envelope/addressBook/infrastructure/state'
import { templateService } from '@entities/templates/domain/services/templateService'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import { senderAdapter, recipientAdapter } from '@db/adapters/storeAdapters'
import { getAddressListToolbarFragment } from '@envelope/domain/helpers'
import type { RecipientState, SenderState } from '@envelope/domain/types'
import type { AddressFields } from '@shared/config/constants'
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
  _action: PayloadAction<{
    show: boolean
    role: 'sender' | 'recipient' | null
  }>,
) {
  // currentView и recipientViewId/senderViewId не сбрасываются при открытии формы,
  // при закрытии компонент сам выставляет view — восстанавливать id не нужно.
}

function* handleEnvelopeToolbarAction(
  action: ReturnType<typeof toolbarAction>,
) {
  const { section, key } = action.payload

  const isRecipientAddressListSection =
    section === 'addressListRecipient' || section === 'addressListRecipients'

  if (section === 'addressListSender' && key === 'sortDown') {
    yield put(toggleSenderSortDirection())
    return
  }
  if (isRecipientAddressListSection && key === 'sortDown') {
    yield put(toggleRecipientSortDirection())
    return
  }

  if (section === 'addressListSender' && key === 'listDelete') {
    // Удаляем все адреса отправителя из IndexedDB и сразу очищаем список в состоянии
    yield call([senderAdapter, 'clear'])
    yield put(setAddressBookEntries({ sender: [] }))
    yield call(syncAddressListIconsFromActive)
    return
  }

  if (isRecipientAddressListSection && key === 'listDelete') {
    // Удаляем все адреса получателя из IndexedDB и сразу очищаем список в состоянии
    yield call([recipientAdapter, 'clear'])
    yield put(setAddressBookEntries({ recipient: [] }))
    yield call(syncAddressListIconsFromActive)
    return
  }

  if (section === 'recipientsView' && key === 'sortDown') {
    yield put(toggleRecipientsViewSortDirection())
    return
  }

  if (isRecipientAddressListSection && key === 'listApply') {
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

    if (
      recipient.currentRecipientsList === 'first' &&
      (recipient.recipientsViewIdsSecondList?.length ?? 0) === 0
    ) {
      yield put(setRecipientsViewIdsSecondList(allIds))
      yield put(setCurrentRecipientsList('second'))
      yield put(setRecipientsPendingIds(allIds))
      return
    }

    if (recipient.currentRecipientsList === 'first') {
      yield put(setCurrentRecipientsList('second'))
      yield put(setRecipientsPendingIds(recipient.recipientsViewIdsSecondList))
    } else {
      yield put(setCurrentRecipientsList('first'))
      yield put(setRecipientsPendingIds(recipient.recipientsViewIdsFirstList))
    }
    return
  }

  if (key === 'addressList') {
    const active: 'sender' | 'recipient' | 'recipients' | null = yield select(
      selectActiveAddressList,
    )
    if (section === 'sender' || section === 'addressListSender') {
      yield put(setActiveAddressList(active === 'sender' ? null : 'sender'))
      return
    }
    if (
      section === 'recipient' ||
      section === 'recipients' ||
      section === 'recipientView' ||
      section === 'addressListRecipient'
    ) {
      const listOpen = active === 'recipient' || active === 'recipients'
      const nextMode: 'recipient' | 'recipients' | null = listOpen
        ? null
        : section === 'recipients'
          ? 'recipients'
          : 'recipient'
      yield put(setActiveAddressList(nextMode))
      yield call(syncAddressListIconsFromActive)
      return
    }
  }

  if (section === 'senderFavorite' && key === 'favorite') {
    const sender: SenderState = yield select(selectSenderState)
    const raw: { id: string; address?: Record<string, string> }[] = yield call([
      senderAdapter,
      'getAll',
    ])
    const match = Array.isArray(raw)
      ? raw.find((r) => addressMatches(sender.viewDraft, r.address))
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
      if (senderComplete)
        yield put(senderSaveRequested({ listStatus: 'inList' }))
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
      ? raw.find((r) => addressMatches(recipient.viewDraft, r.address))
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
      if (recipientComplete)
        yield put(recipientSaveRequested({ listStatus: 'inList' }))
    }
    return
  }

  if (
    (section === 'senderView' || section === 'recipientView') &&
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
    (section === 'senderView' || section === 'recipientView') &&
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

          if (type === 'recipient') {
            yield put(setRecipientViewEditMode(false))
            yield put(setRecipientViewId(null))
            yield put(setRecipientView('recipientView'))
            yield put(setAddressFormView({ show: false, role: null }))
            yield put(clearRecipientFormData())
            yield put(clearRecipientViewDraft())
          } else {
            yield put(setSenderViewEditMode(false))
            yield put(setSenderViewId(null))
            yield put(setSenderView('senderView'))
            yield put(setAddressFormView({ show: false, role: null }))
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
      yield put(setSenderViewEditMode(true))
      yield put(setRecipientViewEditMode(false))
      yield put(
        updateToolbarIcon({
          section: 'senderView',
          key: 'edit',
          value: 'active',
        }),
      )
      yield put(
        updateToolbarIcon({
          section: 'recipientView',
          key: 'edit',
          value: 'enabled',
        }),
      )
    } else {
      const sender: SenderState = yield select(selectSenderState)
      const senderViewId: string | null = yield select(selectSenderViewId)

      if (senderViewId != null) {
        try {
          const result: { success: boolean } = yield call(
            [templateService, 'updateAddressTemplate'],
            'sender',
            senderViewId,
            { address: sender.viewDraft },
          )
          if (result.success) {
            yield put(incrementAddressBookReloadVersion())
            yield put(incrementAddressTemplatesReloadVersion())
          } else {
            // eslint-disable-next-line no-console
            console.warn('Failed to update sender address template')
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn('Error while updating sender address template:', e)
        }
      }

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
      yield put(setRecipientViewEditMode(true))
      yield put(setSenderViewEditMode(false))
      yield put(
        updateToolbarIcon({
          section: 'recipientView',
          key: 'edit',
          value: 'active',
        }),
      )
      yield put(
        updateToolbarIcon({
          section: 'senderView',
          key: 'edit',
          value: 'enabled',
        }),
      )
    } else {
      const recipient: RecipientState = yield select(selectRecipientState)
      const recipientViewId: string | null = yield select(selectRecipientViewId)

      if (recipientViewId != null) {
        try {
          const result: { success: boolean } = yield call(
            [templateService, 'updateAddressTemplate'],
            'recipient',
            recipientViewId,
            { address: recipient.viewDraft },
          )
          if (result.success) {
            yield put(incrementAddressBookReloadVersion())
            yield put(incrementAddressTemplatesReloadVersion())
          } else {
            // eslint-disable-next-line no-console
            console.warn('Failed to update recipient address template')
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn('Error while updating recipient address template:', e)
        }
      }

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
    section !== 'addressFormRecipientView' &&
    section !== 'addressListSender' &&
    section !== 'addressListRecipient'
  )
    return

  if (key === 'close') {
    if (section === 'sender') {
      yield put(setSenderViewId(null))
      yield put(clearSender())
    } else {
      yield put(resetRecipientForm())
    }
  }

  if (key === 'addressAdd') {
    if (section === 'sender') {
      yield put(setAddressFormView({ show: true, role: 'sender' }))
      yield put(clearSenderFormData())
      yield put(setSenderView('addressFormSenderView'))
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
      // Статус apply (enabled/disabled) уже посчитан в envelopeProcessSaga.
      // Здесь доверяем тулбару и не дублируем проверку formIsComplete.
      const senderViewId: string | null = yield select(selectSenderViewId)
      if (senderViewId) {
        const displayAddress: Readonly<Record<string, string>> = yield select(
          selectSenderAddress,
        )
        const data: AddressFields[] = [{ ...displayAddress } as AddressFields]
        yield put(setSenderAppliedWithData({ ids: [senderViewId], data }))
      } else {
        yield put(senderSaveRequested({ listStatus: 'outList' }))
      }
    }
    if (section === 'recipient') {
      const recipientViewId: string | null = yield select(selectRecipientViewId)
      if (recipientViewId) {
        const displayAddress: Readonly<Record<string, string>> = yield select(
          selectRecipientDisplayAddress,
        )
        const data: AddressFields[] = [{ ...displayAddress } as AddressFields]
        yield put(setRecipientAppliedWithData({ ids: [recipientViewId], data }))
        yield put(setRecipientMode('recipient'))
      } else {
        yield put(recipientSaveRequested({ listStatus: 'outList' }))
      }
    }
    if (section === 'recipients') {
      const recipient: RecipientState = yield select(selectRecipientState)
      const ids: string[] =
        recipient.currentRecipientsList === 'second'
          ? (recipient.recipientsViewIdsSecondList ?? [])
          : (recipient.recipientsViewIdsFirstList ?? [])
      const list: RecipientState[] = []
      for (const id of ids) {
        const record: { id: string; address?: Record<string, string> } | null =
          yield call([recipientAdapter, 'getById'], id)
        if (record?.address) {
          const address = record.address as RecipientState['viewDraft']
          list.push({
            currentView: 'recipientView',
            formDraft: address,
            viewDraft: address,
            formIsComplete: Object.values(address).every(
              (v) => (v ?? '').trim() !== '',
            ),
            formIsEmpty: true,
            sortOptions: { sortedBy: 'name', direction: 'asc' },
            recipientsViewSortDirection: 'asc',
            recipientViewId: id,
            recipientsViewIdsFirstList: [],
            recipientsViewIdsSecondList: [],
            currentRecipientsList: 'first',
            applied: [id],
            appliedData: address,
            mode: 'recipient',
          })
        }
      }
      yield put(setRecipientMode('recipients'))
      const appliedData = list.map((r) => ({ ...r.viewDraft }))
      yield put(setRecipientAppliedWithData({ ids, data: appliedData }))
      yield put(setRecipientsList(list))
      yield put(
        setRecipientsViewIds(
          list
            .map((r) => r.recipientViewId)
            .filter((id): id is string => id != null),
        ),
      )
    }
  }

  if (key === 'listAdd') {
    if (section === 'sender') {
      const senderComplete: boolean = yield select(selectIsSenderComplete)
      if (senderComplete) yield put(senderSaveRequested({ listStatus: 'inList' }))
    } else if (section === 'recipient') {
      const recipientComplete: boolean = yield select(selectIsRecipientComplete)
      if (recipientComplete)
        yield put(recipientSaveRequested({ listStatus: 'inList' }))
    } else if (
      section === 'addressFormSenderView' ||
      section === 'addressFormRecipientView'
    ) {
      const senderComplete: boolean = yield select(selectIsSenderComplete)
      const recipientComplete: boolean = yield select(selectIsRecipientComplete)
      const isComplete =
        section === 'addressFormSenderView' ? senderComplete : recipientComplete
      if (isComplete) {
        if (section === 'addressFormSenderView') {
          yield put(senderSaveRequested({ listStatus: 'inList' }))
        } else {
          yield put(recipientSaveRequested({ listStatus: 'inList' }))
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
    (section === 'addressFormSenderView' ||
      section === 'addressFormRecipientView')
  ) {
    const role = section === 'addressFormSenderView' ? 'sender' : 'recipient'
    yield put(setAddressFormView({ show: false, role: null }))
    if (role === 'sender') {
      yield put(setSenderView('senderView'))
    } else {
      const recipient: RecipientState = yield select(selectRecipientState)
      yield put(
        setRecipientView(
          recipient.mode === 'recipients' ? 'recipientsView' : 'recipientView',
        ),
      )
    }
  }

  if (key === 'favorite' && (section === 'sender' || section === 'recipient')) {
    const addressSection = section
    const sender: SenderState = yield select(selectSenderState)
    const recipient: RecipientState = yield select(selectRecipientState)
    const addressData =
      addressSection === 'sender' ? sender.viewDraft : recipient.viewDraft

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
      yield put(incrementAddressTemplatesReloadVersion())
    }
  }
}

function* handleAddressSaveSuccess(
  action: ReturnType<typeof addressSaveSuccess>,
) {
  const role = action.payload
  const formViewRole: 'sender' | 'recipient' | null = yield select(
    (s: {
      envelopeSelection?: {
        addressFormViewRole?: 'sender' | 'recipient' | null
      }
    }) => s.envelopeSelection?.addressFormViewRole ?? null,
  )
  if (formViewRole !== role) return
  yield put(setAddressFormView({ show: false, role: null }))
  if (role === 'sender') {
    yield put(setSenderView('senderView'))
  } else {
    const recipient: RecipientState = yield select(selectRecipientState)
    yield put(
      setRecipientView(
        recipient.mode === 'recipients' ? 'recipientsView' : 'recipientView',
      ),
    )
  }
}

function* handleRemoveRecipientFromListByIndex(action: PayloadAction<number>) {
  const index = action.payload
  const recipient: RecipientState = yield select(selectRecipientState)
  const viewList: string[] =
    recipient.currentRecipientsList === 'second'
      ? (recipient.recipientsViewIdsSecondList ?? [])
      : (recipient.recipientsViewIdsFirstList ?? [])
  const templateId = viewList[index] ?? null
  if (templateId == null) return

  const firstList: string[] = yield select(
    (s: RootState) => s.recipient?.recipientsViewIdsFirstList ?? [],
  )
  yield put(setRecipientsViewIds(firstList.filter((id) => id !== templateId)))
  if (recipient.currentRecipientsList === 'second') {
    const secondList: string[] = yield select(
      (s: RootState) => s.recipient?.recipientsViewIdsSecondList ?? [],
    )
    yield put(
      setRecipientsViewIdsSecondList(
        secondList.filter((id) => id !== templateId),
      ),
    )
  }
  const pending: string[] = yield select(selectRecipientsPendingIds)
  yield put(setRecipientsPendingIds(pending.filter((id) => id !== templateId)))
}

function* handleRemoveRecipientFromListById(action: PayloadAction<string>) {
  const templateId = action.payload
  if (!templateId) return
  const recipient: RecipientState = yield select(selectRecipientState)

  const firstList: string[] = yield select(
    (s: RootState) => s.recipient?.recipientsViewIdsFirstList ?? [],
  )
  yield put(setRecipientsViewIds(firstList.filter((id) => id !== templateId)))
  if (recipient.currentRecipientsList === 'second') {
    const secondList: string[] = yield select(
      (s: RootState) => s.recipient?.recipientsViewIdsSecondList ?? [],
    )
    yield put(
      setRecipientsViewIdsSecondList(
        secondList.filter((id) => id !== templateId),
      ),
    )
  }
  const pending: string[] = yield select(selectRecipientsPendingIds)
  yield put(setRecipientsPendingIds(pending.filter((id) => id !== templateId)))
}

function* syncRecipientsViewIdsFromPending() {
  const recipient: RecipientState = yield select(selectRecipientState)
  if (recipient.mode !== 'recipients') return
  const pendingIds: string[] = yield select(selectRecipientsPendingIds)
  if (recipient.currentRecipientsList === 'second') {
    yield put(setRecipientsViewIdsSecondList(pendingIds))
  } else {
    yield put(setRecipientsViewIds(pendingIds))
  }
}

function* syncEditIconOnEditModeChange(action: PayloadAction<boolean>) {
  const isEditMode = action.payload
  if (isEditMode) return

  if (action.type === setSenderViewEditMode.type) {
    yield put(
      updateToolbarIcon({
        section: 'senderView',
        key: 'edit',
        value: 'enabled',
      }),
    )
  }
  if (action.type === setRecipientViewEditMode.type) {
    const recipient: RecipientState = yield select(selectRecipientState)
    const currentView: string = yield select(selectRecipientView)
    if (recipient.mode === 'recipients' && currentView === 'recipientView') {
      yield put(setRecipientView('recipientsView'))
    }
    yield put(
      updateToolbarIcon({
        section: 'recipientView',
        key: 'edit',
        value: 'enabled',
      }),
    )
  }
}

function* syncAddressListIconsFromActive() {
  const active: 'sender' | 'recipient' | 'recipients' | null = yield select(
    selectActiveAddressList,
  )
  const senderEntries: { id: string }[] = yield select(
    (s: RootState) => s.addressBook?.senderEntries ?? [],
  )
  const recipientEntries: { id: string }[] = yield select(
    (s: RootState) => s.addressBook?.recipientEntries ?? [],
  )
  const senderCount = senderEntries.length
  const recipientCount = recipientEntries.length

  const senderAddressList =
    active === 'sender'
      ? {
          state: 'active' as const,
          options: { badge: senderCount > 0 ? senderCount : null },
        }
      : getAddressListToolbarFragment(senderCount)

  const recipientSectionAddressList =
    active === 'recipient'
      ? {
          state: 'active' as const,
          options: { badge: recipientCount > 0 ? recipientCount : null },
        }
      : getAddressListToolbarFragment(recipientCount)

  const recipientsSectionAddressList =
    active === 'recipients'
      ? {
          state: 'active' as const,
          options: { badge: recipientCount > 0 ? recipientCount : null },
        }
      : getAddressListToolbarFragment(recipientCount)

  const addressListRecipientValue =
    active === 'recipient' || active === 'recipients'
      ? {
          state: 'active' as const,
          options: { badge: recipientCount > 0 ? recipientCount : null },
        }
      : getAddressListToolbarFragment(recipientCount)

  yield put(
    updateToolbarIcon({
      section: 'sender',
      key: 'addressList',
      value: senderAddressList,
    }),
  )
  yield put(
    updateToolbarIcon({
      section: 'addressListSender',
      key: 'addressList',
      value: senderAddressList,
    }),
  )
  yield put(
    updateToolbarIcon({
      section: 'recipient',
      key: 'addressList',
      value: recipientSectionAddressList,
    }),
  )
  yield put(
    updateToolbarIcon({
      section: 'recipients',
      key: 'addressList',
      value: recipientsSectionAddressList,
    }),
  )
  yield put(
    updateToolbarIcon({
      section: 'addressListRecipient',
      key: 'addressList',
      value: addressListRecipientValue,
    }),
  )
}

export function* envelopeToolbarSaga() {
  yield takeLatest(toolbarAction.type, handleEnvelopeToolbarAction)
  yield takeEvery(
    [setSenderViewEditMode.type, setRecipientViewEditMode.type],
    syncEditIconOnEditModeChange,
  )
  yield takeEvery(
    removeRecipientFromListByIndex.type,
    handleRemoveRecipientFromListByIndex,
  )
  yield takeEvery(
    removeRecipientFromListById.type,
    handleRemoveRecipientFromListById,
  )
  yield takeEvery(setAddressFormView.type, handleSetAddressFormViewSync)
  yield takeEvery(addressSaveSuccess.type, handleAddressSaveSuccess)
  yield takeEvery(
    [setRecipientsPendingIds.type, toggleRecipientSelection.type],
    syncRecipientsViewIdsFromPending,
  )
  yield takeEvery(setActiveAddressList.type, syncAddressListIconsFromActive)
  yield takeEvery(setRecipientMode.type, syncAddressListIconsFromActive)
  yield takeEvery(closeAddressList.type, syncAddressListIconsFromActive)
}
