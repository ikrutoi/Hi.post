import { createStoreAdapter } from '../factory'
import type { IndexedImage } from '@cardphoto/domain/types'

export const imageAdapter = {
  stockImages: createStoreAdapter<IndexedImage>('stockImages'),
  userImages: createStoreAdapter<IndexedImage>('userImages'),
}
