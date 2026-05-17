import type { PayloadAction } from '@reduxjs/toolkit'
import {
  takeLatest,
  takeEvery,
  put,
  select,
  call,
  fork,
  all,
} from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
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
  setSenderViewDraft,
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
  setRecipientViewDraft,
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
  openAddressEditSession,
  closeAddressEditSession,
  setAddressFormView,
  addressSaveSuccess,
  removeRecipientFromListByIndex,
  removeRecipientFromListById,
  toggleRecipientSelection,
  cycleSenderAddressListPanelDensity,
  cycleRecipientAddressListPanelDensity,
  setSenderAddressListPanelDensity,
  setRecipientAddressListPanelDensity,
} from '@envelope/infrastructure/state'
import {
  selectRecipientsPendingIds,
  selectRecipientListPanelOpen,
  selectSenderListPanelOpen,
  selectActiveAddressList,
  selectAddressFormViewRole,
  selectSenderViewEditMode,
  selectRecipientViewEditMode,
  selectSenderAddressListPanelDensity,
  selectRecipientAddressListPanelDensity,
  selectActiveAddressEdit,
} from '@envelope/infrastructure/selectors'
import type { AddressEditSession } from '@envelope/domain/types'
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
  selectRecipientsDisplayList,
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
import {
  senderAdapter,
  recipientAdapter,
  storeAdapters,
} from '@db/adapters/storeAdapters'
import type { UiPreferencesRecord } from '@db/types/storeMap.types'
import {
  doesDraftMatchInList,
  getAddressListToolbarFragment,
  listStatusIsInQuickAddressBook,
} from '@envelope/domain/helpers'
import type { AddressBookEntry } from '@envelope/addressBook/domain/types'
import type { RecipientState, SenderState } from '@envelope/domain/types'
import type { AddressFields } from '@shared/config/constants'
import type { RootState } from '@app/state'

const ADDRESS_LIST_UI_PREF_ID = 'addressList' as const

function isPanelDensity2Size(d: unknown): d is 1 | 2 {
  return d === 1 || d === 2
}

function* hydrateAddressListPanelDensityFromDbSaga(): SagaIterator {
  try {
    const pref: UiPreferencesRecord | null = yield call(
      [storeAdapters.uiPreferences, 'getById'] as const,
      ADDRESS_LIST_UI_PREF_ID,
    )
    if (pref?.id !== 'addressList') return
    const legacy = pref.addressListPanelDensity
    const sender = pref.senderAddressListPanelDensity ?? legacy
    const recipient = pref.recipientAddressListPanelDensity ?? legacy
    if (isPanelDensity2Size(sender)) {
      yield put(setSenderAddressListPanelDensity(sender))
    }
    if (isPanelDensity2Size(recipient)) {
      yield put(setRecipientAddressListPanelDensity(recipient))
    }
  } catch (e) {
    console.error('hydrateAddressListPanelDensityFromDbSaga', e)
  }
}

function* persistSenderAddressListPanelDensityToDbSaga(): SagaIterator {
  try {
    const senderDensity: 1 | 2 = yield select(selectSenderAddressListPanelDensity)
    const recipientDensity: 1 | 2 = yield select(
      selectRecipientAddressListPanelDensity,
    )
    const payload = {
      id: ADDRESS_LIST_UI_PREF_ID,
      senderAddressListPanelDensity: senderDensity,
      recipientAddressListPanelDensity: recipientDensity,
    } as const satisfies UiPreferencesRecord
    yield call([storeAdapters.uiPreferences, 'put'] as const, payload)
  } catch (e) {
    console.error('persistSenderAddressListPanelDensityToDbSaga', e)
  }
}

function* persistRecipientAddressListPanelDensityToDbSaga(): SagaIterator {
  yield* persistSenderAddressListPanelDensityToDbSaga()
}

/** Открыть панель адресной книги для роли, если она ещё закрыта (SenderListPanel / RecipientListPanel). */
function* ensureAddressListPanelOpen(
  mode: 'sender' | 'recipients',
): SagaIterator {
  const active: 'sender' | 'recipients' | null = yield select(
    selectActiveAddressList,
  )
  if (active !== mode) {
    yield put(setActiveAddressList(mode))
  }
}

function* handleSetAddressFormViewSync(
  _action: PayloadAction<{
    show: boolean
    role: 'sender' | 'recipient' | null
  }>,
) {}

function getEntryAddressFromBook(
  entries: { id: string; address: Record<string, string> }[],
  templateId: string,
): AddressFields | null {
  const entry = entries.find((e) => e.id === templateId)
  return entry?.address ? ({ ...entry.address } as AddressFields) : null
}

function* openSenderAddressEditSession(templateId: string): SagaIterator {
  const senderViewId: string | null = yield select(selectSenderViewId)
  const entries: { id: string; address: Record<string, string> }[] = yield select(
    (s: RootState) => s.addressBook?.senderEntries ?? [],
  )
  const address = getEntryAddressFromBook(entries, templateId)
  const sender: SenderState = yield select(selectSenderState)
  const draft = address ?? { ...sender.viewDraft }
  yield put(
    openAddressEditSession({
      role: 'sender',
      templateId,
      draft,
      displayTemplateIdAtStart: senderViewId,
    }),
  )
}

function* openRecipientAddressEditSession(templateId: string): SagaIterator {
  const recipientViewId: string | null = yield select(selectRecipientViewId)
  const entries: { id: string; address: Record<string, string> }[] = yield select(
    (s: RootState) => s.addressBook?.recipientEntries ?? [],
  )
  const address = getEntryAddressFromBook(entries, templateId)
  const recipient: RecipientState = yield select(selectRecipientState)
  const draft = address ?? { ...recipient.viewDraft }
  yield put(setRecipientView('recipientView'))
  yield put(
    openAddressEditSession({
      role: 'recipient',
      templateId,
      draft,
      displayTemplateIdAtStart: recipientViewId,
    }),
  )
}

function* saveAndCloseAddressEditSession(
  keepRecipientView = false,
): SagaIterator {
  const session: AddressEditSession | null = yield select(selectActiveAddressEdit)
  if (!session) return

  try {
    const result: { success: boolean } = yield call(
      [templateService, 'updateAddressTemplate'],
      session.role,
      session.templateId,
      { address: session.draft },
    )
    if (result.success) {
      yield put(incrementAddressBookReloadVersion())
      yield put(incrementAddressTemplatesReloadVersion())

      if (session.role === 'sender') {
        const sender: SenderState = yield select(selectSenderState)
        const senderViewId: string | null = yield select(selectSenderViewId)
        if (sender.applied?.[0] === session.templateId) {
          yield put(setSenderAppliedData(session.draft))
        }
        if (senderViewId === session.templateId) {
          yield put(setSenderViewDraft(session.draft))
        }
      } else {
        const recipient: RecipientState = yield select(selectRecipientState)
        const recipientViewId: string | null = yield select(selectRecipientViewId)
        if (recipient.applied?.[0] === session.templateId) {
          yield put(setRecipientAppliedData(session.draft))
        }
        if (recipientViewId === session.templateId) {
          yield put(setRecipientViewDraft(session.draft))
        }
        const envelopeRecipients: RecipientState[] = yield select(
          (state: RootState) => state.envelopeRecipients ?? [],
        )
        if (envelopeRecipients.length > 0) {
          const nextList: RecipientState[] = envelopeRecipients.map((r) =>
            r.recipientViewId === session.templateId
              ? {
                  ...r,
                  viewDraft: session.draft,
                  formIsComplete: Object.values(session.draft).every(
                    (v) => (v ?? '').trim() !== '',
                  ),
                }
              : r,
          )
          yield put(setRecipientsList(nextList))
        }
      }
    } else {
      // eslint-disable-next-line no-console
      console.warn(`Failed to update ${session.role} address template`)
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(`Error while updating ${session.role} address template:`, e)
  }

  yield put(
    closeAddressEditSession({
      role: session.role,
      keepRecipientView: session.role === 'recipient' ? keepRecipientView : undefined,
    }),
  )
}

/** Полное удаление шаблона из БД (корзина в тулбаре). */
function* deleteAddressTemplateFromToolbar(
  section: 'senderView' | 'recipientView',
) {
  const recipientViewId: string | null = yield select(selectRecipientViewId)
  const senderViewId: string | null = yield select(selectSenderViewId)
  const editSession: AddressEditSession | null = yield select(selectActiveAddressEdit)

  const type: 'sender' | 'recipient' =
    section === 'senderView' ? 'sender' : 'recipient'
  let templateId =
    section === 'senderView' ? senderViewId : recipientViewId
  if (editSession?.role === type) {
    templateId = editSession.templateId
  }

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
      yield put(closeAddressEditSession({ role: 'sender' }))
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
      yield put(closeAddressEditSession({ role: 'recipient' }))
      yield put(setAddressFormView({ show: false, role: null }))
      yield put(clearRecipientFormData())
      yield put(clearRecipientViewDraft())
      if (nextApplied.length === 1) {
        yield put(setRecipientViewId(nextApplied[0]))
        yield put(setRecipientView('recipientView'))
      } else {
        yield put(setRecipientViewId(null))
        yield put(setRecipientView('recipientsView'))
      }
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

function* selectInListEntriesForRole(
  role: 'sender' | 'recipient',
): SagaIterator<Pick<AddressBookEntry, 'address'>[]> {
  const entries: AddressBookEntry[] = yield select((s: RootState) =>
    role === 'sender'
      ? (s.addressBook?.senderEntries ?? [])
      : (s.addressBook?.recipientEntries ?? []),
  )
  return entries.filter((e) => listStatusIsInQuickAddressBook(e.listStatus))
}

/** Закрыть форму создания. Черновик сохраняем, кроме случая listCheck (адрес уже в inList). */
function* closeAddressCreateForm(
  section: 'senderCreate' | 'recipientCreate',
) {
  const role = section === 'senderCreate' ? 'sender' : 'recipient'
  const inListEntries: Pick<AddressBookEntry, 'address'>[] =
    yield* selectInListEntriesForRole(role)

  if (role === 'sender') {
    const sender: SenderState = yield select(selectSenderState)
    if (doesDraftMatchInList(sender.formDraft as AddressFields, inListEntries)) {
      yield put(clearSenderFormData())
    }
  } else {
    const recipient: RecipientState = yield select(selectRecipientState)
    if (
      doesDraftMatchInList(recipient.formDraft as AddressFields, inListEntries)
    ) {
      yield put(clearRecipientFormData())
    }
  }

  yield put(setAddressFormView({ show: false, role: null }))
  if (role === 'sender') {
    const sender: SenderState = yield select(selectSenderState)
    const appliedId = sender.applied?.[0]
    if (appliedId) {
      yield put(setSenderViewId(appliedId))
    } else {
      yield put(setSenderViewId(null))
    }
    yield put(setSenderView('senderView'))
  } else {
    const pendingIds: string[] = yield select(selectRecipientsPendingIds)
    if (pendingIds.length === 1) {
      yield put(setRecipientViewId(pendingIds[0]))
      yield put(setRecipientView('recipientView'))
    } else {
      yield put(setRecipientViewId(null))
      yield put(setRecipientView('recipientsView'))
    }
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

  if (section === 'addressListSender' && key === 'panelDensity2') {
    yield put(cycleSenderAddressListPanelDensity())
    yield call(persistSenderAddressListPanelDensityToDbSaga)
    return
  }

  if (isRecipientAddressListSection && key === 'panelDensity2') {
    yield put(cycleRecipientAddressListPanelDensity())
    yield call(persistRecipientAddressListPanelDensityToDbSaga)
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
        sender.currentView === 'senderCreate'
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
        yield* ensureAddressListPanelOpen('sender')
      }
    } else {
      const recipientViewId: string | null = yield select(selectRecipientViewId)
      const recipientEntries: { id: string }[] = yield select(
        (s: RootState) => s.addressBook?.recipientEntries ?? [],
      )
      const recipient: RecipientState = yield select(selectRecipientState)
      const draft =
        recipient.currentView === 'recipientCreate'
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
        yield* ensureAddressListPanelOpen('recipients')
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
      const activeSession: AddressEditSession | null = yield select(
        selectActiveAddressEdit,
      )
      if (activeSession) {
        yield put(
          closeAddressEditSession({
            role: activeSession.role,
            keepRecipientView: activeSession.role === 'recipient',
          }),
        )
      }
      const sender: SenderState = yield select(selectSenderState)
      const senderViewId: string | null = yield select(selectSenderViewId)
      const templateId = senderViewId ?? sender.applied?.[0] ?? null
      if (templateId) {
        yield call(openSenderAddressEditSession, templateId)
      }
    } else {
      yield call(saveAndCloseAddressEditSession, false)
    }

    return
  }

  if (section === 'recipientView' && key === 'edit') {
    const isEditMode: boolean = yield select(selectRecipientViewEditMode)

    if (!isEditMode) {
      const activeSession: AddressEditSession | null = yield select(
        selectActiveAddressEdit,
      )
      if (activeSession) {
        yield put(
          closeAddressEditSession({
            role: activeSession.role,
            keepRecipientView: activeSession.role === 'recipient',
          }),
        )
      }
      const recipient: RecipientState = yield select(selectRecipientState)
      const recipientViewId: string | null = yield select(selectRecipientViewId)
      const templateId = recipientViewId ?? recipient.applied?.[0] ?? null
      if (templateId) {
        yield call(openRecipientAddressEditSession, templateId)
      }
    } else {
      yield call(saveAndCloseAddressEditSession, true)
    }

    return
  }

  if (
    section !== 'sender' &&
    section !== 'recipients' &&
    section !== 'senderView' &&
    section !== 'recipientView' &&
    section !== 'recipientsView' &&
    section !== 'senderCreate' &&
    section !== 'recipientCreate' &&
    section !== 'addressListSender' &&
    section !== 'addressListRecipient'
  )
    return

  if (key === 'close') {
    if (section === 'senderCreate' || section === 'recipientCreate') {
      yield* closeAddressCreateForm(section)
      return
    }
    if (section === 'sender') {
      yield put(setSenderViewId(null))
      yield put(clearSender())
      return
    }
    if (section === 'recipients' || section === 'recipientView') {
      yield put(resetRecipientForm())
      return
    }
  }

  if (key === 'addressAdd') {
    if (section === 'sender') {
      yield put(setAddressFormView({ show: true, role: 'sender' }))
      // Черновик formDraft сохраняем при Close; addressAdd снова открывает его
      yield put(setSenderView('senderCreate'))
    } else if (
      section === 'recipientView' ||
      section === 'recipients'
    ) {
      yield put(setAddressFormView({ show: true, role: 'recipient' }))
      yield put(setRecipientView('recipientCreate'))
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
        yield put(setSenderView('senderView'))
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

  if (key === 'listAdd' || key === 'addList') {
    if (section === 'sender') {
      const senderComplete: boolean = yield select(selectIsSenderComplete)
      if (senderComplete)
        yield put(senderSaveRequested({ listStatus: 'inList' }))
    } else if (
      section === 'senderCreate' ||
      section === 'recipientCreate'
    ) {
      const senderComplete: boolean = yield select(selectIsSenderComplete)
      const recipientComplete: boolean = yield select(selectIsRecipientComplete)
      const isComplete =
        section === 'senderCreate' ? senderComplete : recipientComplete
      if (isComplete) {
        if (section === 'senderCreate') {
          yield* ensureAddressListPanelOpen('sender')
          yield put(senderSaveRequested({ listStatus: 'inList' }))
        } else {
          yield* ensureAddressListPanelOpen('recipients')
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
    (section === 'senderCreate' || section === 'recipientCreate')
  ) {
    yield* closeAddressCreateForm(section)
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
    const sender: SenderState = yield select(selectSenderState)
    const appliedId = sender.applied?.[0]
    if (appliedId) {
      yield put(setSenderViewId(appliedId))
    }
    yield put(setSenderView('senderView'))
  } else {
    const pendingIds: string[] = yield select(selectRecipientsPendingIds)
    if (pendingIds.length === 1) {
      yield put(setRecipientViewId(pendingIds[0]))
      yield put(setRecipientView('recipientView'))
    } else {
      yield put(setRecipientViewId(null))
      yield put(setRecipientView('recipientsView'))
    }
  }
}

function* navigateRecipientViewAfterListChange(nextPendingIds: string[]) {
  yield put(closeAddressEditSession({ role: 'recipient' }))
  yield put(setAddressFormView({ show: false, role: null }))
  yield put(clearRecipientViewDraft())
  if (nextPendingIds.length === 1) {
    yield put(setRecipientViewId(nextPendingIds[0]))
    yield put(setRecipientView('recipientView'))
  } else {
    yield put(setRecipientViewId(null))
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
  const nextPending = pending.filter((id) => id !== templateId)
  yield put(setRecipientsPendingIds(nextPending))
  yield* navigateRecipientViewAfterListChange(nextPending)
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
  const nextPending = pending.filter((id) => id !== templateId)
  yield put(setRecipientsPendingIds(nextPending))
  yield* navigateRecipientViewAfterListChange(nextPending)
}

function* syncRecipientsViewIdsFromPending() {
  const recipient: RecipientState = yield select(selectRecipientState)
  const pendingIds: string[] = yield select(selectRecipientsPendingIds)
  if (recipient.currentRecipientsList === 'second') {
    yield put(setRecipientsViewIdsSecondList(pendingIds))
  } else {
    yield put(setRecipientsViewIds(pendingIds))
  }

  if (pendingIds.length === 1) {
    yield put(setRecipientViewId(pendingIds[0]))
    yield put(setRecipientView('recipientView'))
  } else if (pendingIds.length > 1) {
    yield put(setRecipientViewId(null))
    yield put(setRecipientView('recipientsView'))
  }
}

function* syncAddressBookModeFromActive() {
  const active: 'sender' | 'recipients' | null = yield select(
    selectActiveAddressList,
  )
  yield put(setAddressBookMode(active))
}

function* syncEditIconsOnAddressEditOpen(
  action: PayloadAction<AddressEditSession>,
) {
  const { role } = action.payload
  if (role === 'sender') {
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
    return
  }
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
}

function* syncEditIconsOnAddressEditClose(
  action: PayloadAction<
    { role?: 'sender' | 'recipient'; keepRecipientView?: boolean } | undefined
  >,
) {
  const { role, keepRecipientView } = action.payload ?? {}
  if (role === 'recipient' && !keepRecipientView) {
    const currentView: string = yield select(selectRecipientView)
    if (currentView === 'recipientView') {
      const recipientsDisplayList: { id: string }[] = yield select(
        selectRecipientsDisplayList,
      )
      if (recipientsDisplayList.length > 1) {
        yield put(setRecipientView('recipientsView'))
        yield put(setRecipientViewId(null))
      }
    }
  }
  yield put(
    updateToolbarIcon({
      section: 'senderView',
      key: 'edit',
      value: 'enabled',
    }),
  )
  yield put(
    updateToolbarIcon({
      section: 'recipientView',
      key: 'edit',
      value: 'enabled',
    }),
  )
}

function* syncAddressListIconsFromActive() {
  const active: 'sender' | 'recipients' | null = yield select(
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
  yield all([
    fork(hydrateAddressListPanelDensityFromDbSaga),
    takeLatest(toolbarAction.type, handleEnvelopeToolbarAction),
    takeEvery(openAddressEditSession.type, syncEditIconsOnAddressEditOpen),
    takeEvery(closeAddressEditSession.type, syncEditIconsOnAddressEditClose),
    takeEvery(
      removeRecipientFromListByIndex.type,
      handleRemoveRecipientFromListByIndex,
    ),
    takeEvery(
      removeRecipientFromListById.type,
      handleRemoveRecipientFromListById,
    ),
    takeEvery(setAddressFormView.type, handleSetAddressFormViewSync),
    takeEvery(addressSaveSuccess.type, handleAddressSaveSuccess),
    takeEvery(
      [setRecipientsPendingIds.type, toggleRecipientSelection.type],
      syncRecipientsViewIdsFromPending,
    ),
    takeEvery(setActiveAddressList.type, syncAddressListIconsFromActive),
    takeEvery(setActiveAddressList.type, syncAddressBookModeFromActive),
    takeEvery(closeAddressList.type, syncAddressListIconsFromActive),
    takeEvery(closeAddressList.type, syncAddressBookModeFromActive),
  ])
}
