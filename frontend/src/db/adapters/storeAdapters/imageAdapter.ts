import { createStoreAdapter } from '../factory'
import type { IndexedImage } from '@/features/cardphoto/domain/typesLayout'

export const imageAdapter = {
  stockImages: createStoreAdapter<IndexedImage>('stockImages'),
  userImages: createStoreAdapter<IndexedImage>('userImages'),
}
