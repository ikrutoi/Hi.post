import type { AppDispatch } from '@app/store/store'
import { createStoreAdapter } from '@db/publicApi'
import type { StoreMap } from '@db/publicApi'
import { checkIndexDb } from './checkIndexDb'
import type { ImageState } from '../../domain/model/types'

export const fetchInitialImage = async (
  dispatch: AppDispatch,
  setImage: (img: ImageState) => void,
  fetchDimensions: (url: string, mode: 'startCrop') => void,
  coverImageUrl: string
): Promise<void> => {
  try {
    const response = await fetch(coverImageUrl)
    const blob = await response.blob()
    const stockAdapter =
      createStoreAdapter<StoreMap['stockImages']>('stockImages')
    await stockAdapter.addRecordWithId('originalImage', { image: blob })
    await checkIndexDb(dispatch)

    setImage({
      base: 'stockImages',
      source: 'originalImage',
      url: coverImageUrl,
    })

    fetchDimensions(coverImageUrl, 'startCrop')
  } catch (error) {
    console.error('Error initializing image:', error)
  }
}
