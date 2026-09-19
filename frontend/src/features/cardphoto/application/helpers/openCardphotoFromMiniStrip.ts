import type { SagaIterator } from 'redux-saga'
import { call, fork, put, select } from 'redux-saga/effects'
import { storeAdapters } from '@db/adapters/storeAdapters'
import {
  clearCardphotoViewReturnSnapshot,
  clearCurrentConfig,
  setAssetData,
  setCardphotoViewEditMode,
  setOriginalUploadReminderActive,
  setProcessedImage,
} from '@cardphoto/infrastructure/state'
import { selectCardphotoState } from '@cardphoto/infrastructure/selectors'
import type { CardphotoState, ImageMeta, ImageRecord } from '@cardphoto/domain/types'
import { CURRENT_EDITOR_IMAGE_ID } from '@cardphoto/domain/editorImageId'
import {
  loadCardphotoImageMetaFromIdb,
  reviveImageMeta,
} from '@cardphoto/application/helpers/loadCardphotoImageMetaFromIdb'
import { imageMetaHasLiveDisplayUrl } from '@cardphoto/application/helpers/imageMetaLiveUrl'
import {
  fuelAssetRegistry,
  hydrateSessionImageMeta,
  prepareForRedux,
} from '@app/middleware/cardphotoHelpers'
import { rebuildConfigFromMeta } from '@app/middleware/cardphotoProcessSaga'
import { syncToolbarContext } from '@app/middleware/cardphotoToolbarSaga'

function* loadAppliedMetaForEditor(
  appliedData: ImageMeta,
): SagaIterator<ImageMeta | null> {
  const fromIdb: ImageMeta | null = yield call(
    loadCardphotoImageMetaFromIdb,
    appliedData.id,
  )
  if (fromIdb) return fromIdb

  const applyRec: ImageRecord | null = yield call(
    [storeAdapters.applyImage, 'getById'] as const,
    'current_apply_image',
  )
  if (applyRec?.image?.id === appliedData.id) {
    return (
      (yield call(reviveImageMeta, applyRec.image)) ??
      hydrateSessionImageMeta(appliedData, applyRec.image)
    )
  }

  return hydrateSessionImageMeta(appliedData, null)
}

function* startCardphotoViewWithoutApply(
  cardphotoState: CardphotoState | null,
): SagaIterator {
  yield put(setCardphotoViewEditMode(false))
  yield put(clearCardphotoViewReturnSnapshot())
  const assetData = cardphotoState?.assetData
  /**
   * Leftover create/original is not a selection. Empty View + cardphoto toolbar.
   * inLine / processed / outLine stay as View.
   */
  if (assetData == null || assetData.source === 'original') {
    if (assetData != null) {
      yield put(setAssetData(null))
      yield put(clearCurrentConfig())
    }
    if (cardphotoState?.userOriginalData) {
      yield put(setOriginalUploadReminderActive(true))
    }
  }
  yield fork(syncToolbarContext)
}

/** Мини-секция / CardPie → фабрика: applied на слот; иначе форма View и тулбар cardphoto. */
export function* openCardphotoFromMiniStripSaga(): SagaIterator {
  const cardphotoState: CardphotoState | null = yield select(selectCardphotoState)
  const appliedData = cardphotoState?.appliedData
  if (!appliedData?.id) {
    yield call(startCardphotoViewWithoutApply, cardphotoState)
    return
  }

  const assetData = cardphotoState?.assetData
  if (
    assetData?.id === appliedData.id &&
    imageMetaHasLiveDisplayUrl(assetData)
  ) {
    return
  }

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
