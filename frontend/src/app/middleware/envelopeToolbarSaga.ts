import type { PayloadAction } from '@reduxjs/toolkit'
import {
  takeLatest,
  takeEvery,
  put,
  select,
  call,
  fork,
  spawn,
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
  setSenderFormDraft,
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
  setRecipientFormDraft,
  toggleRecipientSortDirection,
  toggleRecipientsViewSortDirection,
  setRecipientAppliedIds,
  setRecipientAppliedWithData,
  setRecipientAppliedData,
  updateRecipientField,
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
  setAddressCreateEditContext,
  clearAddressCreateEditContext,
  setAddressFormView,
  addressSaveSuccess,
  removeRecipientFromListByIndex,
  removeRecipientFromListById,
  removeRecipientAt,
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
  selectAddressCreateEditContext,
  selectSenderCardAddress,
  selectRecipientCardAddress,
  selectRecipientsList,
} from '@envelope/infrastructure/selectors'
import type { AddressEditSession } from '@envelope/domain/types'
import type { AddressCreateEditContext } from '@envelope/domain/types'
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
  selectRecipientApplied,
  selectAppliedRecipientDisplayAddress,
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
  doesDraftMatchAnyTemplate,
  doesDraftMatchInList,
  getAddressListToolbarFragment,
  getMatchingEntryId,
  isAddressDraftComplete,
  listStatusIsInQuickAddressBook,
  normalizeAddressFields,
  resolveApplyMediumToolbarState,
} from '@envelope/domain/helpers'
import { selectIsMobileLayout } from '@layout/infrastructure/selectors'
import type { AddressBookEntry } from '@envelope/addressBook/domain/types'
import type { RecipientState, SenderState } from '@envelope/domain/types'
import type { AddressFields } from '@shared/config/constants'
import type { RootState } from '@app/state'
import { handleAddressSave } from '@app/middleware/addressSaveSaga'
import { closeCardPieListPanelAndSyncIconsSaga } from '@app/middleware/exclusiveListPanelsSaga'
import { processEnvelopeVisuals } from '@app/middleware/envelopeProcessSaga'

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
  yield call(closeCardPieListPanelAndSyncIconsSaga)

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

function* openMobileAddressCreateEditForm(
  role: 'sender' | 'recipient',
  templateId: string,
): SagaIterator {
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

  const entries: { id: string; address: Record<string, string> }[] = yield select(
    (s: RootState) =>
      role === 'sender'
        ? (s.addressBook?.senderEntries ?? [])
        : (s.addressBook?.recipientEntries ?? []),
  )
  const address = getEntryAddressFromBook(entries, templateId)
  if (!address) return

  yield put(setAddressCreateEditContext({ role, templateId }))
  if (role === 'sender') {
    yield put(setSenderFormDraft(address))
    yield put(setSenderView('senderCreate'))
  } else {
    yield put(setRecipientFormDraft(address))
    yield put(setRecipientView('recipientCreate'))
  }
}

function* persistAddressTemplateUpdate(
  role: 'sender' | 'recipient',
  templateId: string,
  draft: AddressFields,
): SagaIterator {
  try {
    const result: { success: boolean } = yield call(
      [templateService, 'updateAddressTemplate'],
      role,
      templateId,
      { address: draft },
    )
    if (result.success) {
      yield put(incrementAddressBookReloadVersion())
      yield put(incrementAddressTemplatesReloadVersion())

      if (role === 'sender') {
        const sender: SenderState = yield select(selectSenderState)
        const senderViewId: string | null = yield select(selectSenderViewId)
        if (sender.applied?.[0] === templateId) {
          yield put(setSenderAppliedData(draft))
        }
        if (senderViewId === templateId) {
          yield put(setSenderViewDraft(draft))
        }
      } else {
        const recipient: RecipientState = yield select(selectRecipientState)
        const recipientViewId: string | null = yield select(selectRecipientViewId)
        if (recipient.applied?.[0] === templateId) {
          yield put(setRecipientAppliedData(draft))
        }
        if (recipientViewId === templateId) {
          yield put(setRecipientViewDraft(draft))
        }
        const envelopeRecipients: RecipientState[] = yield select(
          (state: RootState) => state.envelopeRecipients ?? [],
        )
        if (envelopeRecipients.length > 0) {
          const nextList: RecipientState[] = envelopeRecipients.map((r) =>
            r.recipientViewId === templateId
              ? {
                  ...r,
                  viewDraft: draft,
                  formIsComplete: Object.values(draft).every(
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
      console.warn(`Failed to update ${role} address template`)
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(`Error while updating ${role} address template:`, e)
  }
}

function* saveAndCloseAddressEditSession(
  keepRecipientView = false,
): SagaIterator {
  const session: AddressEditSession | null = yield select(selectActiveAddressEdit)
  if (!session) return

  yield call(
    persistAddressTemplateUpdate,
    session.role,
    session.templateId,
    session.draft,
  )

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

function addressFieldsAreComplete(address: AddressFields): boolean {
  return Object.values(address).every((v) => (v ?? '').trim() !== '')
}

function addressFieldsHaveData(address: AddressFields): boolean {
  return Object.values(address).some((v) => (v ?? '').trim() !== '')
}

/** Перед Close view: сохранить отображаемый адрес в formDraft для addressAdd. */
function* preserveFormDraftFromViewOnClose(
  role: 'sender' | 'recipient',
): SagaIterator {
  if (role === 'sender') {
    const sender: SenderState = yield select(selectSenderState)
    const viewDraft = sender.viewDraft as AddressFields
    if (addressFieldsHaveData(viewDraft)) {
      yield put(setSenderFormDraft(viewDraft))
    }
    return
  }

  const recipient: RecipientState = yield select(selectRecipientState)
  const viewDraft = recipient.viewDraft as AddressFields
  if (addressFieldsHaveData(viewDraft)) {
    yield put(setRecipientFormDraft(viewDraft))
  }
}

/** Сохранить адрес в viewDraft до пересинка книги (inList → outList). */
function* preserveAddressViewDraftForOutList(
  section: 'senderView' | 'recipientView',
): SagaIterator {
  const address: AddressFields =
    section === 'senderView'
      ? yield select(selectSenderCardAddress)
      : yield select(selectRecipientCardAddress)

  if (section === 'senderView') {
    yield put(setSenderViewDraft(address))
    return
  }

  yield put(setRecipientViewDraft(address))
  const recipientViewId: string | null = yield select(selectRecipientViewId)
  if (recipientViewId == null) return

  const envelopeRecipients: RecipientState[] = yield select(selectRecipientsList)
  if (envelopeRecipients.length === 0) return

  const complete = addressFieldsAreComplete(address)
  yield put(
    setRecipientsList(
      envelopeRecipients.map((r) =>
        r.recipientViewId === recipientViewId
          ? { ...r, viewDraft: { ...address }, formIsComplete: complete }
          : r,
      ),
    ),
  )
}

/** Снять шаблон с быстрого списка (outList в БД); адрес на конверте и в форме не трогаем. */
function* moveAddressTemplateToOutListFromToolbar(
  section: 'senderView' | 'recipientView',
): SagaIterator<boolean> {
  const type: 'sender' | 'recipient' =
    section === 'senderView' ? 'sender' : 'recipient'
  const templateId: string | null =
    section === 'senderView'
      ? yield select(selectSenderViewId)
      : yield select(selectRecipientViewId)

  if (templateId == null) return false

  try {
    yield* preserveAddressViewDraftForOutList(section)

    const result: { success: boolean } = yield call(
      [templateService, 'updateAddressTemplate'],
      type,
      templateId,
      { listStatus: 'outList' },
    )
    if (!result.success) return false

    yield put(incrementAddressTemplatesReloadVersion())
    yield put(incrementAddressBookReloadVersion())
    return true
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Failed to move address template to outList:', e)
    return false
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

/** Черновик create-формы совпадает с шаблоном в книге — открыть View, не Create. */
function* openAddressViewFromFormDraftIfSaved(
  role: 'sender' | 'recipient',
): SagaIterator<boolean> {
  if (role === 'sender') {
    const sender: SenderState = yield select(selectSenderState)
    if (sender.formIsEmpty ?? true) return false

    const draft = normalizeAddressFields(sender.formDraft as AddressFields)
    const senderEntries: AddressBookEntry[] = yield select(
      (s: RootState) => s.addressBook?.senderEntries ?? [],
    )
    const id = getMatchingEntryId(
      draft,
      senderEntries.map((e) => ({
        id: e.id,
        address: normalizeAddressFields(e.address ?? {}),
      })),
    )
    if (!id) return false

    yield put(setAddressFormView({ show: false, role: null }))
    yield put(setSenderViewDraft(draft))
    yield put(setSenderViewId(id))
    yield put(setSenderView('senderView'))
    yield call(processEnvelopeVisuals)
    return true
  }

  const recipient: RecipientState = yield select(selectRecipientState)
  if (recipient.formIsEmpty ?? true) return false

  const draft = normalizeAddressFields(recipient.formDraft as AddressFields)
  const recipientEntries: AddressBookEntry[] = yield select(
    (s: RootState) => s.addressBook?.recipientEntries ?? [],
  )
  const id = getMatchingEntryId(
    draft,
    recipientEntries.map((e) => ({
      id: e.id,
      address: normalizeAddressFields(e.address ?? {}),
    })),
  )
  if (!id) return false

  yield put(setAddressFormView({ show: false, role: null }))
  yield put(setRecipientViewDraft(draft))
  yield put(setRecipientViewId(id))
  yield put(setRecipientView('recipientView'))
  yield call(processEnvelopeVisuals)
  return true
}

/** Закрыть форму создания. Черновик сохраняем, кроме случая listCheck (адрес уже в inList). */
function* closeAddressCreateForm(
  section: 'senderCreate' | 'recipientCreate',
) {
  const role = section === 'senderCreate' ? 'sender' : 'recipient'
  const editContext: AddressCreateEditContext | null =
    yield select(selectAddressCreateEditContext)

  if (editContext?.role === role) {
    yield put(clearAddressCreateEditContext())
    if (role === 'sender') {
      yield put(clearSenderFormData())
    } else {
      yield put(clearRecipientFormData())
    }
    yield put(setAddressFormView({ show: false, role: null }))
    yield put(
      role === 'sender'
        ? setSenderViewId(editContext.templateId)
        : setRecipientViewId(editContext.templateId),
    )
    yield put(
      role === 'sender'
        ? setSenderView('senderView')
        : setRecipientView('recipientView'),
    )
    return
  }

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

function* closeSenderViewSaga(): SagaIterator {
  yield put(closeAddressEditSession({ role: 'sender' }))
  const sender: SenderState = yield select(selectSenderState)
  const appliedId = sender.applied?.[0] ?? null

  if (appliedId) {
    yield put(setSenderViewId(null))
    yield put(clearSenderViewDraft())
    yield put(setSenderView('senderEnvelopeView'))
    yield put(setAddressFormView({ show: false, role: null }))
    return
  }

  yield put(setSenderViewId(null))
  yield* preserveFormDraftFromViewOnClose('sender')
  yield put(clearSenderViewDraft())
  yield put(setSenderView('senderEnvelopeView'))
  yield put(setAddressFormView({ show: false, role: null }))
}

function* closeRecipientViewSaga(): SagaIterator {
  const recipient: RecipientState = yield select(selectRecipientState)
  const templateId: string | null = yield select(selectRecipientViewId)
  if (templateId == null) return

  const recipientsDisplayList: { id: string }[] = yield select(
    selectRecipientsDisplayList,
  )
  const recipientAppliedIds: string[] = yield select(selectRecipientApplied)
  const recipientsPendingIds: string[] = yield select(selectRecipientsPendingIds)
  const recipientSelectionCount =
    recipientsDisplayList.length > 0
      ? recipientsDisplayList.length
      : recipientAppliedIds.length > 0
        ? recipientAppliedIds.length
        : recipientsPendingIds.length

  if (recipientSelectionCount > 1) {
    const isEditMode: boolean = yield select(selectRecipientViewEditMode)
    if (isEditMode) {
      yield put(
        closeAddressEditSession({ role: 'recipient', keepRecipientView: true }),
      )
    }
    yield put(setRecipientView('recipientsView'))
    yield put(setRecipientViewId(null))
    return
  }

  yield put(closeAddressEditSession({ role: 'recipient' }))

  const appliedIds = recipient.applied ?? []
  const appliedId = appliedIds[0] ?? null

  if (appliedIds.includes(templateId)) {
    yield put(setRecipientViewId(null))
    yield put(clearRecipientViewDraft())
    yield put(setRecipientView('recipientsView'))
    yield put(setAddressFormView({ show: false, role: null }))
    return
  }

  if (appliedId && appliedIds.length === 1 && templateId !== appliedId) {
    yield put(setRecipientViewId(appliedId))
    const appliedRecipientAddress: AddressFields = yield select(
      selectAppliedRecipientDisplayAddress,
    )
    for (const [field, value] of Object.entries(appliedRecipientAddress) as [
      keyof AddressFields,
      string,
    ][]) {
      yield put(updateRecipientField({ field, value }))
    }
    yield put(setRecipientView('recipientView'))
    yield put(setAddressFormView({ show: false, role: null }))
    return
  }

  yield put(setRecipientViewId(null))
  yield* preserveFormDraftFromViewOnClose('recipient')
  yield put(clearRecipientViewDraft())
  yield put(setRecipientView('recipientsView'))
  yield put(setAddressFormView({ show: false, role: null }))
}

function* handleEnvelopeToolbarAction(
  action: ReturnType<typeof toolbarAction>,
) {
  const { section, key } = action.payload

  const isRecipientAddressListSection =
    section === 'addressListRecipient' || section === 'addressListRecipients'

  if (
    section === 'addressListSender' &&
    (key === 'sortAZDown' || key === 'sortAZUp' || key === 'sortDown')
  ) {
    yield put(toggleSenderSortDirection())
    return
  }
  if (
    isRecipientAddressListSection &&
    (key === 'sortAZDown' || key === 'sortAZUp' || key === 'sortDown')
  ) {
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
      const senderEntries: AddressBookEntry[] = yield select(
        (s: RootState) => s.addressBook?.senderEntries ?? [],
      )
      const sender: SenderState = yield select(selectSenderState)
      const draft: AddressFields =
        sender.currentView === 'senderCreate'
          ? (sender.formDraft as AddressFields)
          : yield select(selectSenderCardAddress)
      if (!Object.values(draft).every((v) => (v ?? '').trim() !== '')) return

      if (senderViewId == null) {
        yield put(senderSaveRequested({ listStatus: 'inList' }))
      } else if (
        senderEntries.some(
          (e) =>
            e.id === senderViewId &&
            listStatusIsInQuickAddressBook(e.listStatus),
        )
      ) {
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
        yield put(clearSenderFormData())
        yield* ensureAddressListPanelOpen('sender')
        yield call(syncAddressListIconsFromActive)
        yield call(processEnvelopeVisuals)
      }
    } else {
      const recipientViewId: string | null = yield select(selectRecipientViewId)
      const recipientEntries: AddressBookEntry[] = yield select(
        (s: RootState) => s.addressBook?.recipientEntries ?? [],
      )
      const recipient: RecipientState = yield select(selectRecipientState)
      const draft: AddressFields =
        recipient.currentView === 'recipientCreate'
          ? (recipient.formDraft as AddressFields)
          : yield select(selectRecipientCardAddress)
      if (!Object.values(draft).every((v) => (v ?? '').trim() !== '')) return

      if (recipientViewId == null) {
        yield put(recipientSaveRequested({ listStatus: 'inList' }))
      } else if (
        recipientEntries.some(
          (e) =>
            e.id === recipientViewId &&
            listStatusIsInQuickAddressBook(e.listStatus),
        )
      ) {
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
        yield put(clearRecipientFormData())
        yield* ensureAddressListPanelOpen('recipients')
        yield call(syncAddressListIconsFromActive)
        yield call(processEnvelopeVisuals)
      }
    }
    return
  }

  if (
    (section === 'senderView' || section === 'recipientView') &&
    key === 'removeFromList'
  ) {
    const moved: boolean = yield* moveAddressTemplateToOutListFromToolbar(section)
    if (!moved) return
    if (section === 'senderView') {
      yield* ensureAddressListPanelOpen('sender')
    } else {
      yield* ensureAddressListPanelOpen('recipients')
    }
    return
  }

  if (
    (section === 'senderView' || section === 'recipientView') &&
    key === 'close'
  ) {
    if (section === 'senderView') {
      const isEditMode: boolean = yield select(selectSenderViewEditMode)
      if (isEditMode) {
        yield call(saveAndCloseAddressEditSession, false)
      } else {
        yield* closeSenderViewSaga()
      }
    } else {
      const isEditMode: boolean = yield select(selectRecipientViewEditMode)
      if (isEditMode) {
        yield call(saveAndCloseAddressEditSession, true)
      } else {
        yield* closeRecipientViewSaga()
      }
    }
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
        const isMobileLayout: boolean = yield select(selectIsMobileLayout)
        if (isMobileLayout) {
          yield call(openMobileAddressCreateEditForm, 'sender', templateId)
        } else {
          yield call(openSenderAddressEditSession, templateId)
        }
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
        const isMobileLayout: boolean = yield select(selectIsMobileLayout)
        if (isMobileLayout) {
          yield call(openMobileAddressCreateEditForm, 'recipient', templateId)
        } else {
          yield call(openRecipientAddressEditSession, templateId)
        }
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

  if (
    (section === 'senderCreate' || section === 'recipientCreate') &&
    (key === 'close' || key === 'closeBig' || key === 'return')
  ) {
    yield* closeAddressCreateForm(section)
    return
  }

  if (key === 'close') {
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
      const openedView: boolean = yield call(
        openAddressViewFromFormDraftIfSaved,
        'sender',
      )
      if (openedView) return
      yield put(setAddressFormView({ show: true, role: 'sender' }))
      // Черновик formDraft сохраняем при Close; addressAdd снова открывает его
      yield put(setSenderView('senderCreate'))
    } else if (
      section === 'recipientView' ||
      section === 'recipients'
    ) {
      const openedView: boolean = yield call(
        openAddressViewFromFormDraftIfSaved,
        'recipient',
      )
      if (openedView) return
      yield put(setAddressFormView({ show: true, role: 'recipient' }))
      yield put(setRecipientView('recipientCreate'))
    }
  }

  if (key === 'applyMedium' || key === 'applyMediumCheck') {
    if (section === 'senderCreate') {
      const sender: SenderState = yield select(selectSenderState)
      const draft = (action.payload?.draft ??
        sender.formDraft) as AddressFields
      const senderEntries: AddressBookEntry[] = yield select(
        (s: RootState) => s.addressBook?.senderEntries ?? [],
      )
      const editContext: AddressCreateEditContext | null =
        yield select(selectAddressCreateEditContext)
      if (editContext?.role === 'sender') {
        if (
          resolveApplyMediumToolbarState(
            isAddressDraftComplete(draft),
            draft,
            senderEntries,
            editContext.templateId,
          ) === 'enabled'
        ) {
          yield call(
            persistAddressTemplateUpdate,
            'sender',
            editContext.templateId,
            draft,
          )
          yield put(clearAddressCreateEditContext())
          yield put(clearSenderFormData())
          yield put(setAddressFormView({ show: false, role: null }))
          yield put(setSenderViewId(editContext.templateId))
          yield put(setSenderView('senderView'))
          yield call(processEnvelopeVisuals)
        }
        return
      }
      if (
        isAddressDraftComplete(draft) &&
        !doesDraftMatchAnyTemplate(draft, senderEntries)
      ) {
        yield spawn(
          handleAddressSave,
          senderSaveRequested({
            listStatus: 'outList',
            viewOnly: true,
            draft: { ...draft },
          }),
        )
      }
      return
    }
    if (section === 'recipientCreate') {
      const recipient: RecipientState = yield select(selectRecipientState)
      const draft = (action.payload?.draft ??
        recipient.formDraft) as AddressFields
      const recipientEntries: AddressBookEntry[] = yield select(
        (s: RootState) => s.addressBook?.recipientEntries ?? [],
      )
      const editContext: AddressCreateEditContext | null =
        yield select(selectAddressCreateEditContext)
      if (editContext?.role === 'recipient') {
        if (
          resolveApplyMediumToolbarState(
            isAddressDraftComplete(draft),
            draft,
            recipientEntries,
            editContext.templateId,
          ) === 'enabled'
        ) {
          yield call(
            persistAddressTemplateUpdate,
            'recipient',
            editContext.templateId,
            draft,
          )
          yield put(clearAddressCreateEditContext())
          yield put(clearRecipientFormData())
          yield put(setAddressFormView({ show: false, role: null }))
          yield put(setRecipientViewId(editContext.templateId))
          yield put(setRecipientView('recipientView'))
          yield call(processEnvelopeVisuals)
        }
        return
      }
      if (
        isAddressDraftComplete(draft) &&
        !doesDraftMatchAnyTemplate(draft, recipientEntries)
      ) {
        yield spawn(
          handleAddressSave,
          recipientSaveRequested({
            listStatus: 'outList',
            viewOnly: true,
            draft: { ...draft },
          }),
        )
      }
      return
    }
  }

  if (key === 'apply') {
    if (section === 'sender') {
      const sender: SenderState = yield select(selectSenderState)
      const senderViewId: string | null = yield select(selectSenderViewId)
      const senderAppliedIds = sender.applied ?? []
      const senderViewMatchesApplied =
        sender.currentView === 'senderView' &&
        senderViewId != null &&
        senderAppliedIds.length === 1 &&
        senderAppliedIds[0] === senderViewId

      if (senderViewMatchesApplied) {
        yield put(setSenderApplied(false))
        return
      }

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
      const appliedIds = recipient.applied ?? []

      if (ids.length === 0) {
        const recipientViewId: string | null = yield select(
          selectRecipientViewId,
        )
        const singleViewMatchesApplied =
          recipientViewId != null &&
          appliedIds.length === 1 &&
          appliedIds[0] === recipientViewId

        if (singleViewMatchesApplied) {
          yield put(setRecipientApplied(false))
          return
        }

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

      const recipientsViewIdsEqual =
        appliedIds.length === ids.length &&
        appliedIds.length > 0 &&
        appliedIds.every((id) => ids.includes(id)) &&
        ids.every((id) => appliedIds.includes(id))

      if (recipientsViewIdsEqual) {
        yield put(setRecipientApplied(false))
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

  if (pendingIds.length > 1) {
    yield put(setRecipientViewId(null))
    yield put(setRecipientView('recipientsView'))
    return
  }

  const currentViewId = recipient.recipientViewId
  if (
    pendingIds.length === 1 &&
    recipient.currentView === 'recipientView' &&
    currentViewId === pendingIds[0]
  ) {
    return
  }

  if (pendingIds.length === 1) {
    yield put(setRecipientViewId(pendingIds[0]))
    yield put(setRecipientView('recipientView'))
  } else {
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
  const senderEntries: AddressBookEntry[] = yield select(
    (s: RootState) => s.addressBook?.senderEntries ?? [],
  )
  const recipientEntries: AddressBookEntry[] = yield select(
    (s: RootState) => s.addressBook?.recipientEntries ?? [],
  )
  const senderCount = senderEntries.filter((e) =>
    listStatusIsInQuickAddressBook(e.listStatus),
  ).length
  const recipientCount = recipientEntries.filter((e) =>
    listStatusIsInQuickAddressBook(e.listStatus),
  ).length

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
