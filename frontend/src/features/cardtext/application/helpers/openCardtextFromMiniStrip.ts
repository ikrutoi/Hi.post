import type { SagaIterator } from 'redux-saga'
import { put, select } from 'redux-saga/effects'
import type { RootState } from '@app/state'
import {
  restoreCardtextSession,
  setCardtextAddTemplateOpen,
  setCardtextId,
  setCardtextViewEditMode,
  setDraftEngaged,
  setDraftFocus,
} from '@cardtext/infrastructure/state'
import {
  cardtextHasRenderableContent,
  type CardtextStatus,
} from '@cardtext/domain/editor/editor.types'

function appliedRecordId(
  id: string | null | undefined,
): string | null {
  if (id == null) return null
  const normalized = String(id).trim()
  return normalized.length > 0 ? normalized : null
}

/** Мини-секция → фабрика: View (inLine/outLine) или Processed по status в appliedData. */
export function* openCardtextFromMiniStripSaga(): SagaIterator {
  const { appliedData, assetData, isDraftEngaged } = yield select(
    (s: RootState) => s.cardtext,
  )

  if (appliedData == null || !cardtextHasRenderableContent(appliedData)) {
    return
  }

  if (
    isDraftEngaged === true &&
    assetData != null &&
    assetData.status === 'draft' &&
    cardtextHasRenderableContent(assetData)
  ) {
    return
  }

  const status: CardtextStatus = appliedData.status
  if (
    status !== 'inLine' &&
    status !== 'outLine' &&
    status !== 'processed'
  ) {
    return
  }

  const recordId = appliedRecordId(appliedData.id)
  const sessionPayload = {
    value: appliedData.value,
    style: appliedData.style,
    title: appliedData.title ?? '',
    plainText: appliedData.plainText,
    cardtextLines: appliedData.cardtextLines,
    favorite: appliedData.favorite ?? null,
    timestamp: appliedData.timestamp,
    id: recordId,
    status,
  }

  yield put(restoreCardtextSession(sessionPayload))
  yield put(setCardtextId(recordId))

  yield put(setCardtextViewEditMode(false))
  yield put(setDraftEngaged(false))
  yield put(setDraftFocus(false))
  yield put(setCardtextAddTemplateOpen(false))
}
