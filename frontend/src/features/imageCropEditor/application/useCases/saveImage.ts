import { createStoreAdapter } from '@db/publicApi'
import { getCroppedImage } from '../../infrastructure/images/getCroppedImage'
import { base64ToBlob } from '../../infrastructure/images/base64ToBlob'
import type { ImageState, CropRect, SizeCard } from '../../domain/model/types'

interface SaveImageParams {
  image: ImageState
  crop: CropRect
  sizeCard: SizeCard
  scaleX: number
  scaleY: number
  setImage: (img: ImageState) => void
  setCrop: (crop: CropRect) => void
}

export const saveImage = async ({
  image,
  crop,
  sizeCard,
  scaleX,
  scaleY,
  setImage,
  setCrop,
}: SaveImageParams): Promise<void> => {
  if (!image.base || !image.source || !image.url) return

  const croppedBase64 = await getCroppedImage(
    image.url,
    crop,
    sizeCard,
    scaleX,
    scaleY
  )

  const blob = base64ToBlob(croppedBase64, 'image/png')

  const adapter = createStoreAdapter(image.base)
  await adapter.deleteById('workingImage')
  await adapter.deleteById('miniImage')
  await adapter.addRecordWithId('workingImage', { image: blob })
  await adapter.addRecordWithId('miniImage', { image: blob })

  setImage({ base: image.base, source: 'workingImage', url: croppedBase64 })
  setCrop({ x: 0, y: 0, width: sizeCard.width, height: sizeCard.height })
}
