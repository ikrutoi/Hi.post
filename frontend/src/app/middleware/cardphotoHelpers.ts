import { call, put, select } from 'redux-saga/effects'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import type {
  CardphotoToolbarState,
  SectionEditorMenuKey,
} from '@toolbar/domain/types'
import type {
  ImageMeta,
  WorkingConfig,
  ImageSource,
  CardphotoSessionRecord,
} from '@cardphoto/domain/types'
import { getRandomStockMeta } from './cardphotoHistorySaga'
import { rebuildConfigFromMeta } from './cardphotoProcessSaga'
import { ImageAsset } from '@/entities/assetRegistry/domain/types'
import { setAssets } from '@/entities/assetRegistry/infrastructure/state'

interface UpdateCropOptions {
  isFull?: boolean
}

const CARDPHOTO_TOOLBAR_SECTIONS = [
  'cardphoto',
  'cardphotoProcessed',
  'cardphotoCreate',
] as const

export function* updateCropToolbarState(
  newCrop: 'active' | 'enabled',
  state: CardphotoToolbarState,
  options: UpdateCropOptions = {},
) {
  const { isFull = false } = options

  const newCropFull =
    newCrop === 'active' ? (isFull ? 'disabled' : 'enabled') : 'disabled'

  const newCropQualityIndicator =
    newCrop === 'active' ? 'enabled' : 'disabled'

  const newCropCheck =
    newCrop === 'active'
      ? 'enabled'
      : state.cropCheck?.state === 'enabled'
        ? 'disabled'
        : (state.cropCheck?.state ?? 'disabled')

  const newClose = newCrop === 'active' ? 'disabled' : 'enabled'

  for (const section of CARDPHOTO_TOOLBAR_SECTIONS) {
    yield put(
      updateToolbarIcon({ section, key: 'crop', value: newCrop }),
    )
    yield put(
      updateToolbarIcon({
        section,
        key: 'cropFull',
        value: newCropFull,
      }),
    )
    yield put(
      updateToolbarIcon({
        section,
        key: 'cropQualityIndicator',
        value: newCropQualityIndicator,
      }),
    )
    yield put(
      updateToolbarIcon({
        section,
        key: 'cropCheck',
        value: newCropCheck,
      }),
    )
    yield put(
      updateToolbarIcon({
        section,
        key: 'close',
        value: newClose,
      }),
    )
    if (section === 'cardphotoCreate' || section === 'cardphotoProcessed') {
      yield put(
        updateToolbarIcon({
          section,
          key: 'delete',
          value: newClose,
        }),
      )
    }
  }

  if (state.save) {
    const newSave =
      newCrop === 'active'
        ? 'disabled'
        : state.save.state === 'disabled'
          ? 'enabled'
          : state.save.state

    yield put(
      updateToolbarIcon({ section: 'cardphoto', key: 'save', value: newSave }),
    )
  }

  const newSaveList = newCrop === 'active' ? 'disabled' : 'enabled'

  yield put(
    updateToolbarIcon({
      section: 'cardphoto',
      key: 'saveList',
      value: newSaveList,
    }),
  )

  yield put(
    updateToolbarIcon({
      section: 'cardphoto',
      key: 'closeList',
      value: newSaveList,
    }),
  )
}

/** Убирает Blob/File из meta для Redux (serializable middleware). */
export const prepareForRedux = (meta: ImageMeta): ImageMeta => {
  const { blob: _fullBlob, ...fullRest } = meta.full
  const thumbnail = meta.thumbnail
    ? (({ blob: _tb, ...tr }) => tr)(meta.thumbnail)
    : undefined

  return {
    ...meta,
    full: fullRest as ImageMeta['full'],
    thumbnail: thumbnail as ImageMeta['thumbnail'],
  }
}

export const prepareConfigForRedux = (
  config: WorkingConfig,
): WorkingConfig => ({
  ...config,
  image: {
    ...config.image,
    meta: prepareForRedux(config.image.meta),
  },
})

export const hydrateMeta = (meta: ImageMeta | null): ImageMeta | null => {
  if (!meta) return null

  const blob = meta.full?.blob || (meta as any).blob

  const activeUrl = blob instanceof Blob ? URL.createObjectURL(blob) : meta.url

  return {
    ...meta,
    url: activeUrl,
    full: {
      ...meta.full,
      url: activeUrl,
      blob: undefined,
    },
    thumbnail: meta.thumbnail
      ? {
          ...meta.thumbnail,
          url: meta.thumbnail.blob
            ? URL.createObjectURL(meta.thumbnail.blob)
            : meta.thumbnail.url || '',
          blob: undefined,
        }
      : undefined,
  }
}

export function* fuelAssetRegistry(
  core: {
    user: ImageMeta | null
    applied: ImageMeta | null
    processed: ImageMeta | null
    stock: ImageMeta | null
  },
  allCrops: ImageMeta[],
) {
  const assets: ImageAsset[] = []

  const processMeta = (meta: ImageMeta | null) => {
    if (!meta) return
    const url = meta.full?.blob ? URL.createObjectURL(meta.full.blob) : meta.url
    const thumbUrl = meta.thumbnail?.blob
      ? URL.createObjectURL(meta.thumbnail.blob)
      : meta.thumbnail?.url || ''
    assets.push({ id: meta.id, url, thumbUrl })
  }

  processMeta(core.stock)
  processMeta(core.user)
  processMeta(core.applied)
  processMeta(core.processed)

  allCrops.forEach(processMeta)

  if (assets.length > 0) {
    yield put(setAssets(assets))
  }
}
