import { createStoreAdapter } from '@db/publicApi'
import { StoreMap } from '@db/publicApi'
// import { getHiPostImage, getUserImage, addHiPostImage } from '@shared/indexDb'
import { ImageMeta } from '@features/cardphotoLegacy/types'
import coverImage from '@shared/assets/card-photo-bw.jpg'
import { checkIndexDb } from './checkIndexDb'

const stockImagesAdapter =
  createStoreAdapter<StoreMap['stockImages']>('stockImages')

const userImagesAdapter =
  createStoreAdapter<StoreMap['userImages']>('userImages')

export const fetchImageFromIndexedDb = async (
  startImage: ImageMeta,
  setImage: (img: ImageMeta) => void,
  dispatch: any
) => {
  const stockImages = await stockImagesAdapter.getAll()
  const userImages = await userImagesAdapter.getAll()
  const getFn = {
    stockImages,
    userImages,
  }[startImage.base]

  if (!getFn) return

  const blob = await getFn(startImage.source)
  if (!blob) return

  const url = URL.createObjectURL(blob)
  setImage({ ...startImage, url })
  await checkIndexDb(dispatch)
}

export const fetchInitialImage = async (
  setImage: (img: ImageMeta) => void,
  dispatch: any
) => {
  const response = await fetch(coverImage)
  const blob = await response.blob()

  setImage({
    base: 'stockImages',
    source: 'originalImage',
    url: coverImage,
  })

  await stockImagesAdapter.addRecordWithId('originalImage', { image: blob })
  await checkIndexDb(dispatch)
}
