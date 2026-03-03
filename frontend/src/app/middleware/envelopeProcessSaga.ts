import { select, put, takeEvery, call, all } from 'redux-saga/effects'
import {
  updateRecipientField,
  clearRecipient,
  restoreRecipient,
  setRecipientView,
  setRecipientMode,
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
  selectRecipientMode,
} from '@envelope/infrastructure/selectors'
import {
  toggleRecipientSelection,
  setRecipientsPendingIds,
} from '@envelope/infrastructure/state'
import {
  setSenderViewId,
  setSenderView,
} from '@envelope/sender/infrastructure/state'
import {
  setRecipientViewId,
  setRecipientsViewIds,
  resetRecipientForm,
} from '@envelope/recipient/infrastructure/state'
import { selectSenderViewId } from '@envelope/sender/infrastructure/selectors'
import { selectRecipientViewId } from '@envelope/recipient/infrastructure/selectors'
import { selectRecipientsList } from '@envelope/infrastructure/selectors'
import {
  buildRecipientToolbarState,
  buildSenderToolbarState,
  getAddressListToolbarFragment,
  isAddressInList,
  getMatchingEntryId,
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
  RecipientMode,
} from '@envelope/domain/types'

export function* processEnvelopeVisuals() {
  const sender: SenderState = yield select(selectSenderState)
  const recipient: RecipientState = yield select(selectRecipientState)

  const recipients: RecipientState[] = yield select(selectRecipientsList)
  const pendingIds: string[] = yield select(selectRecipientsPendingIds)

  if (
    Array.isArray(recipients) &&
    recipients.length > 0 &&
    (recipient.recipientsViewIds?.length ?? 0) === 0
  ) {
    yield put(
      setRecipientsViewIds(
        recipients
          .map((r) => r.recipientViewId)
          .filter((id): id is string => id != null),
      ),
    )
  } else if (
    recipient.mode === 'recipients' &&
    Array.isArray(pendingIds) &&
    pendingIds.length > 0
  ) {
    yield put(setRecipientsViewIds([...pendingIds]))
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

  const addressTemplateRefs: { type: string; id: string }[] = yield select(
    (s: {
      previewStripOrder: { addressTemplateRefs: { type: string; id: string }[] }
    }) => s.previewStripOrder?.addressTemplateRefs ?? [],
  )
  const senderMatchId =
    sender.currentView === 'senderView' && sender.senderViewId
      ? sender.senderViewId
      : getMatchingEntryId(sender.viewDraft, senderList)
  const recipientMatchId =
    recipient.currentView === 'recipientView' && recipient.recipientViewId
      ? recipient.recipientViewId
      : getMatchingEntryId(recipient.viewDraft, recipientList)
  const isSenderFavorite =
    senderMatchId != null &&
    addressTemplateRefs.some(
      (r) => r.type === 'sender' && r.id === senderMatchId,
    )
  const isRecipientFavorite =
    recipientMatchId != null &&
    addressTemplateRefs.some(
      (r) => r.type === 'recipient' && r.id === recipientMatchId,
    )

  const hasSenderDraft = checkHasData(sender.viewDraft)
  const hasRecipientDraft = checkHasData(recipient.viewDraft)

  const senderToolbar = buildSenderToolbarState({
    isComplete: senderComplete,
    hasData: checkHasData(sender.viewDraft),
    addressListCount: senderList.length,
    isCurrentAddressInList: isAddressInList(sender.viewDraft, senderList),
    isCurrentAddressFavorite: isSenderFavorite,
    hasDraft: hasSenderDraft,
    isAddressFormOpen: sender.currentView === 'addressFormSenderView',
    formIsEmpty: sender.formIsEmpty ?? true,
  })

  const recipientToolbar = buildRecipientToolbarState({
    isComplete: recipientComplete,
    hasData: checkHasData(recipient.viewDraft),
    addressListCount: recipientList.length,
    isCurrentAddressInList: isAddressInList(recipient.viewDraft, recipientList),
    isCurrentAddressFavorite: isRecipientFavorite,
    hasDraft: hasRecipientDraft,
    isAddressFormOpen: recipient.currentView === 'addressFormRecipientView',
    formIsEmpty: recipient.formIsEmpty ?? true,
    isFormDraftEmptyNow: !checkHasData(recipient.formDraft),
  })

  yield put(updateToolbarSection({ section: 'sender', value: senderToolbar }))
  yield put(
    updateToolbarSection({ section: 'recipient', value: recipientToolbar }),
  )

  const recipientListPanelOpen: boolean = yield select(
    selectRecipientListPanelOpen,
  )
  const recipientMode: RecipientMode = yield select(selectRecipientMode)
  const listApplyState =
    recipientListPanelOpen && recipientMode === 'recipients'
      ? 'enabled'
      : 'disabled'

  yield put(
    updateToolbarSection({
      section: 'addressList',
      value: {
        listApply: {
          state: listApplyState,
          options: {},
        },
      },
    }),
  )

  const isSenderEmptyForm =
    sender.currentView === 'senderView' && sender.senderViewId == null
  const isRecipientEmptyForm =
    recipient.currentView === 'recipientView' &&
    recipient.recipientViewId == null
  // При выбранном адресе (id не null) — apply всегда enabled
  const senderApplyState =
    sender.currentView === 'senderView' && sender.senderViewId != null
      ? 'enabled'
      : isSenderEmptyForm
        ? 'disabled'
        : senderComplete
          ? 'enabled'
          : 'disabled'
  const recipientApplyState =
    recipient.currentView === 'recipientView' &&
    recipient.recipientViewId != null
      ? 'enabled'
      : isRecipientEmptyForm
        ? 'disabled'
        : recipientComplete
          ? 'enabled'
          : 'disabled'

  yield put(
    updateToolbarIcon({
      section: 'sender',
      key: 'apply',
      value: { state: senderApplyState },
    }),
  )
  yield put(
    updateToolbarIcon({
      section: 'recipient',
      key: 'apply',
      value: { state: recipientApplyState },
    }),
  )

  const recipientsPendingIds: string[] = yield select(
    selectRecipientsPendingIds,
  )
  const isMultiMode = recipient.mode === 'recipients'
  const isRecipientFormOpen =
    recipient.currentView === 'addressFormRecipientView'
  const canApplyRecipients =
    isMultiMode && recipientsPendingIds.length >= 1
  const isRecipientsEmptyForm =
    isRecipientFormOpen && !recipientComplete
  const recipientsApplyState =
    isRecipientsEmptyForm || !canApplyRecipients ? 'disabled' : 'enabled'

  yield put(
    updateToolbarSection({
      section: 'recipients',
      value: {
        addressList: getAddressListToolbarFragment(recipientList.length),
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

  const senderFavoriteState = !senderComplete
    ? 'disabled'
    : isSenderFavorite
      ? 'active'
      : 'enabled'
  const recipientFavoriteState = !recipientComplete
    ? 'disabled'
    : isRecipientFavorite
      ? 'active'
      : 'enabled'
  yield put(
    updateToolbarSection({
      section: 'senderFavorite',
      value: { favorite: { state: senderFavoriteState } },
    }),
  )
  yield put(
    updateToolbarSection({
      section: 'recipientFavorite',
      value: { favorite: { state: recipientFavoriteState } },
    }),
  )

  const recipientViewId: string | null = yield select(selectRecipientViewId)
  const senderViewId: string | null = yield select(selectSenderViewId)
  const isSavedAddressRecipientFavorite =
    recipientViewId != null &&
    addressTemplateRefs.some(
      (r) => r.type === 'recipient' && r.id === recipientViewId,
    )
  const isSavedAddressSenderFavorite =
    senderViewId != null &&
    addressTemplateRefs.some(
      (r) => r.type === 'sender' && r.id === senderViewId,
    )
  const senderViewFavoriteState = isSavedAddressSenderFavorite
    ? 'active'
    : 'enabled'
  const recipientViewFavoriteState = isSavedAddressRecipientFavorite
    ? 'active'
    : 'enabled'

  yield put(
    updateToolbarSection({
      section: 'senderView',
      value: { favorite: { state: senderViewFavoriteState } },
    }),
  )
  yield put(
    updateToolbarSection({
      section: 'recipientView',
      value: { favorite: { state: recipientViewFavoriteState } },
    }),
  )
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
  yield takeEvery(setEnabled.type, processEnvelopeVisuals)
  yield takeEvery(clearRecipient.type, processEnvelopeVisuals)
  yield takeEvery(clearSender.type, processEnvelopeVisuals)
  yield takeEvery(restoreSender.type, processEnvelopeVisuals)
  yield takeEvery(restoreRecipient.type, processEnvelopeVisuals)
  yield takeEvery(addAddressTemplateRef.type, processEnvelopeVisuals)
  yield takeEvery(removeAddressTemplateRef.type, processEnvelopeVisuals)
  yield takeEvery(
    [
      toggleRecipientSelection.type,
      setRecipientsPendingIds.type,
      setRecipientMode.type,
      setRecipientViewId.type,
      setSenderViewId.type,
      setSenderView.type,
      setRecipientView.type,
      resetRecipientForm.type,
    ],
    processEnvelopeVisuals,
  )
}
