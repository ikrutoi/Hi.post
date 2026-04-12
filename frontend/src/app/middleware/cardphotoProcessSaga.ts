import {
  takeEvery,
  put,
  select,
  all,
  takeLatest,
  fork,
  call,
  delay,
} from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga'
import { toolbarAction } from '@toolbar/application/helpers'
import { persistGlobalSession } from './sessionSaga'
import { storeAdapters } from '@db/adapters/storeAdapters'
import {
  openFileDialog,
  uploadUserImage,
  // initUserImage,
  cancelFileDialog,
  markLoading,
  markLoaded,
  setNeedsCrop,
  resetCropLayers,
  commitWorkingConfig,
  setUserOriginalData,
  setProcessedImage,
  uploadImageReady,
  hydrateEditor,
  setCardphotoImageStageRect,
  resetCardphoto,
  initCardphoto,
  bumpCardphotoInlineTemplateList,
  clearAllCrops,
  clearApply,
  selectInLineTemplate,
} from '@cardphoto/infrastructure/state'
import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import { prepareForRedux, prepareConfigForRedux } from './cardphotoHelpers'
import {
  selectCardphotoState,
  selectCardphotoWorkingCardLayer,
  selectCardphotoImageStageRect,
} from '@cardphoto/infrastructure/selectors'
import { validateImageSize } from '@cardphoto/application/helpers'
import { shouldSyncUserOriginalForState } from '@cardphoto/application/helpers'
import { setSizeCard } from '@layout/infrastructure/state'
import { roundTo } from '@shared/utils/layout'
import {
  updateToolbarSection,
  updateToolbarIcon,
} from '@toolbar/infrastructure/state'
import {} from './cardphotoHelpers'
import { selectToolbarSectionState } from '@toolbar/infrastructure/selectors'
import { updateGroupStatus } from '@toolbar/infrastructure/state'
import {
  fitImageToCard,
  createInitialCropLayer,
} from '@cardphoto/application/utils/imageFit'
import { updateCropToolbarState } from './cardphotoHelpers'
import {
  handleCardphotoToolbarAction,
  watchCropChanges,
  // watchCropToolbarStatus,
  // watchCropHistory,
  watchToolbarContext,
} from './cardphotoToolbarSaga'
import type { CardphotoToolbarState } from '@toolbar/domain/types'
import type { PayloadAction } from '@reduxjs/toolkit'
import type {
  ImageMeta,
  CardLayer,
  WorkingConfig,
  CardphotoState,
  ImageRecord,
} from '@cardphoto/domain/types'
import type { LayoutOrientation } from '@layout/domain/types'
import { setAsset } from '@/entities/assetRegistry/infrastructure/state'
import { CURRENT_EDITOR_IMAGE_ID } from '@cardphoto/domain/editorImageId'

export function* onDownloadClick(): SagaIterator {
  yield put(
    updateToolbarIcon({ section: 'cardphoto', key: 'crop', value: 'enabled' }),
  )
  yield put(
    updateToolbarIcon({
      section: 'cardphoto',
      key: 'cropCheck',
      value: 'disabled',
    }),
  )

  yield put(markLoading())
  console.log('onDownload')

  yield put(
    updateGroupStatus({
      section: 'cardphoto',
      groupName: 'ui',
      status: 'disabled',
    }),
  )

  yield put(
    updateGroupStatus({
      section: 'cardphoto',
      groupName: 'photo',
      status: 'disabled',
    }),
  )

  yield put(openFileDialog())
}

function* onUploadImageReadySaga(action: PayloadAction<ImageMeta>) {
  try {
    let imageMeta = action.payload
    // Prefer `full.blob` (kept on upload). Fallback: fetch blob: URL (may fail if revoked).
    if (!imageMeta.full?.blob && imageMeta.url?.startsWith('blob:')) {
      try {
        const blob: Blob = yield call(async () => {
          const res = await fetch(imageMeta.url)
          if (!res.ok) {
            throw new Error(`blob fetch ${res.status}`)
          }
          return res.blob()
        })
        imageMeta = {
          ...imageMeta,
          full: { ...imageMeta.full, blob },
        }
      } catch (e) {
        console.error(
          'uploadUserImage: cannot read blob URL (revoked or invalid)',
          e,
        )
        yield put(markLoaded())
        return
      }
    }

    yield put(
      setAsset({
        id: imageMeta.id,
        url: imageMeta.url,
        thumbUrl: imageMeta.thumbnail?.url || imageMeta.url,
      }),
    )

    const state: CardphotoState = yield select(selectCardphotoState)
    const isComplete = !!state.appliedData
    const config: WorkingConfig = yield call(
      rebuildConfigFromMeta,
      imageMeta,
      true,
    )

    const imageRecord: ImageRecord = {
      id: CURRENT_EDITOR_IMAGE_ID,
      image: imageMeta,
    }
    yield call([storeAdapters.userImages, 'put'], imageRecord)

    const serializableMeta = prepareForRedux(imageMeta)
    const serializableConfig = prepareConfigForRedux(config)

    yield put(
      hydrateEditor({
        config: serializableConfig,
        isComplete,
        assetData: serializableMeta,
        userOriginalData: serializableMeta,
      }),
    )
  } catch (error) {
    console.error('Error in onUploadImageReadySaga:', error)
  } finally {
    yield put(markLoaded())
  }

  console.log('onUpload')

  const groups = ['photo', 'ui']
  for (const groupName of groups) {
    yield put(
      updateGroupStatus({
        section: 'cardphoto',
        groupName,
        status: 'enabled',
      }),
    )
  }
}

function* onCancelFileDialog(): SagaIterator {
  yield put(markLoaded())

  yield put(
    updateGroupStatus({
      section: 'cardphoto',
      groupName: 'photo',
      status: 'enabled',
    }),
  )

  yield put(
    updateGroupStatus({
      section: 'cardphoto',
      groupName: 'ui',
      status: 'enabled',
    }),
  )
}

export function* rebuildConfigFromMeta(
  meta: ImageMeta,
  syncUserOriginal: boolean,
  forceOrientation?: LayoutOrientation,
  rotation?: number,
) {
  try {
    void forceOrientation

    const newRotation = rotation ?? meta.rotation ?? 0

    const updatedCard: CardLayer = yield select(selectCardphotoWorkingCardLayer)
    const imageLayer = fitImageToCard(
      meta,
      updatedCard,
      newRotation,
      meta.isCropped ?? false,
    )
    const cropLayer = createInitialCropLayer(imageLayer, updatedCard, meta)

    const newConfig: WorkingConfig = {
      card: updatedCard,
      image: imageLayer,
      crop: cropLayer,
    }

    if (syncUserOriginal) {
      const newOriginalMeta = {
        ...meta,
        rotation: newRotation,
      }

      const serializableMeta = prepareForRedux(newOriginalMeta)

      yield put(setUserOriginalData(serializableMeta))
    }

    yield put(commitWorkingConfig(prepareConfigForRedux(newConfig)))

    yield fork(persistGlobalSession)

    return newConfig
  } catch (error) {
    return null
  }
}

function* onSelectInLineTemplateSaga(
  action: PayloadAction<string>,
): SagaIterator {
  try {
    const id = action.payload
    const record: ImageMeta | null = yield call(
      [storeAdapters.cardphotoImages, 'getById'] as const,
      id,
    )
    if (!record) return

    if (record.status !== 'inLine') return

    yield put(setProcessedImage(prepareForRedux(record)))

    yield call(rebuildConfigFromMeta, record, false)
  } catch (e) {
    console.error('onSelectInLineTemplateSaga', e)
  }
}

export function* onDeleteCropSaga(action: PayloadAction<string>): SagaIterator {
  try {
    const cropId = action.payload

    yield call(
      [storeAdapters.cardphotoImages, storeAdapters.cardphotoImages.deleteById],
      cropId,
    )
  } catch (error) {
    console.error('Failed to delete crop from DB:', error)
  }
}

function* onClearApplySaga(): SagaIterator {
  try {
    yield call([storeAdapters.applyImage, 'deleteById'], 'current_apply_image')
  } catch (error) {
    console.error('Failed to clear apply image from DB:', error)
  }
}

function* ensureCardphotoCardMatchesStageRect(): SagaIterator {
  const rect: { width: number; height: number } | null = yield select(
    selectCardphotoImageStageRect,
  )
  if (!rect || rect.width < 2 || rect.height < 2) return

  const state: CardphotoState | null = yield select(selectCardphotoState)
  if (!state || !state.assetConfig?.image) return

  const current = state.assetConfig.card
  if (
    Math.abs(current.width - rect.width) < 0.5 &&
    Math.abs(current.height - rect.height) < 0.5
  ) {
    return
  }

  const meta = state.assetData
  if (!meta) return

  const rot = state.assetConfig.image.rotation ?? 0
  const syncUserOriginal = shouldSyncUserOriginalForState(state)
  yield call(rebuildConfigFromMeta, meta, syncUserOriginal, undefined, rot)
}

function* watchCardphotoImageStageRect(): SagaIterator {
  yield takeLatest(setCardphotoImageStageRect.type, function* (): SagaIterator {
    yield delay(0)
    yield call(ensureCardphotoCardMatchesStageRect)
  })
}

function* refreshCardphotoListCardphotoBadge(): SagaIterator {
  try {
    const all: ImageMeta[] = yield call(storeAdapters.cardphotoImages.getAll)
    const n = all.filter((x) => x.status === 'inLine').length
    yield put(
      updateToolbarIcon({
        section: 'cardphoto',
        key: 'listCardphoto',
        value: { options: { badge: n > 0 ? n : null } },
      }),
    )
  } catch (e) {
    console.error('refreshCardphotoListCardphotoBadge', e)
  }
}

function* watchCardphotoInLineBadge(): SagaIterator {
  yield takeEvery(
    [
      bumpCardphotoInlineTemplateList.type,
      hydrateEditor.type,
      resetCardphoto.type,
      initCardphoto.type,
      clearAllCrops.type,
    ],
    refreshCardphotoListCardphotoBadge,
  )
}

export function* cardphotoProcessSaga(): SagaIterator {
  yield all([
    takeLatest(toolbarAction.type, handleCardphotoToolbarAction),
    takeLatest(selectInLineTemplate.type, onSelectInLineTemplateSaga),
    takeEvery(clearApply.type, onClearApplySaga),

    fork(watchCropChanges),
    fork(watchToolbarContext),
    fork(watchCardphotoImageStageRect),
    fork(watchCardphotoInLineBadge),
    takeEvery(commitWorkingConfig.type, ensureCardphotoCardMatchesStageRect),

    takeLatest(uploadUserImage.type, onUploadImageReadySaga),
    takeEvery(cancelFileDialog.type, onCancelFileDialog),
  ])
}
