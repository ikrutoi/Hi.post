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
  selectSenderDraft,
  selectRecipientDraft,
} from '@envelope/infrastructure/selectors'
import {
  toggleRecipientSelection,
  setRecipientsPendingIds,
  setSenderDraft,
  setRecipientDraft,
  clearSenderDraft,
  clearRecipientDraft,
} from '@envelope/infrastructure/state'
import { setSenderViewId } from '@envelope/sender/infrastructure/state'
import {
  setRecipientViewId,
  setRecipientsViewIds,
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
import type { RecipientState, SenderState } from '@envelope/domain/types'

export function* processEnvelopeVisuals() {
  const sender: SenderState = yield select(selectSenderState)
  const recipient: RecipientState = yield select(selectRecipientState)

  const recipients: RecipientState[] = yield select(selectRecipientsList)
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
      : getMatchingEntryId(sender.addressFormData, senderList)
  const recipientMatchId =
    recipient.currentView === 'recipientView' && recipient.recipientViewId
      ? recipient.recipientViewId
      : getMatchingEntryId(recipient.addressFormData, recipientList)
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

  const senderDraft: Record<string, string> | null = yield select(
    selectSenderDraft,
  )
  const recipientDraft: Record<string, string> | null = yield select(
    selectRecipientDraft,
  )
  const hasDraftData = (draft: Record<string, string> | null | undefined) =>
    draft != null && Object.values(draft).some((v) => (v ?? '').trim() !== '')
  const hasSenderDraft = hasDraftData(senderDraft)
  const hasRecipientDraft = hasDraftData(recipientDraft)

  const senderToolbar = buildSenderToolbarState({
    isComplete: senderComplete,
    hasData: checkHasData(sender.addressFormData),
    addressListCount: senderList.length,
    isCurrentAddressInList: isAddressInList(sender.addressFormData, senderList),
    isCurrentAddressFavorite: isSenderFavorite,
    hasDraft: hasSenderDraft,
  })

  const recipientToolbar = buildRecipientToolbarState({
    isComplete: recipientComplete,
    hasData: checkHasData(recipient.addressFormData),
    addressListCount: recipientList.length,
    isCurrentAddressInList: isAddressInList(
      recipient.addressFormData,
      recipientList,
    ),
    isCurrentAddressFavorite: isRecipientFavorite,
    hasDraft: hasRecipientDraft,
  })

  yield put(updateToolbarSection({ section: 'sender', value: senderToolbar }))
  yield put(
    updateToolbarSection({ section: 'recipient', value: recipientToolbar }),
  )

  yield put(
    updateToolbarIcon({
      section: 'sender',
      key: 'apply',
      value: {
        state: senderComplete ? 'enabled' : 'disabled',
      },
    }),
  )
  yield put(
    updateToolbarIcon({
      section: 'recipient',
      key: 'apply',
      value: {
        state: recipientComplete ? 'enabled' : 'disabled',
      },
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
  const recipientsApplyState = isRecipientFormOpen
    ? recipientComplete
      ? 'enabled'
      : 'disabled'
    : canApplyRecipients
      ? 'enabled'
      : 'disabled'

  yield put(
    updateToolbarSection({
      section: 'recipients',
      value: {
        addressList: getAddressListToolbarFragment(recipientList.length),
        apply: {
          state: recipientsApplyState,
          options: {},
        },
        addressPlus: {
          state: 'enabled',
          options: hasRecipientDraft ? { badgeDot: true } : { badgeDot: false },
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
  const savedAddressFavoriteState =
    isSavedAddressRecipientFavorite || isSavedAddressSenderFavorite
      ? 'active'
      : 'enabled'

  yield put(
    updateToolbarSection({
      section: 'senderView',
      value: { favorite: { state: savedAddressFavoriteState } },
    }),
  )
  yield put(
    updateToolbarSection({
      section: 'recipientView',
      value: { favorite: { state: savedAddressFavoriteState } },
    }),
  )
}

export function* envelopeProcessSaga() {
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
      setSenderDraft.type,
      setRecipientDraft.type,
      clearSenderDraft.type,
      clearRecipientDraft.type,
      setRecipientView.type,
    ],
    processEnvelopeVisuals,
  )
}
