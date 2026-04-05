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

const isDeadBlobUrl = (u: string | null | undefined): boolean =>
  typeof u === 'string' && u.startsWith('blob:')

/**
 * Восстанавливает meta после перезагрузки: в сессии в IndexedDB часто лежат только строки
 * `blob:...` без Blob — после reload они невалидны (net::ERR_FILE_NOT_FOUND).
 */
export const hydrateMeta = (meta: ImageMeta | null): ImageMeta | null => {
  if (!meta) return null

  const blob = meta.full?.blob || (meta as any).blob

  let activeUrl: string
  if (blob instanceof Blob) {
    activeUrl = URL.createObjectURL(blob)
  } else if (isDeadBlobUrl(meta.url)) {
    return null
  } else {
    activeUrl = meta.url
  }

  let thumbUrl: string
  if (meta.thumbnail?.blob instanceof Blob) {
    thumbUrl = URL.createObjectURL(meta.thumbnail.blob)
  } else if (isDeadBlobUrl(meta.thumbnail?.url)) {
    thumbUrl = ''
  } else {
    thumbUrl = meta.thumbnail?.url || ''
  }

  if (!String(activeUrl).trim() && !String(thumbUrl).trim()) return null

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
          url: thumbUrl,
          blob: undefined,
        }
      : undefined,
  }
}

/**
 * Слияние meta из сессии (без Blob, возможны мёртвые blob:-строки) и записи из IDB с бинарными данными.
 */
export const hydrateSessionImageMeta = (
  persisted: ImageMeta | null | undefined,
  fromIdb: ImageMeta | null | undefined,
): ImageMeta | null => {
  if (fromIdb && persisted?.id && fromIdb.id === persisted.id) {
    return hydrateMeta(fromIdb)
  }
  return hydrateMeta(persisted ?? null) ?? hydrateMeta(fromIdb ?? null)
}

export type IdbImageMetaSources = {
  cropOrProcessed: ImageMeta | null
  apply: ImageMeta | null
  user: ImageMeta | null
  stock: ImageMeta | null
}

/** Meta в IndexedDB по id: кропы в cardphotoImages, apply/user/stock — в своих таблицах. */
export function findIdbImageMetaById(
  id: string | null | undefined,
  src: IdbImageMetaSources,
): ImageMeta | null {
  if (!id) return null
  if (src.cropOrProcessed?.id === id) return src.cropOrProcessed
  if (src.apply?.id === id) return src.apply
  if (src.user?.id === id) return src.user
  if (src.stock?.id === id) return src.stock
  return null
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
    const hydrated = hydrateMeta(meta)
    if (!hydrated) return
    const url = hydrated.url
    const thumbUrl = hydrated.thumbnail?.url || hydrated.url
    assets.push({ id: hydrated.id, url, thumbUrl })
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
