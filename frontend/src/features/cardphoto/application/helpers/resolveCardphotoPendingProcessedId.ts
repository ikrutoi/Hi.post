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
import {
  isCardphotoAssetFromUserOriginalWorkflow,
  isCardphotoUserOriginalAsset,
} from './isCardphotoAssetFromUserOriginalWorkflow'

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

  /**
   * Only a cropped / listed child of this upload counts as Add's draft.
   * The original itself is `status: processed` — treating it as pending
   * made Add re-open View instead of create.
   */
  if (
    (assetData?.status === 'processed' || assetData?.status === 'outLine') &&
    assetData.id &&
    !isCardphotoUserOriginalAsset(assetData, state?.userOriginalData) &&
    isCardphotoAssetFromUserOriginalWorkflow(
      assetData,
      state?.userOriginalData,
      state?.appliedData,
    )
  ) {
    return assetData.id
  }

  const originalId = state?.userOriginalData?.id ?? null
  const sessionPendingId: string | null = yield select(
    selectCardphotoSessionPendingProcessedId,
  )

  if (sessionPendingId && sessionPendingId === originalId) {
    yield put(clearSessionPendingProcessedId())
  } else if (sessionPendingId) {
    const record = yield call(
      [storeAdapters.cardphotoImages, 'getById'] as const,
      sessionPendingId,
    )
    if (
      (record?.status === 'processed' || record?.status === 'outLine') &&
      !isCardphotoUserOriginalAsset(record, state?.userOriginalData)
    ) {
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
