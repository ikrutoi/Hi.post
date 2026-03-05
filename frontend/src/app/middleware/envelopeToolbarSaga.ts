import type { PayloadAction } from '@reduxjs/toolkit'
import { takeLatest, takeEvery, put, select, call } from 'redux-saga/effects'
import { toolbarAction } from '@toolbar/application/helpers'
import {
  clearSender,
  setSenderApplied,
  setSenderAppliedIds,
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
  removeAppliedAt,
  saveAddressRequested as recipientSaveRequested,
} from '@envelope/recipient/infrastructure/state'
import {
  toggleRecipientListPanel,
  toggleSenderListPanel,
  setRecipientsList,
  setRecipientsPendingIds,
  clearRecipientsPending,
  setSenderViewEditMode,
  setRecipientViewEditMode,
  setAddressFormView,
  addressSaveSuccess,
  removeRecipientAt,
  removeRecipientFromListByIndex,
  removeRecipientFromListById,
  toggleRecipientSelection,
} from '@envelope/infrastructure/state'
import {
  selectRecipientsPendingIds,
  selectRecipientListPanelOpen,
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
  selectRecipientDisplayAddress,
} from '@envelope/recipient/infrastructure/selectors'
import {
  addAddressTemplateRef,
  removeAddressTemplateRef,
  incrementAddressBookReloadVersion,
  incrementAddressTemplatesReloadVersion,
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

  if (section === 'addressListSender' && key === 'sortDown') {
    yield put(toggleSenderSortDirection())
    return
  }
  if (section === 'addressListRecipient' && key === 'sortDown') {
    yield put(toggleRecipientSortDirection())
    return
  }

  if (section === 'recipientsView' && key === 'sortDown') {
    yield put(toggleRecipientsViewSortDirection())
    return
  }

  if (section === 'addressListRecipient' && key === 'listApply') {
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
      if (recipientComplete) yield put(recipientSaveRequested())
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
            yield put(setAddressFormView({ show: false, role: 'recipient' }))
            yield put(clearRecipientFormData())
            yield put(clearRecipientViewDraft())
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
    section !== 'addressFormRecipientView'
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
      const senderComplete: boolean = yield select(selectIsSenderComplete)
      if (senderComplete) {
        const senderViewId: string | null = yield select(selectSenderViewId)
        const appliedIds = senderViewId ? [senderViewId] : []
        yield put(setSenderAppliedIds(appliedIds))
      }
    }
    if (section === 'recipient') {
      const recipientComplete: boolean = yield select(selectIsRecipientComplete)
      if (recipientComplete) {
        // Read current selection BEFORE setRecipientMode, otherwise reducer overwrites recipientViewId with old applied[0]
        const recipientViewId: string | null = yield select(
          selectRecipientViewId,
        )
        const displayAddress: Readonly<Record<string, string>> = yield select(
          selectRecipientDisplayAddress,
        )
        const appliedIds = recipientViewId ? [recipientViewId] : []
        const data = appliedIds.length
          ? [{ ...displayAddress }]
          : []
        yield put(setRecipientAppliedWithData({ ids: appliedIds, data }))
        yield put(setRecipientMode('recipient'))
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
        section === 'addressFormSenderView' ? senderComplete : recipientComplete
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
    (section === 'addressFormSenderView' ||
      section === 'addressFormRecipientView')
  ) {
    const role = section === 'addressFormSenderView' ? 'sender' : 'recipient'
    yield put(setAddressFormView({ show: false, role }))
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

  if (key === 'addressList') {
    if (section === 'sender') {
      yield put(toggleSenderListPanel())
    } else if (
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
  yield put(setAddressFormView({ show: false, role }))
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

function* handleRemoveRecipientFromListByIndex(
  action: PayloadAction<number>,
) {
  const index = action.payload
  const recipient: RecipientState = yield select(selectRecipientState)
  const viewList: string[] =
    recipient.currentRecipientsList === 'second'
      ? (recipient.recipientsViewIdsSecondList ?? [])
      : (recipient.recipientsViewIdsFirstList ?? [])
  const templateId = viewList[index] ?? null
  if (templateId == null) return

  const envelopeRecipients: RecipientState[] = yield select(
    (s: RootState) => s.envelopeRecipients ?? [],
  )
  const envelopeIndex = envelopeRecipients.findIndex(
    (r) => r.recipientViewId === templateId,
  )
  if (envelopeIndex >= 0) {
    yield put(removeRecipientAt(envelopeIndex))
  }
  const applied: string[] = yield select(
    (s: RootState) => s.recipient?.applied ?? [],
  )
  const appliedIndex = applied.indexOf(templateId)
  if (appliedIndex >= 0) {
    yield put(removeAppliedAt(appliedIndex))
  }
  const appliedAfter: string[] = yield select(
    (s: RootState) => s.recipient?.applied ?? [],
  )
  if (appliedAfter.length === 0) {
    yield put(setRecipientAppliedData(null))
  } else if (appliedAfter.length === 1) {
    const list: RecipientState[] = yield select(
      (s: RootState) => s.envelopeRecipients ?? [],
    )
    const entry = list.find((r) => r.recipientViewId === appliedAfter[0])
    if (entry?.viewDraft) {
      yield put(setRecipientAppliedData(entry.viewDraft))
    }
  }
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

function* handleRemoveRecipientFromListById(
  action: PayloadAction<string>,
) {
  const templateId = action.payload
  if (!templateId) return
  const recipient: RecipientState = yield select(selectRecipientState)
  const envelopeRecipients: RecipientState[] = yield select(
    (s: RootState) => s.envelopeRecipients ?? [],
  )
  const envelopeIndex = envelopeRecipients.findIndex(
    (r) => r.recipientViewId === templateId,
  )
  if (envelopeIndex >= 0) {
    yield put(removeRecipientAt(envelopeIndex))
  }
  const applied: string[] = yield select(
    (s: RootState) => s.recipient?.applied ?? [],
  )
  const appliedIndex = applied.indexOf(templateId)
  if (appliedIndex >= 0) {
    yield put(removeAppliedAt(appliedIndex))
  }
  const appliedAfter: string[] = yield select(
    (s: RootState) => s.recipient?.applied ?? [],
  )
  if (appliedAfter.length === 0) {
    yield put(setRecipientAppliedData(null))
  } else if (appliedAfter.length === 1) {
    const list: RecipientState[] = yield select(
      (s: RootState) => s.envelopeRecipients ?? [],
    )
    const entry = list.find((r) => r.recipientViewId === appliedAfter[0])
    if (entry?.viewDraft) {
      yield put(setRecipientAppliedData(entry.viewDraft))
    }
  }
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

export function* envelopeToolbarSaga() {
  yield takeLatest(toolbarAction.type, handleEnvelopeToolbarAction)
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
}
