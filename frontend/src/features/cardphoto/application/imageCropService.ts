import {
  fetchIndexDbImages,
  saveImageToDb,
  deleteImageFromDb,
} from '../infrastructure/indexDbService'
import { base64ToBlob } from '../domain/logic'
import type { ImageBase } from '../domain/image.types'

export const saveCroppedImage = async (
  base: ImageBase,
  croppedBase64: string
): Promise<void> => {
  const blob = base64ToBlob(croppedBase64, 'image/png')
  await saveImageToDb(base, 'workingImage', blob)

  const oppositeBase: ImageBase =
    base === 'stockImages' ? 'userImages' : 'stockImages'

  await deleteImageFromDb(oppositeBase, 'miniImage')
  await saveImageToDb(base, 'miniImage', blob)
  await fetchIndexDbImages()
}
