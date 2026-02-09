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
  CardphotoBase,
} from '@cardphoto/domain/types'
import { SizeCard } from '@/features/layout/domain/types'
import { selectSizeCard } from '@/features/layout/infrastructure/selectors'
import { getRandomStockMeta } from './cardphotoHistorySaga'
import { rebuildConfigFromMeta } from './cardphotoProcessSaga'

interface UpdateCropOptions {
  isFull?: boolean
}

export function* updateCropToolbarState(
  newCrop: 'active' | 'enabled',
  state: CardphotoToolbarState,
  options: UpdateCropOptions = {},
) {
  console.log('updateCropToolbar +++', newCrop, state)
  yield put(
    updateToolbarIcon({ section: 'cardphoto', key: 'crop', value: newCrop }),
  )

  const newSave =
    newCrop === 'active'
      ? 'disabled'
      : state.save.state === 'disabled'
        ? 'enabled'
        : state.save.state

  yield put(
    updateToolbarIcon({ section: 'cardphoto', key: 'save', value: newSave }),
  )

  const { isFull = false } = options

  const newCropFull =
    newCrop === 'active' ? (isFull ? 'disabled' : 'enabled') : 'disabled'

  yield put(
    updateToolbarIcon({
      section: 'cardphoto',
      key: 'cropFull',
      value: newCropFull,
    }),
  )

  const newCropCheck =
    newCrop === 'active'
      ? 'enabled'
      : state.cropCheck.state === 'enabled'
        ? 'disabled'
        : state.cropCheck.state

  yield put(
    updateToolbarIcon({
      section: 'cardphoto',
      key: 'cropCheck',
      value: newCropCheck,
    }),
  )

  const newClose = newCrop === 'active' ? 'disabled' : 'enabled'

  yield put(
    updateToolbarIcon({
      section: 'cardphoto',
      key: 'close',
      value: newClose,
    }),
  )

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

export const prepareForRedux = (meta: ImageMeta): ImageMeta => ({
  ...meta,
  full: { ...meta.full, blob: undefined },
  thumbnail: meta.thumbnail
    ? { ...meta.thumbnail, blob: undefined }
    : undefined,
})

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

// export function* prepareCardphotoHydration(
//   raw: {
//     stock?: ImageMeta | null
//     user?: ImageMeta | null
//     processed?: ImageMeta | null
//     apply?: ImageMeta | null
//   },
//   source: ImageSource,
//   savedConfig?: WorkingConfig | null,
//   cropIds: string[] = [],
// ) {
//   const sizeCard: SizeCard = yield select(selectSizeCard)

//   const base: CardphotoBase = {
//     stock: { image: hydrateMeta(raw.stock || null) },
//     user: { image: hydrateMeta(raw.user || null) },
//     processed: { image: hydrateMeta(raw.processed || null) },
//     apply: { image: hydrateMeta(raw.apply || null) },
//   }

//   let activeImage = base[source]?.image || base.stock.image

//   if (!activeImage) {
//     const emergencyRaw: ImageMeta = yield call(getRandomStockMeta)
//     activeImage = hydrateMeta(emergencyRaw)
//     if (activeImage) base.stock.image = activeImage
//   }

//   if (!activeImage) return null

//   let config: WorkingConfig
//   if (source === 'user' && savedConfig) {
//     config = {
//       ...savedConfig,
//       image: { ...savedConfig.image, meta: activeImage },
//     }
//   } else {
//     config = yield call(
//       rebuildConfigFromMeta,
//       activeImage,
//       source,
//       sizeCard.orientation,
//     )
//   }

//   return {
//     base,
//     config,
//     activeSource: source,
//     cropIds,
//     cropCount: cropIds.length,
//   }
// }
