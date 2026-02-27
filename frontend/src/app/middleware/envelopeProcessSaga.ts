import { select, put, takeEvery, call, all } from 'redux-saga/effects'
import {
  updateRecipientField,
  clearRecipient,
  restoreRecipient,
} from '@envelope/recipient/infrastructure/state'
import {
  updateSenderField,
  setEnabled,
  clearSender,
  restoreSender,
} from '@envelope/sender/infrastructure/state'
import { selectSenderState } from '@envelope/sender/infrastructure/selectors'
import { selectRecipientState } from '@envelope/recipient/infrastructure/selectors'
import {
  selectSelectedRecipientIds,
} from '@envelope/infrastructure/selectors'
import {
  toggleRecipientSelection,
  setSelectedRecipientIds,
  setRecipientMode,
  setRecipientTemplateId,
  setSenderTemplateId,
  setSenderDraft,
  setRecipientDraft,
  clearSenderDraft,
  clearRecipientDraft,
} from '@envelope/infrastructure/state'
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
    (s: { previewStripOrder: { addressTemplateRefs: { type: string; id: string }[] } }) =>
      s.previewStripOrder?.addressTemplateRefs ?? [],
  )
  const senderMatchId = getMatchingEntryId(sender.data, senderList)
  const recipientMatchId = getMatchingEntryId(recipient.data, recipientList)
  const isSenderFavorite =
    senderMatchId != null &&
    addressTemplateRefs.some((r) => r.type === 'sender' && r.id === senderMatchId)
  const isRecipientFavorite =
    recipientMatchId != null &&
    addressTemplateRefs.some(
      (r) => r.type === 'recipient' && r.id === recipientMatchId,
    )

  const envelopeSelection: {
    senderDraft?: Record<string, string> | null
    recipientDraft?: Record<string, string> | null
  } = yield select(
    (s: { envelopeSelection?: { senderDraft?: Record<string, string> | null; recipientDraft?: Record<string, string> | null } }) =>
      s.envelopeSelection ?? {},
  )
  const hasSenderDraft =
    envelopeSelection.senderDraft != null &&
    Object.keys(envelopeSelection.senderDraft).length > 0
  const hasRecipientDraft =
    envelopeSelection.recipientDraft != null &&
    Object.keys(envelopeSelection.recipientDraft).length > 0

  const senderToolbar = buildSenderToolbarState({
    isComplete: sender.isComplete,
    hasData: checkHasData(sender.data),
    addressListCount: senderList.length,
    isCurrentAddressInList: isAddressInList(sender.data, senderList),
    isCurrentAddressFavorite: isSenderFavorite,
    hasDraft: hasSenderDraft,
  })

  const recipientToolbar = buildRecipientToolbarState({
    isComplete: recipient.isComplete,
    hasData: checkHasData(recipient.data),
    addressListCount: recipientList.length,
    isCurrentAddressInList: isAddressInList(recipient.data, recipientList),
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
        state: sender.isComplete ? 'enabled' : 'disabled',
      },
    }),
  )
  yield put(
    updateToolbarIcon({
      section: 'recipient',
      key: 'apply',
      value: {
        state: recipient.isComplete ? 'enabled' : 'disabled',
      },
    }),
  )

  const selectedRecipientIds: string[] = yield select(selectSelectedRecipientIds)
  const isMultiMode = recipient.enabled
  const canApplyRecipients =
    isMultiMode && selectedRecipientIds.length >= 1

  yield put(
    updateToolbarSection({
      section: 'recipients',
      value: {
        addressList: getAddressListToolbarFragment(recipientList.length),
        apply: {
          state: canApplyRecipients ? 'enabled' : 'disabled',
          options: {},
        },
      },
    }),
  )

  const senderFavoriteState = !sender.isComplete
    ? 'disabled'
    : isSenderFavorite
      ? 'active'
      : 'enabled'
  const recipientFavoriteState = !recipient.isComplete
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

  const envelopeSelectionFull: {
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
  const isSavedAddressRecipientFavorite =
    envelopeSelectionFull.recipientTemplateId != null &&
    addressTemplateRefs.some(
      (r) =>
        r.type === 'recipient' &&
        r.id === envelopeSelectionFull.recipientTemplateId,
    )
  const isSavedAddressSenderFavorite =
    envelopeSelectionFull.senderTemplateId != null &&
    addressTemplateRefs.some(
      (r) =>
        r.type === 'sender' && r.id === envelopeSelectionFull.senderTemplateId,
    )
  const savedAddressFavoriteState =
    isSavedAddressRecipientFavorite || isSavedAddressSenderFavorite
      ? 'active'
      : 'enabled'

  // Обновляем favorite в тулбаре сохранённых адресов отправителя и получателя
  yield put(
    updateToolbarSection({
      section: 'senderSavedAddress',
      value: { favorite: { state: savedAddressFavoriteState } },
    }),
  )
  yield put(
    updateToolbarSection({
      section: 'recipientSavedAddress',
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
      setSelectedRecipientIds.type,
      setRecipientMode.type,
      setRecipientTemplateId.type,
      setSenderTemplateId.type,
      setSenderDraft.type,
      setRecipientDraft.type,
      clearSenderDraft.type,
      clearRecipientDraft.type,
    ],
    processEnvelopeVisuals,
  )
}
