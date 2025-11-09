import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { CardItem } from '@entities/card/domain/types'
import type { IndexedImage } from '@cardphoto/domain/types'

export async function getResultCardphoto(): Promise<CardItem> {
  const stockAdapter = createStoreAdapter<IndexedImage>('stockImages')
  const userAdapter = createStoreAdapter<IndexedImage>('userImages')

  const [stockImages, userImages] = await Promise.all([
    stockAdapter.getAll(),
    userAdapter.getAll(),
  ])

  const sectionWorkingImage = stockImages.some(
    (image) => image.id === 'workingImage'
  )
    ? 'stockImages'
    : userImages.some((image) => image.id === 'workingImage')
      ? 'userImages'
      : null

  const adapterMap = {
    stockImages: stockAdapter,
    userImages: userAdapter,
  }

  const workingImage = sectionWorkingImage
    ? await adapterMap[sectionWorkingImage].getByLocalId('workingImage')
    : null

  const cardEdit = JSON.parse(localStorage.getItem('cardEdit') || '{}')

  return {
    ...cardEdit,
    cardphoto: workingImage,
  }
}
