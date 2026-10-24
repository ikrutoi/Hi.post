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
  setCardphotoViewEditMode,
  closeCardphotoViewRequested,
  editCardphotoViewRequested,
  deleteCardphotoFromViewRequested,
  openCardphotoFromMiniStripRequested,
  removeUserImage,
  clearCardphotoViewReturnSnapshot,
  clearSessionPendingProcessedId,
  setOriginalUploadReminderActive,
  setCardphotoViewReturnSnapshot,
  clearUserOriginalDraftConfig,
} from '@cardphoto/infrastructure/state'
import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import { prepareForRedux, prepareConfigForRedux, hydrateMeta } from './cardphotoHelpers'
import type { PostcardHydrated } from '@entities/postcard'
import {
  commitArchiveCartCardphoto,
  readArchiveCartApplyPostcard,
} from './archiveCartApplyTarget'
import {
  selectCardphotoAssetToolbar,
  selectCardphotoState,
  selectCardphotoWorkingCardLayer,
  selectCardphotoImageStageRect,
} from '@cardphoto/infrastructure/selectors'
import {
  validateImageSize,
  shouldSyncUserOriginalForState,
  persistUserOriginalRotationToIdbSaga,
} from '@cardphoto/application/helpers'
import { syncCardphotoListBadgeFromIdb } from './cardphotoListBadgeSaga'
import { openCardphotoFromMiniStripSaga } from '@cardphoto/application/helpers/openCardphotoFromMiniStrip'
import { isCardphotoFilePickerRegistered } from '@cardphoto/application/helpers/cardphotoFilePickerBridge'
import { setSizeCard } from '@layout/infrastructure/state'
import { roundTo } from '@shared/utils/layout'
import {
  updateToolbarSection,
  updateToolbarIcon,
} from '@toolbar/infrastructure/state'
import { selectToolbarSectionState } from '@toolbar/infrastructure/selectors'
import { updateGroupStatus } from '@toolbar/infrastructure/state'
import {
  fitImageToCard,
  createInitialCropLayer,
} from '@cardphoto/application/utils/imageFit'
import { updateCropToolbarState } from './cardphotoHelpers'
import {
  handleCardphotoToolbarAction,
  handleCloseCardphotoViewSaga,
  handleEditCardphotoViewSaga,
  handleDeleteCardphotoFromViewSaga,
  watchCropChanges,
  // watchCropToolbarStatus,
  // watchCropHistory,
  watchToolbarContext,
  watchDeactivateCropOnEditorContextLeave,
  syncCardphotoAddToolbarState,
  syncToolbarContext,
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
import type { RootState } from '@app/state'
import { collectReferencedBlobUrls } from './blobUrlRevokeGuards'
import { selectIsCardphotoViewEditMode } from '@cardphoto/infrastructure/selectors/cardphotoUiSelectors'

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
  yield put(
    updateToolbarIcon({
      section: 'cardphotoCreate',
      key: 'applyMedium',
      value: 'disabled',
    }),
  )

  if (!isCardphotoFilePickerRegistered()) {
    yield put(markLoaded())
    return
  }

  yield put(markLoading())

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

function collectImageBlobUrls(meta: ImageMeta | null | undefined): string[] {
  if (!meta) return []
  return [meta.url, meta.thumbnail?.url, meta.full?.url].filter(
    (url): url is string => typeof url === 'string' && url.startsWith('blob:'),
  )
}

function* onUploadImageReadySaga(action: PayloadAction<ImageMeta>) {
  try {
    const stateBefore: CardphotoState | null = yield select(selectCardphotoState)
    const assetToolbarBefore: ReturnType<typeof selectCardphotoAssetToolbar> =
      yield select(selectCardphotoAssetToolbar)
    const isViewEdit: boolean = yield select(selectIsCardphotoViewEditMode)
    if (
      (assetToolbarBefore === 'cardphotoView' || isViewEdit) &&
      stateBefore?.assetData &&
      stateBefore?.assetConfig
    ) {
      yield put(
        setCardphotoViewReturnSnapshot({
          assetData: prepareForRedux(stateBefore.assetData),
          assetConfig: prepareConfigForRedux(stateBefore.assetConfig),
        }),
      )
    }

    yield put(setOriginalUploadReminderActive(false))
    yield put(clearSessionPendingProcessedId())
    yield put(clearUserOriginalDraftConfig())

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

    const state: CardphotoState = yield select(selectCardphotoState)
    const isComplete = !!state.appliedData
    /**
     * Fit without writing Redux. `commitWorkingConfig` ahead of the new
     * asset paints the View picture in the new image's box.
     */
    const config: WorkingConfig | null = yield call(
      buildWorkingConfigFromMeta,
      imageMeta,
    )
    if (!config) return

    const previousRecord: ImageRecord | null = yield call(
      [storeAdapters.userImages, 'getById'],
      CURRENT_EDITOR_IMAGE_ID,
    )
    const replacedBlobUrls = [
      ...collectImageBlobUrls(previousRecord?.image),
      ...collectImageBlobUrls(stateBefore?.userOriginalData),
    ]
    if (previousRecord || stateBefore?.userOriginalData) {
      yield call(
        [storeAdapters.userImages, 'deleteById'],
        CURRENT_EDITOR_IMAGE_ID,
      )
    }
    if (isViewEdit) {
      yield put(setCardphotoViewEditMode(false))
    }

    yield put(
      setAsset({
        id: imageMeta.id,
        url: imageMeta.url,
        thumbUrl: imageMeta.thumbnail?.url || imageMeta.url,
      }),
    )

    /** Persist blob first — reopen from Dot depends on IDB `full.blob`. */
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

    const rootAfter: RootState = yield select((s: RootState) => s)
    const stillReferenced = collectReferencedBlobUrls({
      cardphoto: rootAfter.cardphoto.state,
      cards: rootAfter.card.cards,
      cartItems: rootAfter.cart.items,
      assetRegistryImages: rootAfter.assetRegistry.images,
      calendarPreviewCache: rootAfter.card.calendarPreviewCache,
      assemblyFreeze: rootAfter.assemblyBranchFreeze.freeze,
    })
    for (const url of replacedBlobUrls) {
      if (!stillReferenced.has(url)) URL.revokeObjectURL(url)
    }

    yield call(
      persistUserOriginalRotationToIdbSaga,
      serializableMeta.rotation ?? 0,
    )
    yield fork(persistGlobalSession)
  } catch (error) {
    console.error('Error in onUploadImageReadySaga:', error)
  } finally {
    yield put(markLoaded())
  }

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
  yield call(syncCardphotoAddToolbarState)

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

/** Fit + crop layers only — does not write Redux (avoids a View/create paint flash). */
export function* buildWorkingConfigFromMeta(
  meta: ImageMeta,
  rotation?: number,
): SagaIterator<WorkingConfig | null> {
  try {
    const newRotation = rotation ?? meta.rotation ?? 0
    const updatedCard: CardLayer = yield select(selectCardphotoWorkingCardLayer)
    const imageLayer = fitImageToCard(
      meta,
      updatedCard,
      newRotation,
      meta.isCropped ?? false,
    )
    const cropLayer = createInitialCropLayer(imageLayer, updatedCard, meta)

    return {
      card: updatedCard,
      image: imageLayer,
      crop: cropLayer,
    }
  } catch {
    return null
  }
}

export function* rebuildConfigFromMeta(
  meta: ImageMeta,
  syncUserOriginal: boolean,
  forceOrientation?: LayoutOrientation,
  rotation?: number,
) {
  try {
    void forceOrientation

    const newConfig: WorkingConfig | null = yield call(
      buildWorkingConfigFromMeta,
      meta,
      rotation,
    )
    if (!newConfig) return null

    if (syncUserOriginal) {
      const nextRotation = rotation ?? meta.rotation ?? 0
      const newOriginalMeta = {
        ...meta,
        rotation: nextRotation,
      }

      const serializableMeta = prepareForRedux(newOriginalMeta)

      yield put(setUserOriginalData(serializableMeta))
      yield call(persistUserOriginalRotationToIdbSaga, nextRotation)
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

    const hydrated = hydrateMeta(record)
    if (!hydrated) return

    /** Crop left on from edit mode keeps Apply disabled on the template View. */
    const cropSections = [
      'cardphotoCreate',
      'cardphoto',
      'cardphotoProcessed',
    ] as const
    for (const section of cropSections) {
      const toolbarState: CardphotoToolbarState | undefined = yield select(
        selectToolbarSectionState(section),
      )
      if (toolbarState?.crop?.state === 'active') {
        yield call(updateCropToolbarState, 'enabled', toolbarState)
        break
      }
    }

    const cardphotoState: CardphotoState | null = yield select(
      selectCardphotoState,
    )

    yield put(setCardphotoViewEditMode(false))
    yield put(clearCardphotoViewReturnSnapshot())
    const serializable = prepareForRedux(hydrated)
    yield put(setProcessedImage(serializable))
    yield put(
      setAsset({
        id: serializable.id,
        url: serializable.url,
        thumbUrl: serializable.thumbnail?.url || serializable.url,
      }),
    )

    yield call(rebuildConfigFromMeta, hydrated, false)

    const archivePostcard: PostcardHydrated | null = yield call(
      readArchiveCartApplyPostcard,
    )
    if (archivePostcard != null) {
      yield call(commitArchiveCartCardphoto, archivePostcard, serializable)
    }

    if (cardphotoState?.userOriginalData) {
      yield put(clearSessionPendingProcessedId())
      yield put(setOriginalUploadReminderActive(true))
    }

    yield call(syncToolbarContext)
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
    yield call(syncCardphotoListBadgeFromIdb)
  } catch (e) {
    console.error('refreshCardphotoListCardphotoBadge', e)
  }
}

function* watchCardphotoInLineBadge(): SagaIterator {
  /**
   * getAll reads full photo blobs and can outlive the next unstar.
   * takeLatest drops that stale count so the badge matches the list.
   */
  yield takeLatest(
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

function* watchCardphotoAddToolbarState(): SagaIterator {
  yield takeEvery([resetCardphoto.type, removeUserImage.type], function* () {
    yield put(clearSessionPendingProcessedId())
    yield put(setOriginalUploadReminderActive(false))
    yield call(syncCardphotoAddToolbarState)
  })
}

export function* cardphotoProcessSaga(): SagaIterator {
  yield all([
    takeEvery(toolbarAction.type, function* (action: ReturnType<typeof toolbarAction>) {
      if (action.payload.key !== 'cardphotoAdd') return
      yield call(handleCardphotoToolbarAction, action)
    }),
    takeLatest(toolbarAction.type, function* (action: ReturnType<typeof toolbarAction>) {
      if (action.payload.key === 'cardphotoAdd') return
      yield call(handleCardphotoToolbarAction, action)
    }),
    takeLatest(selectInLineTemplate.type, onSelectInLineTemplateSaga),
    takeEvery(closeCardphotoViewRequested.type, function* (): SagaIterator {
      yield call(handleCloseCardphotoViewSaga)
    }),
    takeEvery(editCardphotoViewRequested.type, function* (): SagaIterator {
      yield call(handleEditCardphotoViewSaga)
    }),
    takeEvery(deleteCardphotoFromViewRequested.type, function* (): SagaIterator {
      yield call(handleDeleteCardphotoFromViewSaga)
      yield call(refreshCardphotoListCardphotoBadge)
    }),
    takeEvery(openCardphotoFromMiniStripRequested.type, openCardphotoFromMiniStripSaga),
    takeEvery(resetCardphoto.type, function* (): SagaIterator {
      yield put(setCardphotoViewEditMode(false))
    }),
    takeEvery(clearApply.type, onClearApplySaga),

    fork(watchCropChanges),
    fork(watchToolbarContext),
    fork(watchDeactivateCropOnEditorContextLeave),
    fork(watchCardphotoImageStageRect),
    fork(watchCardphotoInLineBadge),
    fork(watchCardphotoAddToolbarState),
    takeEvery(commitWorkingConfig.type, ensureCardphotoCardMatchesStageRect),

    takeLatest(uploadUserImage.type, onUploadImageReadySaga),
    takeEvery(cancelFileDialog.type, onCancelFileDialog),
  ])
}
