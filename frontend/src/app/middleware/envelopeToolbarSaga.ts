import type { PayloadAction } from '@reduxjs/toolkit'
import { takeLatest, takeEvery, put, select, call } from 'redux-saga/effects'
import { toolbarAction } from '@toolbar/application/helpers'
import {
  clearSender,
  setSenderApplied,
  setSenderAppliedIds,
  setSenderAppliedWithData,
  setSenderAppliedData,
  setSenderView,
  setSenderViewId,
  clearSenderFormData,
  clearSenderViewDraft,
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
  selectRecipientsFormAddressListCount,
} from '@envelope/recipient/infrastructure/selectors'
import {
  removeAddressTemplateRef,
  incrementAddressBookReloadVersion,
  incrementAddressTemplatesReloadVersion,
} from '@features/previewStrip/infrastructure/state'
import {
  setAddressBookMode,
  addAddressBookEntry,
  removeAddressBookEntry,
  setAddressBookEntries,
} from '@envelope/addressBook/infrastructure/state'
import { templateService } from '@entities/templates/domain/services/templateService'
import {
  updateToolbarIcon,
  updateToolbarSection,
} from '@toolbar/infrastructure/state'
import { senderAdapter, recipientAdapter } from '@db/adapters/storeAdapters'
import { getAddressListToolbarFragment } from '@envelope/domain/helpers'
import type { RecipientState, SenderState } from '@envelope/domain/types'
import type { AddressFields } from '@shared/config/constants'
import type { RootState } from '@app/state'

function* handleSetAddressFormViewSync(
  _action: PayloadAction<{
    show: boolean
    role: 'sender' | 'recipient' | null
  }>,
) {}

/** Полное удаление шаблона из БД (корзина в тулбаре). */
function* deleteAddressTemplateFromToolbar(
  section: 'senderView' | 'recipientView',
) {
  const recipientViewId: string | null = yield select(selectRecipientViewId)
  const senderViewId: string | null = yield select(selectSenderViewId)

  const type: 'sender' | 'recipient' =
    section === 'senderView' ? 'sender' : 'recipient'
  const templateId =
    section === 'senderView' ? senderViewId : recipientViewId

  if (templateId == null) return

  try {
    const result: { success: boolean } = yield call(
      [templateService, 'deleteAddressTemplate'],
      type,
      templateId,
    )
    if (!result.success) return

    yield put(removeAddressTemplateRef({ type, id: templateId }))
    yield put(removeAddressBookEntry({ id: templateId, role: type }))
    yield put(incrementAddressTemplatesReloadVersion())
    yield put(incrementAddressBookReloadVersion())

    if (type === 'sender') {
      const sender: SenderState = yield select(selectSenderState)
      if (sender.applied?.includes(templateId)) {
        yield put(setSenderApplied(false))
      }
      yield put(setSenderViewEditMode(false))
      yield put(setSenderViewId(null))
      yield put(setSenderView('senderView'))
      yield put(setAddressFormView({ show: false, role: null }))
      yield put(clearSenderFormData())
      yield put(clearSenderViewDraft())
    } else {
      const recipient: RecipientState = yield select(selectRecipientState)
      const nextApplied = (recipient.applied ?? []).filter((id) => id !== templateId)
      if (nextApplied.length === 0) {
        yield put(setRecipientApplied(false))
      } else {
        yield put(setRecipientAppliedIds(nextApplied))
      }
      yield put(setRecipientViewEditMode(false))
      yield put(setRecipientViewId(null))
      yield put(setRecipientView('recipientsView'))
      yield put(setAddressFormView({ show: false, role: null }))
      yield put(clearRecipientFormData())
      yield put(clearRecipientViewDraft())
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Failed to delete address template from toolbar:', e)
  }
}

/** Снять шаблон с быстрого списка (outList в БД); адрес на конверте и в форме не трогаем. */
function* moveAddressTemplateToOutListFromToolbar(
  section: 'senderView' | 'recipientView',
) {
  const type: 'sender' | 'recipient' =
    section === 'senderView' ? 'sender' : 'recipient'
  const templateId: string | null =
    section === 'senderView'
      ? yield select(selectSenderViewId)
      : yield select(selectRecipientViewId)

  if (templateId == null) return

  try {
    const result: { success: boolean } = yield call(
      [templateService, 'updateAddressTemplate'],
      type,
      templateId,
      { listStatus: 'outList' },
    )
    if (!result.success) return

    yield put(removeAddressBookEntry({ id: templateId, role: type }))
    yield put(incrementAddressTemplatesReloadVersion())
    yield put(incrementAddressBookReloadVersion())
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Failed to move address template to outList:', e)
  }
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
    yield call([senderAdapter, 'clear'])
    yield put(setAddressBookEntries({ sender: [] }))
    yield call(syncAddressListIconsFromActive)
    return
  }

  if (isRecipientAddressListSection && key === 'listDelete') {
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
    const active: 'sender' | 'recipients' | null = yield select(
      selectActiveAddressList,
    )
    if (section === 'sender' || section === 'addressListSender') {
      yield put(setActiveAddressList(active === 'sender' ? null : 'sender'))
      return
    }
    if (
      section === 'recipients' ||
      section === 'recipientView' ||
      section === 'addressListRecipient'
    ) {
      const listOpen = active === 'recipients'
      const nextMode: 'recipients' | null = listOpen ? null : 'recipients'
      yield put(setActiveAddressList(nextMode))
      yield call(syncAddressListIconsFromActive)
      return
    }
  }

  if (
    (section === 'senderView' || section === 'recipientView') &&
    key === 'addList'
  ) {
    if (section === 'senderView') {
      const senderViewId: string | null = yield select(selectSenderViewId)
      const senderEntries: { id: string }[] = yield select(
        (s: RootState) => s.addressBook?.senderEntries ?? [],
      )
      const sender: SenderState = yield select(selectSenderState)
      const draft =
        sender.currentView === 'addressFormSenderView'
          ? sender.formDraft
          : sender.viewDraft
      if (!Object.values(draft).every((v) => (v ?? '').trim() !== '')) return

      if (senderViewId == null) {
        yield put(senderSaveRequested({ listStatus: 'inList' }))
      } else if (senderEntries.some((e) => e.id === senderViewId)) {
        return
      } else {
        const result: { success: boolean } = yield call(
          [templateService, 'updateAddressTemplate'],
          'sender',
          senderViewId,
          { listStatus: 'inList' },
        )
        if (!result.success) return
        const cleaned = { ...draft } as AddressFields
        yield put(
          addAddressBookEntry({
            id: senderViewId,
            role: 'sender',
            address: cleaned,
            createdAt: new Date().toISOString(),
            listStatus: 'inList',
          }),
        )
        yield put(incrementAddressTemplatesReloadVersion())
        yield put(incrementAddressBookReloadVersion())
      }
    } else {
      const recipientViewId: string | null = yield select(selectRecipientViewId)
      const recipientEntries: { id: string }[] = yield select(
        (s: RootState) => s.addressBook?.recipientEntries ?? [],
      )
      const recipient: RecipientState = yield select(selectRecipientState)
      const draft =
        recipient.currentView === 'addressFormRecipientView'
          ? recipient.formDraft
          : recipient.viewDraft
      if (!Object.values(draft).every((v) => (v ?? '').trim() !== '')) return

      if (recipientViewId == null) {
        yield put(recipientSaveRequested({ listStatus: 'inList' }))
      } else if (recipientEntries.some((e) => e.id === recipientViewId)) {
        return
      } else {
        const result: { success: boolean } = yield call(
          [templateService, 'updateAddressTemplate'],
          'recipient',
          recipientViewId,
          { listStatus: 'inList' },
        )
        if (!result.success) return
        const cleaned = { ...draft } as AddressFields
        yield put(
          addAddressBookEntry({
            id: recipientViewId,
            role: 'recipient',
            address: cleaned,
            createdAt: new Date().toISOString(),
            listStatus: 'inList',
          }),
        )
        yield put(incrementAddressTemplatesReloadVersion())
        yield put(incrementAddressBookReloadVersion())
      }
    }
    return
  }

  if (
    (section === 'senderView' || section === 'recipientView') &&
    key === 'removeFromList'
  ) {
    yield* moveAddressTemplateToOutListFromToolbar(section)
    return
  }

  if (
    (section === 'senderView' || section === 'recipientView') &&
    key === 'delete'
  ) {
    yield* deleteAddressTemplateFromToolbar(section)
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
            if (sender.applied?.[0] === senderViewId) {
              yield put(setSenderAppliedData(sender.viewDraft))
            }
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
            if (recipient.applied?.[0] === recipientViewId) {
              yield put(setRecipientAppliedData(recipient.viewDraft))
            }
            const envelopeRecipients: RecipientState[] = yield select(
              (state: RootState) => state.envelopeRecipients ?? [],
            )
            if (envelopeRecipients.length > 0) {
              const nextList: RecipientState[] = envelopeRecipients.map((r) =>
                r.recipientViewId === recipientViewId
                  ? {
                      ...r,
                      viewDraft: recipient.viewDraft,
                      formIsComplete: Object.values(recipient.viewDraft).every(
                        (v) => (v ?? '').trim() !== '',
                      ),
                    }
                  : r,
              )
              yield put(setRecipientsList(nextList))
            }
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
      section === 'recipientView' ||
      section === 'recipients'
    ) {
      yield put(setAddressFormView({ show: true, role: 'recipient' }))
      yield put(setRecipientView('addressFormRecipientView'))
    }
  }

  if (key === 'apply') {
    if (section === 'sender') {
      const senderViewId: string | null = yield select(selectSenderViewId)
      if (senderViewId) {
        const displayAddress: Readonly<Record<string, string>> =
          yield select(selectSenderAddress)
        const data: AddressFields[] = [{ ...displayAddress } as AddressFields]
        yield put(setSenderAppliedWithData({ ids: [senderViewId], data }))
      } else {
        yield put(senderSaveRequested({ listStatus: 'outList' }))
      }
    }
    if (section === 'recipients') {
      const recipient: RecipientState = yield select(selectRecipientState)
      const ids: string[] =
        recipient.currentRecipientsList === 'second'
          ? (recipient.recipientsViewIdsSecondList ?? [])
          : (recipient.recipientsViewIdsFirstList ?? [])

      if (ids.length === 0) {
        const recipientViewId: string | null = yield select(
          selectRecipientViewId,
        )
        if (recipientViewId) {
          const displayAddress: Readonly<Record<string, string>> =
            yield select(selectRecipientDisplayAddress)
          const data: AddressFields[] = [{ ...displayAddress } as AddressFields]
          yield put(setRecipientAppliedWithData({ ids: [recipientViewId], data }))
        } else {
          yield put(recipientSaveRequested({ listStatus: 'outList' }))
        }
        return
      }

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
          })
        }
      }
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
      if (senderComplete)
        yield put(senderSaveRequested({ listStatus: 'inList' }))
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
      yield put(setRecipientView('recipientsView'))
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
    yield put(setRecipientView('recipientsView'))
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
  const pendingIds: string[] = yield select(selectRecipientsPendingIds)
  if (recipient.currentRecipientsList === 'second') {
    yield put(setRecipientsViewIdsSecondList(pendingIds))
  } else {
    yield put(setRecipientsViewIds(pendingIds))
  }
}

function* syncAddressBookModeFromActive() {
  const active: 'sender' | 'recipients' | null = yield select(
    selectActiveAddressList,
  )
  yield put(setAddressBookMode(active))
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
    const currentView: string = yield select(selectRecipientView)
    if (currentView === 'recipientView') {
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
  const active: 'sender' | 'recipients' | null = yield select(
    selectActiveAddressList,
  )
  const senderEntries: { id: string }[] = yield select(
    (s: RootState) => s.addressBook?.senderEntries ?? [],
  )
  const senderCount = senderEntries.length
  const recipientCount: number = yield select(selectRecipientsFormAddressListCount)

  const senderAddressList =
    active === 'sender'
      ? {
          state: 'active' as const,
          options: { badge: senderCount > 0 ? senderCount : null },
        }
      : getAddressListToolbarFragment(senderCount)

  const recipientsSectionAddressList =
    active === 'recipients'
      ? {
          state: 'active' as const,
          options: { badge: recipientCount > 0 ? recipientCount : null },
        }
      : getAddressListToolbarFragment(recipientCount)

  const addressListRecipientValue =
    active === 'recipients'
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
  yield takeEvery(setActiveAddressList.type, syncAddressBookModeFromActive)
  yield takeEvery(closeAddressList.type, syncAddressListIconsFromActive)
  yield takeEvery(closeAddressList.type, syncAddressBookModeFromActive)
}
