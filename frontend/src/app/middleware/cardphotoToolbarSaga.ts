import {
  call,
  all,
  fork,
  select,
  put,
  takeEvery,
} from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga'
import { PayloadAction } from '@reduxjs/toolkit'
import type { WorkingConfig } from '@cardphoto/domain/types'
import type { CardphotoSliceState } from '@cardphoto/infrastructure/state/cardphotoSlice'
import { toolbarAction } from '@toolbar/application/helpers'
import { storeAdapters } from '@db/adapters/storeAdapters'
import { RootState } from '@app/state'
import {
  commitWorkingConfig,
  resetCardphoto,
  setActiveSource,
  hydrateEditor,
  setProcessedImage,
  markLoaded,
  markLoading,
  setCardphotoListPanelOpen,
} from '@cardphoto/infrastructure/state'
import {
  selectCardphotoState,
  selectIsProcessedMode,
  selectIsListPanelOpen,
} from '@cardphoto/infrastructure/selectors'
import {
  handleCropAction,
  // handleCropCheckAction,
  handleImageRotate,
  handleCropFullAction,
  syncCropFullIcon,
  handleCropConfirm,
  handleCropGalleryAction,
  handleClearAllCropsSaga,
  handleDeleteImageSaga,
  handleBackToOriginalSaga,
  handleApplyAction,
} from './cardphotoHandlers'
import { rebuildConfigFromMeta } from './cardphotoProcessSaga'
import { prepareForRedux } from './cardphotoHelpers'
import { selectSizeCard } from '@layout/infrastructure/selectors'
import type { CardphotoToolbarState } from '@toolbar/domain/types'
import {
  getQualityColor,
  dispatchQualityUpdate,
  calculateCropQuality,
} from '@cardphoto/application/helpers'
import { onDownloadClick } from './cardphotoProcessSaga'
import { syncCardtextToolbarVisuals } from './cardtextHandlers'
import {
  updateToolbarSection,
  updateToolbarIcon,
  // updateGroupStatus,
} from '@toolbar/infrastructure/state'
import { selectToolbarSectionState } from '@toolbar/infrastructure/selectors'
import type {
  CardphotoState,
  ImageSource,
  ImageMeta,
} from '@cardphoto/domain/types'
import { SizeCard } from '@layout/domain/types'
import { CURRENT_EDITOR_IMAGE_ID } from '@cardphoto/domain/editorImageId'

/** Закрытие экрана создания: убрать загруженное фото и кропы, вернуть пустую форму. */
function* handleCloseCardphotoCreateSaga(): SagaIterator {
  try {
    yield call([storeAdapters.userImages, 'deleteById'], CURRENT_EDITOR_IMAGE_ID)
    yield call([storeAdapters.cardphotoImages, 'clear'])
    yield put(resetCardphoto())
    yield put(markLoaded())
    yield fork(syncToolbarContext)
  } catch (error) {
    console.error('Close cardphoto create failed:', error)
  }
}

export function* watchCropChanges(): SagaIterator {
  // takeEvery (not takeLatest): takeLatest cancels mid-flight and may skip updateToolbarIcon for cropFull.
  yield takeEvery(
    commitWorkingConfig.type,
    function* (action: PayloadAction<WorkingConfig>): SagaIterator {
      // isFull must follow this exact payload (same config the reducer just applied).
      yield call(syncCropFullIcon, { customConfig: action.payload })

      const slice = (yield select(
        (s) => s.cardphoto,
      )) as CardphotoSliceState
      const config = slice.state?.currentConfig

      if (config?.crop && config?.image?.meta) {
        const { quality, qualityProgress } = calculateCropQuality(
          config.crop.meta,
          config.image,
          config.image.meta,
          config.card.orientation,
        )

        yield call(dispatchQualityUpdate, qualityProgress, quality)

        const color = getQualityColor(qualityProgress)
        document.documentElement.style.setProperty('--crop-handle-color', color)
      }
    },
  )
}

export function* handleCardphotoToolbarAction(
  action: ReturnType<typeof toolbarAction>,
): SagaIterator {
  const { section, key, payload: editor } = action.payload

  // Upload / pick image — same flow as legacy `download` (opens hidden file input via `openFileDialog`).
  if (key === 'cardphotoAdd') {
    if (
      section === 'cardphoto' ||
      section === 'cardphotoCreate' ||
      section === 'cardphotoEditor'
    ) {
      yield call(onDownloadClick)
    }
    return
  }

  if (key === 'close' && section === 'cardphotoCreate') {
    yield call(handleCloseCardphotoCreateSaga)
    return
  }

  const isCardphotoEditingSection =
    section === 'cardphoto' || section === 'cardphotoEditor'

  if (!isCardphotoEditingSection) return

  switch (key) {
    case 'listCardphoto': {
      const isOpen: boolean = yield select(selectIsListPanelOpen)
      const nextState = isOpen ? 'enabled' : 'active'

      yield put(
        updateToolbarIcon({
          section: 'cardphoto',
          key: 'listCardphoto',
          value: nextState,
        }),
      )
      yield put(setCardphotoListPanelOpen(!isOpen))
      break
    }

    case 'deleteList':
      yield call(handleClearAllCropsSaga)
      break

    case 'close': {
      const state: CardphotoState = yield select(selectCardphotoState)
      const isProcessed: boolean = yield select(selectIsProcessedMode)

      const currentImageId = isProcessed
        ? state.base.processed.image?.id
        : state.base.user.image?.id

      yield call(handleDeleteImageSaga, currentImageId, state.activeSource)
      break
    }

    case 'download':
      yield call(onDownloadClick)
      break

    case 'imageReset':
      yield call(handleBackToOriginalSaga)
      break

    case 'crop':
      yield* handleCropAction()
      break

    case 'cropCheck':
      yield call(handleCropConfirm)
      break

    case 'cropFull':
      yield call(handleCropFullAction)
      break

    case 'cropHistory':
      yield call(handleCropGalleryAction)
      break

    case 'imageRotateLeft':
    case 'imageRotateRight':
      yield call(handleImageRotate, key)
      break

    case 'apply':
      yield call(handleApplyAction)
      break
    default:
      break
  }
}

export function* handleCardphotoToolbarAction1(
  action: ReturnType<typeof toolbarAction>,
): SagaIterator {
  const { section, key } = action.payload

  if (key === 'cardphotoAdd') {
    if (
      section === 'cardphoto' ||
      section === 'cardphotoCreate' ||
      section === 'cardphotoEditor'
    ) {
      yield call(onDownloadClick)
    }
    return
  }

  const isCardphotoSection = section === 'cardphoto'

  if (!isCardphotoSection) return

  switch (key) {
    case 'deleteList':
      yield call(handleClearAllCropsSaga)
      break
    case 'close':
      const state: CardphotoState = yield select(selectCardphotoState)
      const isProcessed: boolean = yield select(selectIsProcessedMode)

      console.log(state.base.stock.image)

      const currentImageId = isProcessed
        ? state.base.processed.image?.id
        : state.base.user.image?.id

      yield call(handleDeleteImageSaga, currentImageId, state.activeSource)
      break
    case 'download':
      yield call(onDownloadClick)
      break
    case 'imageReset':
      yield call(handleBackToOriginalSaga)
      break
    case 'crop':
      yield* handleCropAction()
      break
    case 'cropCheck':
      yield call(handleCropConfirm)
      break
    case 'cropFull':
      yield call(handleCropFullAction)
      break
    case 'cropHistory':
      yield call(handleCropGalleryAction)
      break
    case 'imageRotateLeft':
    case 'imageRotateRight':
      yield call(handleImageRotate, key)
      break
  }
}

function pickCardphotoEditorToolbarPatch(
  sectionUpdate: Record<string, unknown>,
): Record<string, unknown> {
  const keys = [
    'imageRotateLeft',
    'imageRotateRight',
    'crop',
    'cropFull',
    'cropCheck',
    'imageReset',
    'close',
  ] as const
  return Object.fromEntries(
    keys
      .filter((k) => sectionUpdate[k] !== undefined)
      .map((k) => [k, sectionUpdate[k]]),
  )
}

export function* syncToolbarContext() {
  const state: CardphotoState = yield select((s) => s.cardphoto.state)
  const toolbarCardphoto: CardphotoToolbarState | undefined = yield select(
    selectToolbarSectionState('cardphoto'),
  )
  const toolbarEditor: CardphotoToolbarState | undefined = yield select(
    selectToolbarSectionState('cardphotoEditor'),
  )

  // `crop` может отсутствовать в конфиге `cardphoto` — проверяем и editor.
  if (!state) return
  if (
    toolbarCardphoto?.crop?.state === 'active' ||
    toolbarEditor?.crop?.state === 'active'
  )
    return

  const { activeSource, cropCount } = state
  // console.log('syncToolbarContext + cropCount', cropCount)
  const hasCrops = cropCount > 0

  let sectionUpdate = {}
  const isUserImage = !!state.base.user.image
  const sizeCard: SizeCard = yield select(selectSizeCard)

  switch (activeSource) {
    case 'apply':
      sectionUpdate = {
        cardOrientation: {
          state: 'disabled',
          options: { orientation: sizeCard.orientation },
        },
        imageRotateLeft: { state: 'disabled' },
        imageRotateRight: { state: 'disabled' },
        crop: { state: 'disabled' },
        cropFull: { state: 'disabled' },
        imageReset: { state: 'enabled' },

        apply: { state: 'enabled' },
        close: { state: 'enabled' },
        download: { state: 'enabled' },
        cardphotoAdd: { state: 'enabled' },
        cropHistory: {
          state: hasCrops ? 'enabled' : 'disabled',
          options: { badge: cropCount },
        },
        saveList: { state: hasCrops ? 'enabled' : 'disabled' },
        deleteList: { state: hasCrops ? 'enabled' : 'disabled' },
      }
      break

    case 'processed':
      sectionUpdate = {
        cardOrientation: {
          state: 'disabled',
          options: { orientation: sizeCard.orientation },
        },
        imageRotateLeft: { state: 'disabled' },
        imageRotateRight: { state: 'disabled' },
        crop: { state: 'disabled' },
        cropFull: { state: 'disabled' },
        imageReset: { state: 'enabled' },

        apply: { state: 'enabled' },
        close: { state: 'enabled' },
        download: { state: 'enabled' },
        cardphotoAdd: { state: 'enabled' },
        cropHistory: {
          state: hasCrops ? 'enabled' : 'disabled',
          options: { badge: cropCount },
        },
        saveList: { state: hasCrops ? 'enabled' : 'disabled' },
        deleteList: { state: hasCrops ? 'enabled' : 'disabled' },
      }
      break

    case 'user':
      sectionUpdate = {
        cardOrientation: {
          state: 'enabled',
          options: { orientation: sizeCard.orientation },
        },
        imageRotateLeft: { state: 'enabled' },
        imageRotateRight: { state: 'enabled' },
        crop: { state: 'enabled' },
        cropFull: { state: 'disabled' },
        imageReset: { state: 'enabled' },

        apply: { state: 'disabled' },
        close: { state: 'enabled' },
        download: { state: 'enabled' },
        cardphotoAdd: { state: 'enabled' },
        cropHistory: {
          state: hasCrops ? 'enabled' : 'disabled',
          options: { badge: cropCount },
        },
        saveList: { state: hasCrops ? 'enabled' : 'disabled' },
        deleteList: { state: hasCrops ? 'enabled' : 'disabled' },
      }
      break

    case 'stock':
    default:
      sectionUpdate = {
        cardOrientation: {
          state: 'disabled',
          options: { orientation: sizeCard.orientation },
        },
        imageRotateLeft: { state: 'disabled' },
        imageRotateRight: { state: 'disabled' },
        crop: { state: 'disabled' },
        cropFull: { state: 'disabled' },
        imageReset: { state: isUserImage ? 'enabled' : 'disabled' },

        apply: { state: 'enabled' },
        close: { state: 'disabled' },
        download: { state: 'enabled' },
        cardphotoAdd: { state: 'enabled' },
        cropHistory: {
          state: hasCrops ? 'enabled' : 'disabled',
          options: { badge: cropCount },
        },
        saveList: { state: hasCrops ? 'enabled' : 'disabled' },
        deleteList: { state: hasCrops ? 'enabled' : 'disabled' },
      }
      break
  }

  yield put(
    updateToolbarSection({
      section: 'cardphoto',
      value: sectionUpdate,
    }),
  )

  yield put(
    updateToolbarSection({
      section: 'cardphotoCreate',
      value: {
        cardphotoAdd: (sectionUpdate as { cardphotoAdd?: { state: string } })
          .cardphotoAdd,
      },
    }),
  )

  yield put(
    updateToolbarSection({
      section: 'cardphotoEditor',
      value: pickCardphotoEditorToolbarPatch(
        sectionUpdate as Record<string, unknown>,
      ),
    }),
  )
}

const selectCurrentProcessedUrl = (state: RootState) =>
  state.cardphoto.state?.base.processed.image?.url

export function* onSelectCropFromHistorySaga(action: PayloadAction<string>) {
  try {
    const cropId = action.payload

    const oldUrl: string | undefined = yield select(selectCurrentProcessedUrl)
    const appliedUrl: string | undefined = yield select(
      (state) => state.cardphoto.state?.base.apply.image?.url,
    )

      const cropRecord: ImageMeta | null = yield call(
      [storeAdapters.cardphotoImages, storeAdapters.cardphotoImages.getById],
      cropId,
    )

    if (cropRecord) {
      const cardState = (yield select(
        (s: RootState) => s.cardphoto.state,
      )) as CardphotoState | null
      const stillInUse =
        oldUrl &&
        [
          cardState?.base.user.image?.url,
          cardState?.base.apply.image?.url,
          cardState?.base.stock.image?.url,
        ].includes(oldUrl)

      if (
        oldUrl?.startsWith('blob:') &&
        oldUrl !== appliedUrl &&
        !stillInUse
      ) {
        URL.revokeObjectURL(oldUrl)
      }

      const currentUrl = cropRecord.full?.blob
        ? URL.createObjectURL(cropRecord.full.blob)
        : cropRecord.url

      const serializable = prepareForRedux({
        ...cropRecord,
        url: currentUrl,
      })

      yield put(setProcessedImage(serializable))
      yield call(rebuildConfigFromMeta, serializable, 'processed')
    }
  } catch (error) {
    console.error('Select crop history error:', error)
  }
}

// export function* onSelectCropFromHistorySaga1(action: PayloadAction<string>) {
//   try {
//     const cropId = action.payload

//     const oldUrl: string | undefined = yield select(selectCurrentProcessedUrl)

//     const cropRecord: ImageMeta | null = yield call(
//       [storeAdapters.cropImages, storeAdapters.cropImages.getById],
//       cropId,
//     )

//     if (cropRecord) {
//       if (oldUrl?.startsWith('blob:')) {
//         URL.revokeObjectURL(oldUrl)
//       }

//       const currentUrl = cropRecord.full?.blob
//         ? URL.createObjectURL(cropRecord.full.blob)
//         : cropRecord.url

//       const serializable = prepareForRedux({
//         ...cropRecord,
//         url: currentUrl,
//       })

//       yield put(setProcessedImage(serializable))

//       yield call(rebuildConfigFromMeta, serializable, 'processed')
//     }
//   } catch (error) {
//     console.error('Select crop history error:', error)
//   }
// }

export function* watchToolbarContext() {
  yield takeEvery(
    [
      hydrateEditor.type,
      setActiveSource.type,
      commitWorkingConfig.type,
      resetCardphoto.type,
      setProcessedImage.type,
      markLoaded.type,
      markLoading.type,
    ],
    syncToolbarContext,
  )
}
