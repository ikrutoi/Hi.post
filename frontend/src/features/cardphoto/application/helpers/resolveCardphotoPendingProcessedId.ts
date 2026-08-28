import type { SagaIterator } from 'redux-saga'
import { call, put, select } from 'redux-saga/effects'
import { storeAdapters } from '@db/adapters/storeAdapters'
import {
  clearSessionPendingProcessedId,
  setSessionPendingProcessedId,
} from '@cardphoto/infrastructure/state'
import {
  selectCardphotoAssetToolbar,
  selectCardphotoOriginalUploadReminderActive,
  selectCardphotoSessionPendingProcessedId,
  selectCardphotoState,
} from '@cardphoto/infrastructure/selectors'

/** processed-слот после applyLight: Redux id, текущий asset или запись в IDB по parentImageId. */
export function* resolveCardphotoPendingProcessedIdSaga(): SagaIterator<
  string | null
> {
  const state = yield select(selectCardphotoState)
  const assetData = state?.assetData
  const assetToolbar: ReturnType<typeof selectCardphotoAssetToolbar> =
    yield select(selectCardphotoAssetToolbar)
  const originalUploadReminderActive: boolean = yield select(
    selectCardphotoOriginalUploadReminderActive,
  )

  if (assetToolbar === 'cardphotoCreate') {
    return null
  }

  if (
    (assetData?.status === 'processed' || assetData?.status === 'outLine') &&
    assetData.id
  ) {
    return assetData.id
  }

  const sessionPendingId: string | null = yield select(
    selectCardphotoSessionPendingProcessedId,
  )

  if (sessionPendingId) {
    const record = yield call(
      [storeAdapters.cardphotoImages, 'getById'] as const,
      sessionPendingId,
    )
    if (record?.status === 'processed' || record?.status === 'outLine') {
      return sessionPendingId
    }
    yield put(clearSessionPendingProcessedId())
  }

  /**
   * After applyLight / demote from quick list (outLine): pending slot that Add reopens.
   * Reminder-dot path must not resurrect a processed child from IDB after addList / apply.
   */
  if (originalUploadReminderActive) {
    return null
  }

  const originalId = state?.userOriginalData?.id
  if (!originalId) return null

  const all = yield call(storeAdapters.cardphotoImages.getAll)
  const pending = all
    .filter(
      (meta) =>
        (meta.status === 'processed' || meta.status === 'outLine') &&
        meta.parentImageId === originalId,
    )
    .sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0))[0]

  if (!pending?.id) return null

  yield put(setSessionPendingProcessedId(pending.id))
  return pending.id
}
