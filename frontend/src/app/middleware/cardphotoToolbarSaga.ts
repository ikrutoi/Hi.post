import { call, all, fork, select, put, takeEvery } from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga'
import { PayloadAction } from '@reduxjs/toolkit'
import type { WorkingConfig } from '@cardphoto/domain/types'
import type { CardphotoSliceState } from '@cardphoto/infrastructure/state/cardphotoSlice'
import { toolbarAction } from '@toolbar/application/helpers'
import { storeAdapters } from '@db/adapters/storeAdapters'
import { RootState } from '@app/state'
import {
  applyFinal,
  clearApply,
  commitWorkingConfig,
  resetCardphoto,
  hydrateEditor,
  setAssetData,
  setProcessedImage,
  markLoaded,
  markLoading,
  setCardphotoListPanelOpen,
  bumpCardphotoInlineTemplateList,
  cycleListTemplateGridCols,
  setListTemplateGridCols,
  clearCurrentConfig,
  setCardphotoViewEditMode,
} from '@cardphoto/infrastructure/state'
import { selectIsCardphotoViewEditMode } from '@cardphoto/infrastructure/selectors/cardphotoUiSelectors'
import {
  selectActiveImage,
  selectCardphotoListTemplateGridCols,
  selectCardphotoState,
  selectIsListPanelOpen,
} from '@cardphoto/infrastructure/selectors'
import {
  handleCropAction,
  // handleCropCheckAction,
  handleImageRotate,
  handleCropFullAction,
  syncCropFullIcon,
  handleCropConfirm,
  handleClearAllCropsSaga,
  handleDeleteImageSaga,
  handleBackToOriginalSaga,
  handleApplyAction,
  handlePromoteProcessedToInlineSaga,
} from './cardphotoHandlers'
import { rebuildConfigFromMeta } from './cardphotoProcessSaga'
import { prepareForRedux } from './cardphotoHelpers'
import { collectReferencedBlobUrls } from './blobUrlRevokeGuards'
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
import { CURRENT_EDITOR_IMAGE_ID } from '@cardphoto/domain/editorImageId'
import type { UiPreferencesRecord } from '@db/types/storeMap.types'

type ToolbarAssetKind = 'none' | 'apply' | 'processed' | 'user' | 'stock'

const CARDPHOTO_LIST_PREF_ID: UiPreferencesRecord['id'] = 'cardphotoList'

function* handleDeleteAllCardphotoInlineTemplatesSaga(): SagaIterator {
  try {
    const all: ImageMeta[] = yield call(storeAdapters.cardphotoImages.getAll)
    for (const meta of all) {
      if (meta.status === 'inLine') {
        yield call(
          [storeAdapters.cardphotoImages, 'deleteById'] as const,
          meta.id,
        )
      }
    }
    yield put(bumpCardphotoInlineTemplateList())
  } catch (e) {
    console.error('handleDeleteAllCardphotoInlineTemplatesSaga', e)
  }
}

function* hydrateCardphotoListDensityFromDbSaga(): SagaIterator {
  try {
    const pref: UiPreferencesRecord | null = yield call(
      [storeAdapters.uiPreferences, 'getById'] as const,
      CARDPHOTO_LIST_PREF_ID,
    )
    if (pref?.id !== 'cardphotoList') return
    const cols = pref.cardphotoListTemplateGridCols
    if (cols === 4 || cols === 5 || cols === 6 || cols === 7) {
      yield put(setListTemplateGridCols(cols))
    }
  } catch (e) {
    console.error('hydrateCardphotoListDensityFromDbSaga', e)
  }
}

function* persistCardphotoListDensityToDbSaga(): SagaIterator {
  try {
    const cols: 4 | 5 | 6 | 7 = yield select(
      selectCardphotoListTemplateGridCols,
    )
    const payload = {
      id: CARDPHOTO_LIST_PREF_ID,
      cardphotoListTemplateGridCols: cols,
    } as const satisfies UiPreferencesRecord
    yield call([storeAdapters.uiPreferences, 'put'] as const, payload)
  } catch (e) {
    console.error('persistCardphotoListDensityToDbSaga', e)
  }
}

function* handleCloseCardphotoCreateSaga(): SagaIterator {
  try {
    yield call(
      [storeAdapters.userImages, 'deleteById'],
      CURRENT_EDITOR_IMAGE_ID,
    )
    yield call([storeAdapters.cardphotoImages, 'clear'])
    yield put(resetCardphoto())
    yield put(setCardphotoViewEditMode(false))
    yield put(markLoaded())
    yield fork(syncToolbarContext)
  } catch (error) {
    console.error('Close cardphoto create failed:', error)
  }
}

export function* handleCloseCardphotoViewSaga(): SagaIterator {
  try {
    yield put(setCardphotoViewEditMode(false))
    yield put(setAssetData(null))
    yield put(clearCurrentConfig())
    yield fork(syncToolbarContext)
  } catch (error) {
    console.error('handleCloseCardphotoViewSaga', error)
  }
}

function* handleCancelCardphotoViewEditSaga(): SagaIterator {
  try {
    const asset: ImageMeta | null = yield select(selectActiveImage)
    yield put(setCardphotoViewEditMode(false))
    if (!asset?.id) {
      yield fork(syncToolbarContext)
      return
    }
    const record: ImageMeta | null = yield call(
      [storeAdapters.cardphotoImages, 'getById'] as const,
      asset.id,
    )
    if (record?.status === 'inLine') {
      yield put(setProcessedImage(prepareForRedux(record)))
      yield call(rebuildConfigFromMeta, record, false)
    }
    yield fork(syncToolbarContext)
  } catch (error) {
    console.error('handleCancelCardphotoViewEditSaga', error)
  }
}

export function* handleEditCardphotoViewSaga(): SagaIterator {
  try {
    const asset: ImageMeta | null = yield select(selectActiveImage)
    if (!asset || asset.status !== 'inLine') return

    yield put(setCardphotoViewEditMode(true))
    yield call(rebuildConfigFromMeta, asset, true)
    yield fork(syncToolbarContext)
  } catch (error) {
    console.error('handleEditCardphotoViewSaga', error)
  }
}

export function* handleDeleteCardphotoFromViewSaga(): SagaIterator {
  try {
    const asset: ImageMeta | null = yield select(selectActiveImage)
    yield put(setCardphotoViewEditMode(false))

    if (asset?.status === 'inLine' && asset.id) {
      yield call(
        [storeAdapters.cardphotoImages, 'deleteById'] as const,
        asset.id,
      )
      yield put(bumpCardphotoInlineTemplateList())
    }

    yield put(setAssetData(null))
    yield put(clearCurrentConfig())
    yield fork(syncToolbarContext)
  } catch (error) {
    console.error('handleDeleteCardphotoFromViewSaga', error)
  }
}

export function* watchCropChanges(): SagaIterator {
  // takeEvery (not takeLatest): takeLatest cancels mid-flight and may skip updateToolbarIcon for cropFull.
  yield takeEvery(
    commitWorkingConfig.type,
    function* (action: PayloadAction<WorkingConfig>): SagaIterator {
      // isFull must follow this exact payload (same config the reducer just applied).
      yield call(syncCropFullIcon, { customConfig: action.payload })

      const slice = (yield select((s) => s.cardphoto)) as CardphotoSliceState
      const config = slice.state?.assetConfig
      /** Не `config.image.meta`: там width/height уже под отображение на сцене; для DPI нужен оригинал из base. */
      const originalImage: ImageMeta | null = yield select(selectActiveImage)

      if (config?.crop && config?.image && originalImage) {
        const { qualityProgress } = calculateCropQuality(
          config.crop.meta,
          config.image,
          originalImage,
          config.card.orientation,
        )

        dispatchQualityUpdate(qualityProgress)

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
      section === 'cardphotoProcessed'
    ) {
      yield call(onDownloadClick)
    }
    return
  }

  if (section === 'cardphotoCreate' && (key === 'close' || key === 'delete')) {
    const isViewEdit: boolean = yield select(selectIsCardphotoViewEditMode)
    if (isViewEdit) {
      if (key === 'close') {
        yield call(handleCancelCardphotoViewEditSaga)
      } else {
        yield call(handleDeleteCardphotoFromViewSaga)
      }
      return
    }
    yield call(handleCloseCardphotoCreateSaga)
    return
  }

  if (section === 'cardphotoView') {
    switch (key) {
      case 'close':
        yield call(handleCloseCardphotoViewSaga)
        return
      case 'edit':
        yield call(handleEditCardphotoViewSaga)
        return
      case 'delete':
        yield call(handleDeleteCardphotoFromViewSaga)
        return
      default:
        return
    }
  }

  if (section === 'cardphotoList') {
    if (key === 'listDelete') {
      yield call(handleDeleteAllCardphotoInlineTemplatesSaga)
      return
    }
    if (key === 'density') {
      yield put(cycleListTemplateGridCols())
      yield call(persistCardphotoListDensityToDbSaga)
      return
    }
    return
  }

  const isCardphotoEditingSection =
    section === 'cardphoto' ||
    section === 'cardphotoProcessed' ||
    section === 'cardphotoCreate'

  if (!isCardphotoEditingSection) return

  switch (key) {
    case 'listCardphoto': {
      const isOpen: boolean = yield select(selectIsListPanelOpen)
      if (!isOpen) {
        yield call(hydrateCardphotoListDensityFromDbSaga)
      }
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

    case 'listDelete':
      yield call(handleClearAllCropsSaga)
      break

    case 'close': {
      yield call(handleDeleteImageSaga)
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

    case 'imageRotateLeft':
    case 'imageRotateRight':
      yield call(handleImageRotate, key)
      break

    case 'apply':
      yield call(handleApplyAction)
      break

    case 'listAdd': {
      if (section === 'cardphotoProcessed' || section === 'cardphotoView') {
        yield call(handlePromoteProcessedToInlineSaga)
      }
      break
    }

    default:
      break
  }
}

function pickCardphotoProcessedToolbarPatch(
  sectionUpdate: Record<string, unknown>,
): Record<string, unknown> {
  const keys = [
    'imageRotateLeft',
    'imageRotateRight',
    'crop',
    'cropFull',
    'cropCheck',
    'cropQualityIndicator',
    'imageReset',
    'close',
    'listAdd',
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
  const toolbarProcessed: CardphotoToolbarState | undefined = yield select(
    selectToolbarSectionState('cardphotoProcessed'),
  )
  const toolbarCreate: CardphotoToolbarState | undefined = yield select(
    selectToolbarSectionState('cardphotoCreate'),
  )

  if (!state) return
  if (
    toolbarCardphoto?.crop?.state === 'active' ||
    toolbarProcessed?.crop?.state === 'active' ||
    toolbarCreate?.crop?.state === 'active'
  )
    return

  const assetForToolbar = state.assetData
  const appliedForToolbar = state.appliedData
  let toolbarAssetKind: ToolbarAssetKind = 'none'
  if (!assetForToolbar) {
    toolbarAssetKind = 'none'
  } else if (
    assetForToolbar.id &&
    appliedForToolbar?.id &&
    assetForToolbar.id === appliedForToolbar.id
  ) {
    toolbarAssetKind = 'apply'
  } else if (assetForToolbar.source === 'original') {
    toolbarAssetKind = 'user'
  } else if (assetForToolbar.status === 'processed') {
    toolbarAssetKind = 'processed'
  } else if (assetForToolbar.source === 'user') {
    toolbarAssetKind = 'user'
  } else if (assetForToolbar.source === 'stock') {
    toolbarAssetKind = 'stock'
  }
  const badgeCount =
    (toolbarCardphoto as any)?.listCardphoto?.options?.badge ?? null
  const hasTemplates = typeof badgeCount === 'number' ? badgeCount > 0 : false

  let sectionUpdate = {}
  const assetId = state.assetData?.id ?? null
  const appliedId = state.appliedData?.id ?? null
  const isCurrentApplied = !!assetId && !!appliedId && assetId === appliedId
  const isOriginalUpload = state.assetData?.source === 'original'
  const applyState = isOriginalUpload
    ? 'disabled'
    : !assetId
      ? 'disabled'
      : isCurrentApplied
        ? 'active'
        : 'enabled'
  const isUserImage = !!state.userOriginalData
  const hasStockImage = false
  const hasProcessedImage = state.assetData?.status === 'processed'
  const isProcessedInLine = state.assetData?.status === 'inLine'
  switch (toolbarAssetKind) {
    case 'none':
      sectionUpdate = {
        imageRotateLeft: { state: 'disabled' },
        imageRotateRight: { state: 'disabled' },
        crop: { state: 'disabled' },
        cropFull: { state: 'disabled' },
        cropCheck: { state: 'disabled' },
        cropQualityIndicator: { state: 'disabled' },
        imageReset: { state: 'disabled' },

        apply: { state: applyState },
        close: { state: 'disabled' },
        download: { state: 'enabled' },
        cardphotoAdd: { state: 'enabled' },
        saveList: { state: hasTemplates ? 'enabled' : 'disabled' },
        listDelete: { state: hasTemplates ? 'enabled' : 'disabled' },
      }
      break

    case 'apply':
      sectionUpdate = {
        imageRotateLeft: { state: 'disabled' },
        imageRotateRight: { state: 'disabled' },
        crop: { state: 'disabled' },
        cropFull: { state: 'disabled' },
        cropCheck: { state: 'disabled' },
        cropQualityIndicator: { state: 'disabled' },
        imageReset: { state: 'enabled' },

        apply: { state: applyState },
        close: { state: 'enabled' },
        download: { state: 'enabled' },
        cardphotoAdd: { state: 'enabled' },
        saveList: { state: hasTemplates ? 'enabled' : 'disabled' },
        listDelete: { state: hasTemplates ? 'enabled' : 'disabled' },
      }
      break

    case 'processed':
      sectionUpdate = {
        imageRotateLeft: { state: 'disabled' },
        imageRotateRight: { state: 'disabled' },
        crop: { state: 'disabled' },
        cropFull: { state: 'disabled' },
        cropCheck: { state: 'disabled' },
        cropQualityIndicator: { state: 'disabled' },
        imageReset: { state: 'enabled' },

        apply: { state: applyState },
        close: { state: 'enabled' },
        download: { state: 'enabled' },
        cardphotoAdd: { state: 'enabled' },
        saveList: { state: hasTemplates ? 'enabled' : 'disabled' },
        listDelete: { state: hasTemplates ? 'enabled' : 'disabled' },
        listAdd: {
          state:
            hasProcessedImage && !isProcessedInLine ? 'enabled' : 'disabled',
        },
      }
      break

    case 'user':
      sectionUpdate = {
        imageRotateLeft: { state: 'enabled' },
        imageRotateRight: { state: 'enabled' },
        crop: { state: 'enabled' },
        cropFull: { state: 'disabled' },
        cropCheck: { state: 'disabled' },
        cropQualityIndicator: { state: 'disabled' },
        imageReset: { state: 'enabled' },

        apply: { state: applyState },
        close: { state: 'enabled' },
        download: { state: 'enabled' },
        cardphotoAdd: { state: 'enabled' },
        saveList: { state: hasTemplates ? 'enabled' : 'disabled' },
        listDelete: { state: hasTemplates ? 'enabled' : 'disabled' },
      }
      break

    case 'stock':
      sectionUpdate = {
        imageRotateLeft: { state: 'disabled' },
        imageRotateRight: { state: 'disabled' },
        crop: { state: 'disabled' },
        cropFull: { state: 'disabled' },
        cropCheck: { state: 'disabled' },
        cropQualityIndicator: { state: 'disabled' },
        imageReset: { state: isUserImage ? 'enabled' : 'disabled' },

        apply: { state: applyState },
        close: { state: 'disabled' },
        download: { state: 'enabled' },
        cardphotoAdd: { state: 'enabled' },
        saveList: { state: hasTemplates ? 'enabled' : 'disabled' },
        listDelete: { state: hasTemplates ? 'enabled' : 'disabled' },
      }
      break

    default:
      sectionUpdate = {
        imageRotateLeft: { state: 'disabled' },
        imageRotateRight: { state: 'disabled' },
        crop: { state: 'disabled' },
        cropFull: { state: 'disabled' },
        cropCheck: { state: 'disabled' },
        cropQualityIndicator: { state: 'disabled' },
        imageReset: { state: 'disabled' },
        apply: { state: 'disabled' },
        close: { state: 'disabled' },
        download: { state: 'enabled' },
        cardphotoAdd: { state: 'enabled' },
        saveList: { state: hasTemplates ? 'enabled' : 'disabled' },
        listDelete: { state: hasTemplates ? 'enabled' : 'disabled' },
      }
      break
  }

  yield put(
    updateToolbarSection({
      section: 'cardphoto',
      value: sectionUpdate,
    }),
  )

  const cropToolbarPatch = pickCardphotoProcessedToolbarPatch(
    sectionUpdate as Record<string, unknown>,
  )
  const su = sectionUpdate as {
    cardphotoAdd?: { state: string }
    close?: { state: string }
  }

  yield put(
    updateToolbarSection({
      section: 'cardphotoCreate',
      value: {
        ...cropToolbarPatch,
        ...(su.cardphotoAdd != null ? { cardphotoAdd: su.cardphotoAdd } : {}),
        ...(su.close != null ? { delete: su.close } : {}),
      },
    }),
  )

  yield put(
    updateToolbarSection({
      section: 'cardphotoProcessed',
      value: {
        ...cropToolbarPatch,
        ...(su.close != null ? { delete: su.close } : {}),
      },
    }),
  )

  const img = state.assetData
  const isInLineTemplate = img?.status === 'inLine'
  const listAddViewState =
    img?.status === 'processed' && !isInLineTemplate ? 'enabled' : 'disabled'
  const templateActionState = isInLineTemplate ? 'enabled' : 'disabled'

  yield put(
    updateToolbarSection({
      section: 'cardphotoView',
      value: {
        listAdd: { state: listAddViewState },
        edit: { state: templateActionState },
      },
    }),
  )
}

const selectCurrentProcessedUrl = (state: RootState) =>
  state.cardphoto.state?.assetData?.status === 'processed'
    ? state.cardphoto.state?.assetData?.url
    : undefined

export function* onSelectCropFromHistorySaga(action: PayloadAction<string>) {
  try {
    const cropId = action.payload

    const oldUrl: string | undefined = yield select(selectCurrentProcessedUrl)

    const cropRecord: ImageMeta | null = yield call(
      [storeAdapters.cardphotoImages, storeAdapters.cardphotoImages.getById],
      cropId,
    )

    if (cropRecord) {
      const currentUrl = cropRecord.full?.blob
        ? URL.createObjectURL(cropRecord.full.blob)
        : cropRecord.url

      const serializable = prepareForRedux({
        ...cropRecord,
        url: currentUrl,
      })

      yield put(setProcessedImage(serializable))
      yield call(rebuildConfigFromMeta, serializable, false)

      const rootAfter: RootState = yield select((s: RootState) => s)
      const stillReferenced = collectReferencedBlobUrls({
        cardphoto: rootAfter.cardphoto.state,
        cards: rootAfter.card.cards,
        cartItems: rootAfter.cart.items,
        assetRegistryImages: rootAfter.assetRegistry.images,
        calendarPreviewCache: rootAfter.card.calendarPreviewCache,
      })
      if (oldUrl?.startsWith('blob:') && !stillReferenced.has(oldUrl)) {
        URL.revokeObjectURL(oldUrl)
      }
    }
  } catch (error) {
    console.error('Select crop history error:', error)
  }
}

export function* watchToolbarContext() {
  yield takeEvery(
    [
      hydrateEditor.type,
      applyFinal.type,
      clearApply.type,
      commitWorkingConfig.type,
      resetCardphoto.type,
      setProcessedImage.type,
      markLoaded.type,
      markLoading.type,
    ],
    syncToolbarContext,
  )
}
