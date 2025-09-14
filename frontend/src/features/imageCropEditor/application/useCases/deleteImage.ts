import { createStoreAdapter } from '@db/publicApi'
import type { ImageState } from '../../domain/types/imageCrop.types'

interface DeleteImageParams {
  image: ImageState
  setImage: (img: ImageState) => void
}

export const deleteImage = async ({
  image,
  setImage,
}: DeleteImageParams): Promise<void> => {
  if (!image.base || !image.source) return

  const adapter = createStoreAdapter(image.base)
  await adapter.deleteById(image.source)

  setImage({ base: image.base, source: null, url: null })
}
