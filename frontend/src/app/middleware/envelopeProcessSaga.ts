import { select, put, takeEvery, call, all } from 'redux-saga/effects'
import {
  updateRecipientField,
  clearRecipient,
  restoreRecipient,
  setRecipientView,
} from '@envelope/recipient/infrastructure/state'
import {
  updateSenderField,
  setEnabled,
  clearSender,
  restoreSender,
} from '@envelope/sender/infrastructure/state'
import {
  selectSenderState,
  selectIsSenderComplete,
} from '@envelope/sender/infrastructure/selectors'
import {
  selectRecipientState,
  selectIsRecipientComplete,
} from '@envelope/recipient/infrastructure/selectors'
import {
  selectRecipientsPendingIds,
  selectRecipientListPanelOpen,
  selectSenderListPanelOpen,
  selectActiveAddressList,
  selectSenderCardAddress,
  selectRecipientCardAddress,
} from '@envelope/infrastructure/selectors'
import {
  toggleRecipientSelection,
  setRecipientsPendingIds,
  setActiveAddressList,
  closeAddressList,
  removeRecipientAt,
  setAddressFormView,
  updateAddressEditDraftField,
  openAddressEditSession,
  closeAddressEditSession,
} from '@envelope/infrastructure/state'
import {
  addAddressBookEntry,
  removeAddressBookEntry,
  setAddressBookEntries,
} from '@envelope/addressBook/infrastructure/state'
import type { AddressBookEntry } from '@envelope/addressBook/domain/types'
import {
  setSenderViewId,
  setSenderView,
  setSenderAppliedIds,
  setSenderAppliedWithData,
  setSenderApplied,
} from '@envelope/sender/infrastructure/state'
import {
  setRecipientViewId,
  setRecipientsViewIds,
  setRecipientsViewIdsSecondList,
  resetRecipientForm,
  removeAppliedAt,
  setRecipientAppliedWithData,
  setRecipientAppliedIds,
  setRecipientApplied,
} from '@envelope/recipient/infrastructure/state'
import { selectRecipientsList } from '@envelope/infrastructure/selectors'
import {
  buildRecipientToolbarState,
  buildSenderToolbarState,
  getAddressListToolbarFragment,
  isAddressInList,
  listStatusIsInQuickAddressBook,
  isAddressDraftComplete,
  resolveAddListToolbarState,
} from '@envelope/domain/helpers'
import {
  updateToolbarSection,
  updateToolbarIcon,
} from '@toolbar/infrastructure/state'
import {
  addAddressTemplateRef,
  removeAddressTemplateRef,
} from '@features/previewStrip/infrastructure/state'
import {
  recipientTemplatesAdapter,
  senderTemplatesAdapter,
} from '@db/adapters/templateAdapters'
import type { RootState } from '@app/state'
import type { AddressFields } from '@shared/config/constants'
import type {
  RecipientState,
  SenderState,
} from '@envelope/domain/types'
import type { SagaIterator } from 'redux-saga'

function filterInListEntries(
  entries: AddressBookEntry[],
): Pick<AddressBookEntry, 'address'>[] {
  return entries.filter((e) => listStatusIsInQuickAddressBook(e.listStatus))
}

/** senderView / recipientView / senderCreate / recipientCreate — addList по совпадению с inList. */
export function* syncAddressViewToolbarAddList(): SagaIterator {
  const sender: SenderState = yield select(selectSenderState)
  const recipient: RecipientState = yield select(selectRecipientState)

  const senderEntries: AddressBookEntry[] = yield select(
    (s: RootState) => s.addressBook?.senderEntries ?? [],
  )
  const recipientEntries: AddressBookEntry[] = yield select(
    (s: RootState) => s.addressBook?.recipientEntries ?? [],
  )
  const senderInList = filterInListEntries(senderEntries)
  const recipientInList = filterInListEntries(recipientEntries)

  if (sender.currentView === 'senderCreate') {
    const draft = sender.formDraft as AddressFields
    const senderDraftComplete = isAddressDraftComplete(draft)
    yield put(
      updateToolbarIcon({
        section: 'senderCreate',
        key: 'addList',
        value: {
          state: resolveAddListToolbarState(
            senderDraftComplete,
            draft,
            senderInList,
          ),
        },
      }),
    )
    yield put(
      updateToolbarIcon({
        section: 'senderCreate',
        key: 'applyLight',
        value: { state: senderDraftComplete ? 'enabled' : 'disabled' },
      }),
    )
  }

  if (sender.currentView === 'senderView') {
    const draft: AddressFields = yield select(selectSenderCardAddress)
    yield put(
      updateToolbarIcon({
        section: 'senderView',
        key: 'addList',
        value: {
          state: resolveAddListToolbarState(
            isAddressDraftComplete(draft),
            draft,
            senderInList,
          ),
        },
      }),
    )
  }

  if (recipient.currentView === 'recipientCreate') {
    const draft = recipient.formDraft as AddressFields
    const recipientDraftComplete = isAddressDraftComplete(draft)
    yield put(
      updateToolbarIcon({
        section: 'recipientCreate',
        key: 'addList',
        value: {
          state: resolveAddListToolbarState(
            recipientDraftComplete,
            draft,
            recipientInList,
          ),
        },
      }),
    )
    yield put(
      updateToolbarIcon({
        section: 'recipientCreate',
        key: 'applyLight',
        value: { state: recipientDraftComplete ? 'enabled' : 'disabled' },
      }),
    )
  }

  if (recipient.currentView === 'recipientView') {
    const draft: AddressFields = yield select(selectRecipientCardAddress)
    yield put(
      updateToolbarIcon({
        section: 'recipientView',
        key: 'addList',
        value: {
          state: resolveAddListToolbarState(
            isAddressDraftComplete(draft),
            draft,
            recipientInList,
          ),
        },
      }),
    )
  }
}

export function* processEnvelopeVisuals() {
  const sender: SenderState = yield select(selectSenderState)
  const recipient: RecipientState = yield select(selectRecipientState)

  const recipients: RecipientState[] = yield select(selectRecipientsList)
  const pendingIds: string[] = yield select(selectRecipientsPendingIds)

  if (
    Array.isArray(recipients) &&
    recipients.length > 0 &&
    (recipient.recipientsViewIdsFirstList?.length ?? 0) === 0
  ) {
    yield put(
      setRecipientsViewIds(
        recipients
          .map((r) => r.recipientViewId)
          .filter((id): id is string => id != null),
      ),
    )
  }

  const senderComplete: boolean = yield select(selectIsSenderComplete)
  const recipientComplete: boolean = yield select(selectIsRecipientComplete)

  const checkHasData = (data: Record<string, string>) =>
    Object.values(data).some((v) => v.trim() !== '')

  const [senderList, recipientList]: [
    Awaited<ReturnType<typeof senderTemplatesAdapter.getAll>>,
    Awaited<ReturnType<typeof recipientTemplatesAdapter.getAll>>,
  ] = yield all([
    call([senderTemplatesAdapter, 'getAll']),
    call([recipientTemplatesAdapter, 'getAll']),
  ])

  /** Счётчик только inList (и legacy без listStatus) — как в панели адресной книги */
  const senderInListCount = (senderList ?? []).filter((item) =>
    listStatusIsInQuickAddressBook(item.listStatus),
  ).length
  const recipientInListCount = (recipientList ?? []).filter((item) =>
    listStatusIsInQuickAddressBook(item.listStatus),
  ).length

  const hasSenderDraft = checkHasData(sender.viewDraft)
  const hasRecipientDraft = checkHasData(recipient.viewDraft)

  const senderListPanelOpen: boolean = yield select(selectSenderListPanelOpen)
  const recipientListPanelOpenForToolbar: boolean = yield select(
    selectRecipientListPanelOpen,
  )

  const senderToolbar = buildSenderToolbarState({
    isComplete: senderComplete,
    hasData: checkHasData(sender.viewDraft),
    addressListCount: senderInListCount,
    isCurrentAddressInList: isAddressInList(sender.viewDraft, senderList),
    hasDraft: hasSenderDraft,
    isAddressFormOpen: sender.currentView === 'senderCreate',
    formIsEmpty: sender.formIsEmpty ?? true,
    senderListPanelOpen,
  })

  const activeAddressList: 'sender' | 'recipients' | null =
    yield select(selectActiveAddressList)
  const recipientListAddressList =
    activeAddressList === 'recipients'
      ? {
          state: 'active' as const,
          options: {
            badge: recipientInListCount > 0 ? recipientInListCount : null,
          },
        }
      : getAddressListToolbarFragment(recipientInListCount)

  const recipientToolbar = buildRecipientToolbarState({
    isComplete: recipientComplete,
    hasData: checkHasData(recipient.viewDraft),
    addressListCount: recipientInListCount,
    isCurrentAddressInList: isAddressInList(recipient.viewDraft, recipientList),
    hasDraft: hasRecipientDraft,
    isAddressFormOpen: recipient.currentView === 'recipientCreate',
    formIsEmpty: recipient.formIsEmpty ?? true,
    recipientListPanelOpen: recipientListPanelOpenForToolbar,
  })

  yield put(updateToolbarSection({ section: 'sender', value: senderToolbar }))
  yield put(
    updateToolbarSection({
      section: 'recipients',
      value: { ...recipientToolbar, addressList: recipientListAddressList },
    }),
  )

  const listApplyState = !recipientListPanelOpenForToolbar
    ? 'disabled'
    : recipient.currentRecipientsList === 'second'
      ? 'active'
      : 'enabled'

  const addressListApplyValue = {
    listApply: {
      state: listApplyState,
      options: {},
    },
  }

  yield put(
    updateToolbarSection({
      section: 'addressListRecipient',
      value: addressListApplyValue,
    }),
  )
  yield put(
    updateToolbarSection({
      section: 'addressListRecipients',
      value: addressListApplyValue,
    }),
  )

  const isSenderEmptyForm =
    sender.currentView === 'senderView' && sender.senderViewId == null

  const senderAppliedIds = sender.applied ?? []
  const senderViewMatchesApplied =
    sender.currentView === 'senderView' &&
    sender.senderViewId != null &&
    senderAppliedIds.length === 1 &&
    senderAppliedIds[0] === sender.senderViewId

  const senderApplyState =
    sender.currentView === 'senderCreate'
      ? 'disabled'
      : senderViewMatchesApplied
        ? 'selected'
        : sender.currentView === 'senderView' && sender.senderViewId != null
          ? 'enabled'
          : isSenderEmptyForm
            ? 'disabled'
            : senderComplete
              ? 'enabled'
              : 'disabled'

  yield put(
    updateToolbarIcon({
      section: 'sender',
      key: 'apply',
      value: { state: senderApplyState },
    }),
  )

  const recipientsPendingIds: string[] = yield select(
    selectRecipientsPendingIds,
  )
  const isRecipientFormOpen =
    recipient.currentView === 'recipientCreate'
  const canApplyRecipients = recipientsPendingIds.length >= 1
  const isRecipientsEmptyForm = isRecipientFormOpen && !recipientComplete
  const recipientsViewIds =
    recipient.currentRecipientsList === 'second'
      ? (recipient.recipientsViewIdsSecondList ?? [])
      : (recipient.recipientsViewIdsFirstList ?? [])
  const appliedIds = recipient.applied ?? []
  const recipientHasApplied = appliedIds.length > 0
  const recipientsViewIdsEqual =
    appliedIds.length === recipientsViewIds.length &&
    appliedIds.length > 0 &&
    appliedIds.every((id) => recipientsViewIds.includes(id)) &&
    recipientsViewIds.every((id) => appliedIds.includes(id))

  let recipientsApplyState: 'disabled' | 'selected' | 'enabled'
  if (recipient.currentView === 'recipientCreate') {
    recipientsApplyState = 'disabled'
  } else if (recipientsViewIds.length === 0) {
    recipientsApplyState = 'disabled'
  } else if (
    (!canApplyRecipients && !recipientHasApplied) ||
    (isRecipientsEmptyForm && !recipientHasApplied)
  ) {
    recipientsApplyState = 'disabled'
  } else if (recipientsViewIdsEqual) {
    recipientsApplyState = 'selected'
  } else {
    recipientsApplyState = 'enabled'
  }

  yield put(
    updateToolbarSection({
      section: 'recipients',
      value: {
        addressList: getAddressListToolbarFragment(recipientInListCount),
        apply: {
          state: recipientsApplyState,
          options: {},
        },
        addressAdd: {
          state: isRecipientFormOpen ? 'disabled' : 'enabled',
          options: isRecipientFormOpen
            ? { badgeDot: false }
            : { badgeDot: !(recipient.formIsEmpty ?? true) },
        },
      },
    }),
  )

  yield* syncAddressViewToolbarAddList()
}

function* detachRecipientFromTemplateOnEdit(
  action: ReturnType<typeof updateRecipientField>,
) {
  const recipient: RecipientState = yield select(selectRecipientState)
  if (
    recipient.currentView !== 'recipientView' ||
    recipient.recipientViewId == null
  ) {
    return
  }
  const entries: Array<{ id: string; address?: Record<string, string> }> =
    yield select((s: RootState) => s.addressBook?.recipientEntries ?? [])
  const entry = entries.find((e) => e.id === recipient.recipientViewId)
  if (!entry?.address) return
  const addressFormData: AddressFields = {
    ...entry.address,
    [action.payload.field]: action.payload.value,
  } as AddressFields
  yield put(
    restoreRecipient({
      ...recipient,
      viewDraft: addressFormData,
    }),
  )
}

export function* envelopeProcessSaga() {
  yield takeEvery(updateRecipientField.type, detachRecipientFromTemplateOnEdit)
  yield takeEvery(updateRecipientField.type, processEnvelopeVisuals)
  yield takeEvery(updateSenderField.type, processEnvelopeVisuals)
  yield takeEvery(updateAddressEditDraftField.type, syncAddressViewToolbarAddList)
  yield takeEvery(openAddressEditSession.type, syncAddressViewToolbarAddList)
  yield takeEvery(closeAddressEditSession.type, syncAddressViewToolbarAddList)
  yield takeEvery(addAddressBookEntry.type, syncAddressViewToolbarAddList)
  yield takeEvery(removeAddressBookEntry.type, syncAddressViewToolbarAddList)
  yield takeEvery(setAddressBookEntries.type, syncAddressViewToolbarAddList)
  yield takeEvery(setEnabled.type, processEnvelopeVisuals)
  yield takeEvery(clearRecipient.type, processEnvelopeVisuals)
  yield takeEvery(clearSender.type, processEnvelopeVisuals)
  yield takeEvery(restoreSender.type, processEnvelopeVisuals)
  yield takeEvery(restoreRecipient.type, processEnvelopeVisuals)
  yield takeEvery(addAddressTemplateRef.type, processEnvelopeVisuals)
  yield takeEvery(removeAddressTemplateRef.type, processEnvelopeVisuals)
  yield takeEvery(setSenderAppliedIds.type, processEnvelopeVisuals)
  yield takeEvery(setSenderAppliedWithData.type, processEnvelopeVisuals)
  yield takeEvery(setSenderApplied.type, processEnvelopeVisuals)
  yield takeEvery(setRecipientAppliedWithData.type, processEnvelopeVisuals)
  yield takeEvery(setRecipientAppliedIds.type, processEnvelopeVisuals)
  yield takeEvery(setRecipientApplied.type, processEnvelopeVisuals)
  yield takeEvery(
    [
      toggleRecipientSelection.type,
      setRecipientsPendingIds.type,
      setRecipientViewId.type,
      setSenderViewId.type,
      setSenderView.type,
      setRecipientView.type,
      resetRecipientForm.type,
      setActiveAddressList.type,
      closeAddressList.type,
      removeRecipientAt.type,
      removeAppliedAt.type,
      setRecipientsViewIds.type,
      setAddressFormView.type,
    ],
    processEnvelopeVisuals,
  )
}
