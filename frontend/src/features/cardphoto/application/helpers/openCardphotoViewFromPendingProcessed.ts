import type { SagaIterator } from 'redux-saga'
import { call, fork, put, select } from 'redux-saga/effects'
import { storeAdapters } from '@db/adapters/storeAdapters'
import {
  clearCardphotoViewReturnSnapshot,
  clearSessionPendingProcessedId,
  setCardphotoViewEditMode,
  setProcessedImage,
} from '@cardphoto/infrastructure/state'
import {
  selectCardphotoAssetToolbar,
  selectCardphotoState,
} from '@cardphoto/infrastructure/selectors'
import type { CardphotoState, ImageMeta, ImageRecord } from '@cardphoto/domain/types'
import { CURRENT_EDITOR_IMAGE_ID } from '@cardphoto/domain/editorImageId'
import {
  fuelAssetRegistry,
  hydrateMeta,
  hydrateSessionImageMeta,
  prepareForRedux,
} from '@app/middleware/cardphotoHelpers'
import { rebuildConfigFromMeta } from '@app/middleware/cardphotoProcessSaga'
import {
  syncCardphotoAddToolbarState,
  syncToolbarContext,
} from '@app/middleware/cardphotoToolbarSaga'
import { resolveCardphotoPendingProcessedIdSaga } from './resolveCardphotoPendingProcessedId'

/** cardphotoAdd с бэджем `1` → cardphotoView с processed-слотом из сессии / IDB. */
export function* openCardphotoViewFromPendingProcessedSaga(): SagaIterator<boolean> {
  const cardphotoState: CardphotoState | null = yield select(selectCardphotoState)
  const processedId: string | null = yield call(
    resolveCardphotoPendingProcessedIdSaga,
  )

  if (!processedId) return false

  const assetToolbar: ReturnType<typeof selectCardphotoAssetToolbar> =
    yield select(selectCardphotoAssetToolbar)
  if (
    cardphotoState?.assetData?.id === processedId &&
    cardphotoState.assetData.status === 'processed' &&
    assetToolbar === 'cardphotoView'
  ) {
    yield call(syncToolbarContext)
    yield call(syncCardphotoAddToolbarState)
    return true
  }

  const fromIdb: ImageMeta | null = yield call(
    [storeAdapters.cardphotoImages, 'getById'] as const,
    processedId,
  )
  const persisted =
    cardphotoState?.assetData?.id === processedId
      ? cardphotoState.assetData
      : null
  const processedMeta =
    hydrateSessionImageMeta(persisted, fromIdb) ??
    hydrateMeta(fromIdb) ??
    hydrateMeta(persisted)

  if (!processedMeta || processedMeta.status !== 'processed') {
    yield put(clearSessionPendingProcessedId())
    return false
  }

  const userOriginal = cardphotoState?.userOriginalData ?? null
  const userRecord: ImageRecord | null = userOriginal
    ? yield call(
        [storeAdapters.userImages, 'getById'] as const,
        CURRENT_EDITOR_IMAGE_ID,
      )
    : null
  const userHydrated = hydrateSessionImageMeta(
    userOriginal,
    userRecord?.image ?? null,
  )

  yield call(
    fuelAssetRegistry,
    {
      user: userHydrated,
      applied: cardphotoState?.appliedData
        ? hydrateMeta(cardphotoState.appliedData)
        : null,
      processed: processedMeta,
      stock: null,
    },
    [],
  )

  yield put(setCardphotoViewEditMode(false))
  yield put(clearCardphotoViewReturnSnapshot())
  yield put(setProcessedImage(prepareForRedux(processedMeta)))
  yield call(rebuildConfigFromMeta, processedMeta, false)
  yield fork(syncToolbarContext)
  yield call(syncCardphotoAddToolbarState)

  return true
}
