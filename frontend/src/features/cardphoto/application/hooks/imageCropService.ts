import { base64ToBlob } from '../../domain/logic'
import {
  fetchIndexDbImages,
  saveImageToDb,
  deleteImageFromDb,
} from './useImageCropService'
import type { ImageBase } from '../../domain/types'

export const saveCroppedImage = async (
  store: ImageBase,
  croppedBase64: string
): Promise<void> => {
  const blob = base64ToBlob(croppedBase64, 'image/png')
  await saveImageToDb(store.store, 'workingImage', blob)

  const oppositeBase =
    store.store === 'stockImages' ? 'userImages' : 'stockImages'

  await deleteImageFromDb(oppositeBase, 'miniImage')
  await saveImageToDb(store.store, 'miniImage', blob)
  await fetchIndexDbImages()
}
