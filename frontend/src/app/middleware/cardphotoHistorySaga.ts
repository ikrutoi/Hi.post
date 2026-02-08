import { put, select, call, takeLatest } from 'redux-saga/effects'
import {
  // initStockImage,
  initCardphoto,
  hydrateEditor,
  // addOperation,
  type CardphotoSliceState,
} from '@cardphoto/infrastructure/state'
import { storeAdapters } from '@db/adapters/storeAdapters'
import {
  selectCardphotoState,
  selectCurrentConfig,
  selectActiveSource,
} from '@cardphoto/infrastructure/selectors'
import { selectSizeCard } from '@layout/infrastructure/selectors'
import { STOCK_IMAGES } from '@shared/assets/stock'
import { createWorkingConfig } from './utils'
import { prepareForRedux } from './cardphotoHelpers'
import { rebuildConfigFromMeta } from './cardphotoProcessSaga'
import {
  fitImageToCard,
  // createInitialCropLayer,
} from '@cardphoto/application/utils/imageFit'
import type {
  ImageMeta,
  CardphotoState,
  CardphotoOperation,
  WorkingConfig,
  CardLayer,
  CardphotoBase,
  ImageSource,
} from '@cardphoto/domain/types'
import type { SizeCard } from '@layout/domain/types'

export function getRandomStockMeta(): ImageMeta {
  const index = Math.floor(Math.random() * STOCK_IMAGES.length)
  return STOCK_IMAGES[index]
}

function* initCardphotoSaga() {
  const state: CardphotoState = yield select(selectCardphotoState)
  const activeSource = state.activeSource
  const allCrops: ImageMeta[] = yield call(storeAdapters.cropImages.getAll)
  const cropCount = allCrops.length
  const cropIds = allCrops.map((c) => c.id)
  const savedUserImg: ImageMeta | null = yield call(
    storeAdapters.userImages.getById,
    'current',
  )

  if (!activeSource) return
  // if (state.operations.length > 1) return

  console.log('>>>INIT_CARDPHOTO base-0', state)

  const base: CardphotoBase = {
    ...state.base,
    stock: { image: yield call(getRandomStockMeta) },
    user: { image: null },
    processed: { image: null },
  }
  // console.log('>>>INIT_CARDPHOTO base-1', base)

  if (!base.stock.image) return

  // let activeSource: ImageSource = 'stock'
  const initialImageMeta: ImageMeta | null = activeSource
    ? base[activeSource].image
    : base.stock.image

  if (!initialImageMeta) return

  // if (savedUserImg && savedUserImg.full.blob) {
  //   savedUserImg.url = URL.createObjectURL(savedUserImg.full.blob)
  //   base.user.image = prepareForRedux(savedUserImg)

  //   initialImageMeta = base.user.image
  //   activeSource = 'user'
  // }

  // if (cropCount > 0) {
  //   const lastCrop = allCrops[cropCount - 1]

  //   const fullUrl = lastCrop.full?.blob
  //     ? URL.createObjectURL(lastCrop.full.blob)
  //     : lastCrop.url
  //   const thumbUrl = lastCrop.thumbnail?.blob
  //     ? URL.createObjectURL(lastCrop.thumbnail.blob)
  //     : ''

  //   const serializableMeta: ImageMeta = {
  //     ...lastCrop,
  //     url: fullUrl,
  //     full: {
  //       ...lastCrop.full,
  //       blob: undefined,
  //       url: fullUrl,
  //     },
  //     thumbnail: lastCrop.thumbnail
  //       ? { ...lastCrop.thumbnail, blob: undefined, url: thumbUrl }
  //       : undefined,
  //   }

  //   base.processed.image = serializableMeta
  // }

  // const sizeCard: SizeCard = yield select(selectSizeCard)

  // console.log('>>>INIT_CARDPHOTO source', activeSource)
  // const config: WorkingConfig = yield call(
  //   rebuildConfigFromMeta,
  //   initialImageMeta,
  //   activeSource,
  //   sizeCard.orientation,
  // )

  console.log('>>>INIT_CARDPHOTO source>>> HYDRATE source', activeSource)
  yield put(
    hydrateEditor({
      base,
      config,
      activeSource,
      cropIds,
      cropCount,
    }),
  )
}

export function* cardphotoHistorySaga() {
  yield takeLatest(initCardphoto.type, initCardphotoSaga)
}
