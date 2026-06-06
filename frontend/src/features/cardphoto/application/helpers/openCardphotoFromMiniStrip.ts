import type { SagaIterator } from 'redux-saga'
import { call, fork, put, select } from 'redux-saga/effects'
import { storeAdapters } from '@db/adapters/storeAdapters'
import {
  clearCardphotoViewReturnSnapshot,
  setCardphotoViewEditMode,
  setProcessedImage,
} from '@cardphoto/infrastructure/state'
import { selectCardphotoState } from '@cardphoto/infrastructure/selectors'
import type { CardphotoState, ImageMeta, ImageRecord } from '@cardphoto/domain/types'
import { CURRENT_EDITOR_IMAGE_ID } from '@cardphoto/domain/editorImageId'
import {
  fuelAssetRegistry,
  hydrateMeta,
  hydrateSessionImageMeta,
  prepareForRedux,
} from '@app/middleware/cardphotoHelpers'
import { rebuildConfigFromMeta } from '@app/middleware/cardphotoProcessSaga'
import { syncToolbarContext } from '@app/middleware/cardphotoToolbarSaga'

function* loadAppliedMetaForEditor(
  appliedData: ImageMeta,
): SagaIterator<ImageMeta | null> {
  const id = appliedData.id
  let fromIdb: ImageMeta | null = yield call(
    [storeAdapters.cardphotoImages, 'getById'] as const,
    id,
  )

  if (!fromIdb) {
    const applyRec: ImageRecord | null = yield call(
      [storeAdapters.applyImage, 'getById'] as const,
      'current_apply_image',
    )
    if (applyRec?.image?.id === id) {
      fromIdb = applyRec.image
    }
  }

  return (
    hydrateSessionImageMeta(appliedData, fromIdb) ??
    hydrateMeta(fromIdb) ??
    hydrateMeta(appliedData)
  )
}

/** Мини-секция / CardPie → фабрика: показать фото с открытки (`appliedData`), если в слоте превью другой шаблон. */
export function* openCardphotoFromMiniStripSaga(): SagaIterator {
  const cardphotoState: CardphotoState | null = yield select(selectCardphotoState)
  const appliedData = cardphotoState?.appliedData
  if (!appliedData?.id) return

  const assetData = cardphotoState?.assetData
  if (assetData?.id === appliedData.id) return

  const appliedMeta: ImageMeta | null = yield call(
    loadAppliedMetaForEditor,
    appliedData,
  )
  if (!appliedMeta) return

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
      applied: appliedMeta,
      processed: appliedMeta,
      stock: null,
    },
    [],
  )

  yield put(setCardphotoViewEditMode(false))
  yield put(clearCardphotoViewReturnSnapshot())
  yield put(setProcessedImage(prepareForRedux(appliedMeta)))
  yield call(rebuildConfigFromMeta, appliedMeta, false)
  yield fork(syncToolbarContext)
}
