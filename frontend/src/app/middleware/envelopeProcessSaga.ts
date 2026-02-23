import { select, put, takeEvery, call, all } from 'redux-saga/effects'
import {
  updateRecipientField,
  clearRecipient,
} from '@envelope/recipient/infrastructure/state'
import {
  updateSenderField,
  setEnabled,
  clearSender,
} from '@envelope/sender/infrastructure/state'
import { selectSenderState } from '@envelope/sender/infrastructure/selectors'
import { selectRecipientState } from '@envelope/recipient/infrastructure/selectors'
import {
  buildRecipientToolbarState,
  buildSenderToolbarState,
  isAddressInList,
  getMatchingEntryId,
} from '@envelope/domain/helpers'
import { updateToolbarSection } from '@toolbar/infrastructure/state'
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

  const senderToolbar = buildSenderToolbarState({
    isComplete: sender.isComplete,
    hasData: checkHasData(sender.data),
    addressListCount: senderList.length,
    isCurrentAddressInList: isAddressInList(sender.data, senderList),
    isCurrentAddressFavorite: isSenderFavorite,
  })

  const recipientToolbar = buildRecipientToolbarState({
    isComplete: recipient.isComplete,
    hasData: checkHasData(recipient.data),
    addressListCount: recipientList.length,
    isCurrentAddressInList: isAddressInList(recipient.data, recipientList),
    isCurrentAddressFavorite: isRecipientFavorite,
  })

  yield put(updateToolbarSection({ section: 'sender', value: senderToolbar }))
  yield put(
    updateToolbarSection({ section: 'recipient', value: recipientToolbar }),
  )
}

export function* envelopeProcessSaga() {
  yield takeEvery(
    [
      updateRecipientField.type,
      updateSenderField.type,
      setEnabled.type,
      clearRecipient.type,
      clearSender.type,
      addAddressTemplateRef.type,
      removeAddressTemplateRef.type,
    ],
    processEnvelopeVisuals,
  )
}
