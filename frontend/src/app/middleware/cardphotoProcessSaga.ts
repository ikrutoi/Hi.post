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
  setBaseImage,
  setProcessedImage,
  uploadImageReady,
  hydrateEditor,
  setCardphotoPhotoStageRect,
  resetCardphoto,
  initCardphoto,
  bumpCardphotoInlineTemplateList,
  clearAllCrops,
  selectInLineTemplate,
} from '@cardphoto/infrastructure/state'
import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import { prepareForRedux, prepareConfigForRedux } from './cardphotoHelpers'
import {
  selectCardphotoState,
  selectCardphotoWorkingCardLayer,
  selectCardphotoPhotoStageRect,
} from '@cardphoto/infrastructure/selectors'
import { validateImageSize } from '@cardphoto/application/helpers'
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
  CardphotoBase,
  ActiveImageSource,
  ImageRotation,
  CardphotoSessionRecord,
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
        console.error('uploadUserImage: cannot read blob URL (revoked or invalid)', e)
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
    const isComplete = !!state.base.apply.image
    const config: WorkingConfig = yield call(
      rebuildConfigFromMeta,
      imageMeta,
      'user',
    )

    const imageRecord: ImageRecord = {
      id: CURRENT_EDITOR_IMAGE_ID,
      image: imageMeta,
    }
    yield call([storeAdapters.userImages, 'put'], imageRecord)

    const serializableMeta = prepareForRedux(imageMeta)
    const serializableConfig = prepareConfigForRedux(config)

    const base: CardphotoBase = {
      ...state.base,
      user: { image: serializableMeta },
    }

    yield put(
      hydrateEditor({
        base,
        config: serializableConfig,
        activeSource: 'user',
        isComplete,
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
  source: ActiveImageSource,
  forceOrientation?: LayoutOrientation,
  rotation?: ImageRotation,
) {
  try {
    // Не вызываем clearCurrentConfig + delay: иначе в CardphotoStage на мгновение
    // пропадает imageLayer → unmount .cropContainer → стейдж схлопывается →
    // ResizeObserver шлёт null/small rect → selectCardphotoWorkingCardLayer падает на
    // sizeCard вместо реальных пикселей стейджа (cropCheck / processed выглядят «сломанными»
    // до перезагрузки).

    // Cardphoto cards are square (125x125mm), so we never switch layout orientation here.
    // Keep `forceOrientation` for backward compatibility with older call sites.
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

    if (source === 'user') {
      const newOriginalMeta = {
        ...meta,
        // orientation doesn't affect square calculations anymore
        orientation: meta.orientation ?? 'landscape',
        rotation: newRotation,
      }

      const serializableMeta = prepareForRedux(newOriginalMeta)

      yield put(setBaseImage({ target: 'user', image: serializableMeta }))
    }

    yield put(commitWorkingConfig(prepareConfigForRedux(newConfig)))

    yield fork(persistGlobalSession)

    return newConfig
  } catch (error) {
    return null
  }
}

function* onSelectInLineTemplateSaga(action: PayloadAction<string>): SagaIterator {
  try {
    const id = action.payload
    const record: ImageMeta | null = yield call(
      [storeAdapters.cardphotoImages, 'getById'] as const,
      id,
    )
    if (!record) return

    // In list we show `inLine` templates; keep this explicit.
    if (record.status !== 'inLine') return

    // 1) Switch active image to `processed` so `CardphotoView` can render it.
    yield put(setProcessedImage(prepareForRedux(record)))

    // 2) Refit image + (re)build crop layer based on selected meta.
    yield call(rebuildConfigFromMeta, record, 'processed')
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

/** Если в конфиге размеры card не совпадают с измеренным стейджем — пересобрать fit (например после cropCheck). */
function* ensureCardphotoCardMatchesStageRect(): SagaIterator {
  const rect: { width: number; height: number } | null = yield select(
    selectCardphotoPhotoStageRect,
  )
  if (!rect || rect.width < 2 || rect.height < 2) return

  const state: CardphotoState | null = yield select(selectCardphotoState)
  if (!state?.activeSource || !state.currentConfig?.image) return

  const current = state.currentConfig.card
  if (
    Math.abs(current.width - rect.width) < 0.5 &&
    Math.abs(current.height - rect.height) < 0.5
  ) {
    return
  }

  const meta = state.base[state.activeSource]?.image
  if (!meta) return

  const rot = state.currentConfig.image.rotation ?? 0
  yield call(rebuildConfigFromMeta, meta, state.activeSource, undefined, rot)
}

/** When the real editor stage resizes, refit image/crop to measured pixels (not global SizeCard). */
function* watchCardphotoPhotoStageRect(): SagaIterator {
  yield takeLatest(setCardphotoPhotoStageRect.type, function* (): SagaIterator {
    yield delay(0)
    yield call(ensureCardphotoCardMatchesStageRect)
  })
}

/** Бейдж `listCardphoto` на тулбаре cardphoto — число картинок в IndexedDB со статусом inLine. */
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

    fork(watchCropChanges),
    fork(watchToolbarContext),
    fork(watchCardphotoPhotoStageRect),
    fork(watchCardphotoInLineBadge),
    /** RO не шлёт событие, если px размер стейджа тот же — после commit конфиг мог остаться от sizeCard. */
    takeEvery(commitWorkingConfig.type, ensureCardphotoCardMatchesStageRect),

    takeLatest(uploadUserImage.type, onUploadImageReadySaga),
    takeEvery(cancelFileDialog.type, onCancelFileDialog),
  ])
}
