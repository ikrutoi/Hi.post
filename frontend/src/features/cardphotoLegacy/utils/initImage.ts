import { createStoreAdapter } from '@db/publicApi'
import { addHiPostImage } from '@utils/cardFormNav/indexDB/indexDb'
import { checkIndexDb } from './checkIndexDb'
import type { AppDispatch } from '@app/store/store'
import type { ImageState } from '../model/types'

export const fetchInitialImage = async (
  dispatch: AppDispatch,
  setImage: (img: ImageState) => void,
  fetchImageFromIndexedDb: (img: {
    base: ImageState['base']
    source: ImageState['source']
  }) => Promise<void>,
  coverImageUrl: string
): Promise<void> => {
  try {
    const stockAdapter = createStoreAdapter('stockImages')
    const userAdapter = createStoreAdapter('userImages')

    const stockImages = await stockAdapter.getAll()
    const userImages = await userAdapter.getAll()

    const findStartImage = (list: any[], base: ImageState['base']) => {
      const working = list.find((img) => img.id === 'workingImage')
      const original = list.find((img) => img.id === 'originalImage')
      return working
        ? { base, source: 'workingImage' }
        : original
          ? { base, source: 'originalImage' }
          : null
    }

    const startImage =
      findStartImage(userImages, 'userImages') ??
      findStartImage(stockImages, 'stockImages')

    if (startImage) {
      await fetchImageFromIndexedDb(startImage)
    } else {
      const response = await fetch(coverImageUrl)
      const blob = await response.blob()
      await addHiPostImage('originalImage', blob)
      await checkIndexDb(dispatch)
      setImage({
        base: 'stockImages',
        source: 'originalImage',
        url: coverImageUrl,
      })
    }
  } catch (error) {
    console.error('Error initializing image:', error)
  }
}
