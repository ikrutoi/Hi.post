import { call, put, select, fork, takeLatest } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit'
import { nanoid } from 'nanoid'
import type { SagaIterator } from 'redux-saga'
import { RootState } from '../state'
import { storeAdapters } from '@db/adapters/storeAdapters'
import {
  commitWorkingConfig,
  applyFinal,
  type CardphotoSliceState,
  markLoading,
  markLoaded,
  addCropId,
  setProcessedImage,
  removeCropId,
  clearAllCrops,
  removeUserImage,
  setActiveSource,
  hydrateEditor,
} from '@cardphoto/infrastructure/state'
import { selectToolbarSectionState } from '@toolbar/infrastructure/selectors'
import {
  selectCurrentConfig,
  selectCardphotoState,
  selectActiveImage,
  selectActiveSource,
  selectIsCropFull,
} from '@cardphoto/infrastructure/selectors'
import { applyBounds } from '@cardphoto/application/helpers'
import {
  prepareConfigForRedux,
  updateCropToolbarState,
} from './cardphotoHelpers'
import {
  getCroppedBase64,
  transformCropForOrientation,
  calculateCropQuality,
  dispatchQualityUpdate,
} from '@cardphoto/application/helpers'
import { setCardOrientation, setSizeCard } from '@layout/infrastructure/state'
import { rebuildConfigFromMeta } from './cardphotoProcessSaga'
import {
  selectSizeCard,
  selectViewportSize,
} from '@layout/infrastructure/selectors'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import {
  fitImageToCard,
  createInitialCropLayer,
  createFullCropLayer,
} from '@cardphoto/application/utils'
import { getCroppedImg, loadAsyncImage } from '@cardphoto/application/hooks'
import { roundTo } from '@shared/utils/layout'
import { syncToolbarContext } from './cardphotoToolbarSaga'
import type {
  SizeCard,
  ViewportSizeState,
  LayoutOrientation,
} from '@layout/domain/types'
import type { CardphotoToolbarState } from '@toolbar/domain/types'
import type {
  WorkingConfig,
  ImageMeta,
  ImageLayer,
  CardLayer,
  CardphotoState,
  ImageRotation,
  CropLayer,
  ActiveImageSource,
  ImageRecord,
} from '@cardphoto/domain/types'
import { CURRENT_EDITOR_IMAGE_ID } from '@cardphoto/domain/editorImageId'
import { prepareForRedux } from './cardphotoHelpers'
import { persistGlobalSession } from './sessionSaga'
import { setAsset } from '@/entities/assetRegistry/infrastructure/state'
import { ImageAsset } from '@/entities/assetRegistry/domain/types'
import { selectAssetById } from '@/entities/assetRegistry/infrastructure/selectors/assetRegistrySelectors'

export function* handleCropAction() {
  let toolbarState: CardphotoToolbarState | undefined = yield select(
    selectToolbarSectionState('cardphotoEditor'),
  )
  if (!toolbarState?.crop) {
    toolbarState = yield select(selectToolbarSectionState('cardphoto'))
  }
  const config: WorkingConfig | null = yield select(selectCurrentConfig)
  if (!config) return

  if (!toolbarState?.crop) return

  const isActivating = toolbarState.crop.state === 'enabled'

  if (isActivating) {
    yield call(updateCropToolbarState, 'active', toolbarState)

    yield call(syncCropFullIcon, {
      forceActive: true,
      customConfig: config,
    })
  } else {
    yield call(updateCropToolbarState, 'enabled', toolbarState)
  }
}

export function* handleCropFullAction(): SagaIterator {
  const state = (yield select(selectCardphotoState)) as CardphotoState
  if (!state?.currentConfig) return
  const originalImage: ImageMeta = yield select(selectActiveImage)

  const { image, card } = state.currentConfig

  const rawFullCrop = createFullCropLayer(image, card)
  const fullCrop = applyBounds(rawFullCrop, image, card.orientation)

  const { quality, qualityProgress } = calculateCropQuality(
    fullCrop.meta,
    image,
    originalImage,
    card.orientation,
  )

  const newConfig: WorkingConfig = {
    ...state.currentConfig,
    crop: {
      ...fullCrop,
      meta: {
        ...fullCrop.meta,
        quality,
        qualityProgress,
      },
    },
  }

  yield put(commitWorkingConfig(prepareConfigForRedux(newConfig)))
}

export function* syncCropFullIcon(params?: {
  forceActive?: boolean
  customConfig?: WorkingConfig
}): SagaIterator {
  let toolbarState: CardphotoToolbarState | undefined = yield select(
    selectToolbarSectionState('cardphotoEditor'),
  )
  if (!toolbarState?.crop) {
    toolbarState = yield select(selectToolbarSectionState('cardphoto'))
  }

  if (!toolbarState?.crop) return

  const currentStatus = params?.forceActive
    ? 'active'
    : toolbarState.crop.state

  if (currentStatus !== 'active') return

  let isFull: boolean
  if (params?.customConfig) {
    isFull = yield select((state: RootState) =>
      selectIsCropFull.resultFunc(params.customConfig!),
    )
  } else {
    isFull = yield select(selectIsCropFull)
  }

  yield* updateCropToolbarState('active', toolbarState, { isFull })
}

export function* handleOrientationAction() {
  const sizeCard: SizeCard = yield select(selectSizeCard)
  const newOrientation: LayoutOrientation =
    sizeCard.orientation === 'portrait' ? 'landscape' : 'portrait'

  const viewportSize: ViewportSizeState = yield select(selectViewportSize)
  const viewportHeight = viewportSize?.height ?? sizeCard.height

  yield put(setCardOrientation({ orientation: newOrientation, viewportHeight }))

  yield put(
    updateToolbarIcon({
      section: 'cardphoto',
      key: 'orientation',
      value: newOrientation,
    }),
  )
}

export function* handleImageLayerUpdate() {
  // const sizeCard: SizeCard = yield select(selectSizeCard)
  const config: WorkingConfig | null = yield select(selectCurrentConfig)
  // const originalImage: ImageMeta = yield select(selectActiveImage)

  if (!config || !config.image?.meta) return

  console.log('handleImageLayerUpdate--->>>', config.image.meta)
  const newConfig: WorkingConfig = yield call(
    rebuildConfigFromMeta,
    config.image.meta,
    'user',
  )

  // const newImageLayer: ImageLayer = fitImageToCard(
  //   config.image.meta,
  //   sizeCard,
  //   config.image.orientation,
  //   config.image.meta.isCropped,
  // )
  // const newCropLayer = createInitialCropLayer(
  //   newImageLayer,
  //   sizeCard,
  //   originalImage,
  // )
  // const newConfig: WorkingConfig = {
  //   card: sizeCard,
  //   image: newImageLayer,
  //   crop: newCropLayer,
  // }

  // `rebuildConfigFromMeta` already updates `currentConfig` via `commitWorkingConfig`.
}

export function* handleCardOrientation(): SagaIterator {
  const config: WorkingConfig | null = yield select(selectCurrentConfig)
  if (!config) return

  const toolbarState: CardphotoToolbarState = yield select(
    selectToolbarSectionState('cardphoto'),
  )
  if (!toolbarState?.crop) return

  const isCropActive = toolbarState.crop.state === 'active'

  const originalImage: ImageMeta = yield select(selectActiveImage)

  if (isCropActive) {
    yield put(
      updateToolbarIcon({
        section: 'cardphoto',
        key: 'crop',
        value: 'disabled',
      }),
    )
  }

  const newOrientation: LayoutOrientation =
    config.card.orientation === 'portrait' ? 'landscape' : 'portrait'

  const ratio = config.card.aspectRatio

  console.log('HANDLE_CARD')
  const newConfig: WorkingConfig = yield call(
    rebuildConfigFromMeta,
    originalImage,
    'user',
    newOrientation,
  )

  // console.log('handleCardOrientation newCardLayer', newCardLayer)

  // yield put(setSizeCard(newConfig.card))
  // `rebuildConfigFromMeta` already updates `currentConfig` via `commitWorkingConfig`.

  yield put(
    updateToolbarIcon({
      section: 'cardphoto',
      key: 'orientation',
      value: newOrientation,
    }),
  )

  const resultCropState = isCropActive ? 'active' : 'enabled'
  yield put(
    updateToolbarIcon({
      section: 'cardphoto',
      key: 'crop',
      value: resultCropState,
    }),
  )

  if (isCropActive) {
    yield call(syncCropFullIcon, {
      forceActive: true,
      customConfig: newConfig,
    })
  }
}

function rotateRight(r: ImageRotation): ImageRotation {
  return ((r + 90) % 360) as ImageRotation
}

function rotateLeft(r: ImageRotation): ImageRotation {
  return ((r - 90 + 360) % 360) as ImageRotation
}

export function* handleImageRotate(
  key: 'imageRotateLeft' | 'imageRotateRight',
): SagaIterator {
  const state = yield select(selectCardphotoState)
  const originalImage: ImageMeta = yield select(selectActiveImage)

  if (!state?.currentConfig || !originalImage) return

  const currentRotation = state.currentConfig.image.rotation ?? 0
  const nextRotation =
    key === 'imageRotateRight'
      ? rotateRight(currentRotation)
      : rotateLeft(currentRotation)

  const activeSource = (yield select(selectActiveSource)) ?? 'user'

  yield call(
    rebuildConfigFromMeta,
    originalImage,
    activeSource,
    undefined,
    nextRotation,
  )

  // `rebuildConfigFromMeta` уже кладёт конфиг через `commitWorkingConfig`.
}

export function* handleCropConfirm(): SagaIterator {
  const state: CardphotoState = yield select(selectCardphotoState)
  const config = state.currentConfig
  const thumbConfigSize = 360

  if (!config || !config.crop || !config.image.meta.url) return

  try {
    yield put(markLoading())

    const img: HTMLImageElement = yield call(
      loadAsyncImage,
      config.image.meta.url,
    )

    console.log('HANDLE_CROP_CONFIRM img', img)

    const scaleX = img.naturalWidth / config.image.meta.width
    const scaleY = img.naturalHeight / config.image.meta.height

    const realCrop: CropLayer = {
      ...config.crop,
      x: roundTo(Math.abs((config.crop.x - config.image.left) * scaleX), 2),
      y: roundTo(Math.abs((config.crop.y - config.image.top) * scaleY), 2),
      meta: {
        ...config.crop.meta,
        width: Math.floor(config.crop.meta.width * scaleX),
        height: Math.floor(config.crop.meta.height * scaleY),
      },
    }

    const { full, thumb } = yield call(
      getCroppedImg,
      img,
      realCrop,
      thumbConfigSize,
    )

    const fullUrl = URL.createObjectURL(full)
    const thumbUrl = URL.createObjectURL(thumb)
    const id = nanoid()

    yield put(
      setAsset({
        id,
        url: fullUrl,
        thumbUrl: thumbUrl,
      }),
    )

    const finalImageMeta: ImageMeta = {
      id,
      source: config.image.meta.source,
      status: 'processed',
      url: fullUrl,
      width: realCrop.meta.width,
      height: realCrop.meta.height,
      full: {
        blob: full,
        url: fullUrl,
        width: realCrop.meta.width,
        height: realCrop.meta.height,
      },
      thumbnail: {
        blob: thumb,
        url: thumbUrl,
        width: thumbConfigSize,
        height: thumbConfigSize,
      },
      imageAspectRatio: realCrop.meta.aspectRatio,
      isCropped: true,
      timestamp: Date.now(),
      parentImageId: config.image.meta.id,
      rotation: 0,
    }

    // console.log('handleCropConfirm finalImageMeta', finalImageMeta)

    yield call(storeAdapters.cardphotoImages.put, finalImageMeta)

    const reduxMeta = prepareForRedux(finalImageMeta)
    yield put(setProcessedImage(reduxMeta))
    // yield put(applyFinal(reduxMeta))
    yield put(addCropId(id))

    console.log('HANDLE_CROP')
    const newConfig: WorkingConfig = yield call(
      rebuildConfigFromMeta,
      reduxMeta,
      'processed',
    )

    // `rebuildConfigFromMeta` already commits `currentConfig` via `commitWorkingConfig`.

    yield put(
      updateToolbarIcon({
        section: 'cardphoto',
        key: 'crop',
        value: 'enabled',
      }),
    )
    yield put(
      updateToolbarIcon({
        section: 'cardphoto',
        key: 'cropCheck',
        value: 'disabled',
      }),
    )
  } catch (error) {
    console.error('Error crop:', error)
  } finally {
    yield put(markLoaded())
  }
}

// function* rebuildConfigFromMeta(meta: ImageMeta) {
//   const card: CardLayer = yield select(selectSizeCard)
//   const imageLayer = fitImageToCard(meta, card, 0, true)
//   const cropLayer = createInitialCropLayer(imageLayer, card, meta)

//   yield put(
//     addOperation({
//       type: 'operation',
//       payload: {
//         config: { card, image: imageLayer, crop: cropLayer },
//         reason: 'init',
//       },
//     }),
//   )
// }

export function* handleDeleteImageSaga(
  id: string | undefined,
  source: ActiveImageSource | null,
) {
  try {
    const state: CardphotoState = yield select(selectCardphotoState)
    const stockImage = state.base.stock.image

    if (source === 'processed' && id) {
      const currentIndex = state.cropIds.indexOf(id)

      yield call(storeAdapters.cardphotoImages.deleteById, id)

      const remainingIds = state.cropIds.filter((cropId) => cropId !== id)

      yield put(removeCropId(id))

      if (remainingIds.length > 0) {
        const nextIdx =
          currentIndex < remainingIds.length
            ? currentIndex
            : remainingIds.length - 1
        const nextId = remainingIds[nextIdx]

        const nextCrop: ImageMeta = yield call(
          storeAdapters.cardphotoImages.getById,
          nextId,
        )

        if (nextCrop) {
          const freshUrl = nextCrop.full?.blob
            ? URL.createObjectURL(nextCrop.full.blob)
            : nextCrop.url

          const serializable = prepareForRedux({ ...nextCrop, url: freshUrl })

          yield put(setProcessedImage(serializable))
          yield put(setActiveSource('processed'))
          yield fork(rebuildConfigFromMeta, serializable, 'processed')
        }
      } else if (state.base.user.image) {
        yield put(setActiveSource('user'))
        yield fork(rebuildConfigFromMeta, state.base.user.image, 'user')
      } else if (stockImage) {
        yield put(setActiveSource('stock'))
        yield fork(rebuildConfigFromMeta, stockImage, 'stock')
      }
    } else if (source === 'user') {
      yield call(storeAdapters.userImages.deleteById, CURRENT_EDITOR_IMAGE_ID)
      yield put(removeUserImage())

      if (state.cropIds.length > 0) {
        const lastId = state.cropIds[state.cropIds.length - 1]
        const lastCrop: ImageMeta = yield call(
          storeAdapters.cardphotoImages.getById,
          lastId,
        )
        if (lastCrop) {
          const serializable = prepareForRedux({
            ...lastCrop,
            url: lastCrop.full?.blob
              ? URL.createObjectURL(lastCrop.full.blob)
              : lastCrop.url,
          })
          yield put(setProcessedImage(serializable))
          yield put(setActiveSource('processed'))
          yield fork(rebuildConfigFromMeta, serializable, 'processed')
        }
      } else {
        if (stockImage) {
          yield put(setActiveSource('stock'))
          yield fork(rebuildConfigFromMeta, stockImage, 'stock')
        }
      }
    }

    yield fork(syncToolbarContext)
  } catch (error) {
    console.error('Delete flow failed:', error)
  }
}

export function* handleClearAllCropsSaga() {
  console.log('handleClearAll')
  try {
    yield put(markLoading())
    yield call(storeAdapters.cardphotoImages.clear)
    yield put(clearAllCrops())
    yield fork(syncToolbarContext)

    // yield put(showNotification({ message: 'History cleared', type: 'success' }))
  } catch (error) {
    console.error('Failed to clear crops history:', error)
  } finally {
    yield put(markLoaded())
  }
}

export function* syncQualitySaga() {
  const state: CardphotoState = yield select((s) => s.cardphoto)
  const config = state.currentConfig

  console.log('syncQualitySaga')

  if (config?.crop && config?.image) {
    const { qualityProgress, quality } = calculateCropQuality(
      config.crop.meta,
      config.image,
      config.image.meta,
      config.card.orientation,
    )
    dispatchQualityUpdate(qualityProgress, quality)
  }
}

export function* handleCropGalleryAction() {
  // Cardphoto cards are square; crop gallery should not toggle layout orientation.
}

export function* handleBackToOriginalSaga() {
  const state: CardphotoState = yield select(selectCardphotoState)
  const userMeta = state.base.user.image
  const stockMeta = state.base.stock.image
  const activeSource = state.activeSource
  const isComplete = !!state.base.apply.image

  console.log('BACK_SAGA state', state)

  let nextSource: ActiveImageSource | null = null
  let nextMeta = null

  if (activeSource === 'processed') {
    if (userMeta) {
      nextSource = 'user'
      nextMeta = userMeta
    } else {
      nextSource = 'stock'
      nextMeta = stockMeta
    }
  } else if (activeSource === 'user') {
    nextSource = 'stock'
    nextMeta = stockMeta
  } else if (activeSource === 'stock' && userMeta) {
    nextSource = 'user'
    nextMeta = userMeta
  }

  if (nextSource && nextMeta) {
    const toolbarState: CardphotoToolbarState = yield select(
      selectToolbarSectionState('cardphoto'),
    )

    if (toolbarState?.crop?.state === 'active') {
      yield call(updateCropToolbarState, 'enabled', toolbarState)
    }
    console.log('HANDLE_BACK')
    const config: WorkingConfig = yield call(
      rebuildConfigFromMeta,
      nextMeta,
      nextSource,
      nextMeta.orientation,
    )

    yield put(
      hydrateEditor({
        ...state,
        config,
        activeSource: nextSource,
        isComplete,
      }),
    )

    yield fork(syncToolbarContext)
  }
}

export function* handleApplyAction() {
  const state: CardphotoState = yield select(selectCardphotoState)
  const currentSource = state.activeSource

  if (currentSource !== 'processed' && currentSource !== 'stock') return

  const currentImageMeta = state.base[currentSource].image

  if (currentImageMeta) {
    try {
      const asset: ImageAsset | null = yield select((state) =>
        selectAssetById(state, currentImageMeta.id),
      )

      let finalUrl = asset?.url
      let finalThumb = asset?.thumbUrl

      if (!asset) {
        const adapter =
          currentSource === 'stock'
            ? storeAdapters.stockImages
            : storeAdapters.cardphotoImages

        const fullRecord: ImageMeta | null = yield call(
          [adapter, 'getById'],
          currentImageMeta.id,
        )

        if (fullRecord) {
          finalUrl = fullRecord.full?.blob
            ? URL.createObjectURL(fullRecord.full.blob)
            : fullRecord.url
          finalThumb =
            fullRecord.thumbnail?.url ||
            (fullRecord.thumbnail?.blob
              ? URL.createObjectURL(fullRecord.thumbnail.blob)
              : '')

          yield put(
            setAsset({
              id: fullRecord.id,
              url: finalUrl,
              thumbUrl: finalThumb,
            }),
          )
        }
      }

      if (finalUrl) {
        const appliedMeta: ImageMeta = {
          ...currentImageMeta,
          url: finalUrl,
          thumbnail: {
            ...currentImageMeta.thumbnail!,
            url: finalThumb || '',
          },
          source: currentImageMeta.source,
          status: 'outLine',
        }

        const wrapper: ImageRecord = {
          id: 'current_apply_image',
          image: appliedMeta,
        }

        yield call([storeAdapters.applyImage, 'put'], wrapper)
        yield put(applyFinal(prepareForRedux(appliedMeta)))
        yield put(setActiveSource('apply'))
      }
    } catch (error) {
      console.error('Apply error:', error)
    }
  }
}

export function* handleApplyAction2() {
  const state: CardphotoState = yield select(selectCardphotoState)
  if (state.activeSource !== 'processed' && state.activeSource !== 'stock')
    return

  const currentSource = state.activeSource
  const currentImageMeta = state.base[currentSource].image

  if (currentImageMeta) {
    try {
      const adapter =
        currentSource === 'stock'
          ? storeAdapters.stockImages
            : storeAdapters.cardphotoImages

      const fullRecord: ImageMeta | null = yield call(
        [adapter, 'getById'],
        currentImageMeta.id,
      )

      if (fullRecord) {
        const applyUrl = fullRecord.full?.blob
          ? URL.createObjectURL(fullRecord.full.blob)
          : fullRecord.url

        const thumbnail = fullRecord.thumbnail

        const appliedMeta: ImageMeta = {
          ...fullRecord,
          url: applyUrl,
          thumbnail: thumbnail,
          source: fullRecord.source,
          status: 'outLine',
        }

        const wrapper: ImageRecord = {
          id: 'current_apply_image',
          image: appliedMeta,
        }

        yield call([storeAdapters.applyImage, 'put'], wrapper)

        yield put(applyFinal(prepareForRedux(appliedMeta)))
        yield put(setActiveSource('apply'))

        console.log('Apply saved with thumbnail:', !!thumbnail)
      }
    } catch (error) {
      console.error('Apply error:', error)
    }
  }
}

// export function* handleApplyAction1() {
//   const state: CardphotoState = yield select(selectCardphotoState)
//   if (state.activeSource !== 'processed' && state.activeSource !== 'stock')
//     return

//   const currentSource = state.activeSource
//   const currentImageMeta = state.base[currentSource].image

//   if (currentImageMeta) {
//     try {
//       const adapter =
//         currentSource === 'stock'
//           ? storeAdapters.stockImages
//           : storeAdapters.cropImages

//       const fullRecord: ImageMeta | null = yield call(
//         [adapter, 'getById'],
//         currentImageMeta.id,
//       )

//       if (fullRecord) {
//         const applyUrl = fullRecord.full?.blob
//           ? URL.createObjectURL(fullRecord.full.blob)
//           : fullRecord.url

//         const appliedMeta: ImageMeta = {
//           ...fullRecord,
//           url: applyUrl,
//           source: 'apply',
//         }

//         const wrapper: ImageRecord = {
//           id: 'current_apply_image',
//           image: appliedMeta,
//         }
//         yield call([storeAdapters.applyImage, 'put'], wrapper)

//         yield put(applyFinal(prepareForRedux(appliedMeta)))
//         yield put(setActiveSource('apply'))

//         console.log(
//           'Apply saved to DB as wrapper with original ID:',
//           appliedMeta.id,
//         )
//       }
//     } catch (error) {
//       console.error('Apply error:', error)
//     }
//   }
// }
