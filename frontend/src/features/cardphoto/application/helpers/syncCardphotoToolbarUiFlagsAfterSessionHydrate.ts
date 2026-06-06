import type { SagaIterator } from 'redux-saga'
import { put } from 'redux-saga/effects'
import {
  clearSessionPendingProcessedId,
  setOriginalUploadReminderActive,
  setSessionPendingProcessedId,
} from '@cardphoto/infrastructure/state'
import type { ImageMeta } from '@cardphoto/domain/types'

/** Восстановить бэдж / точку cardphotoAdd после hydrate сессии. */
export function* syncCardphotoToolbarUiFlagsAfterSessionHydrate(
  userOriginal: ImageMeta | null,
  assetData: ImageMeta | null,
  allCardphotoImages: ImageMeta[],
): SagaIterator<void> {
  if (!userOriginal?.id) {
    yield put(clearSessionPendingProcessedId())
    yield put(setOriginalUploadReminderActive(false))
    return
  }

  if (assetData?.status === 'processed' && assetData.id) {
    yield put(setSessionPendingProcessedId(assetData.id))
    yield put(setOriginalUploadReminderActive(false))
    return
  }

  const pending = allCardphotoImages
    .filter(
      (meta) =>
        meta.status === 'processed' && meta.parentImageId === userOriginal.id,
    )
    .sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0))[0]

  if (pending?.id) {
    yield put(setSessionPendingProcessedId(pending.id))
    yield put(setOriginalUploadReminderActive(false))
    return
  }

  yield put(clearSessionPendingProcessedId())
  yield put(setOriginalUploadReminderActive(true))
}
