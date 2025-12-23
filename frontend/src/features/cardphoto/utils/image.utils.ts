import { ImageVersion, ImageStage } from '../domain/typesLayout'

export const createImageUrl = (blob: Blob): string => URL.createObjectURL(blob)

export const revokeImageUrl = (url?: string | null) => {
  if (url) URL.revokeObjectURL(url)
}

export const generateImageId = (prefix: string = 'img'): string =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

export const createImageVersion = (
  blob: Blob,
  stage: ImageStage,
  prefix: string = 'img'
): ImageVersion => ({
  idImage: generateImageId(prefix),
  image: blob,
  stage,
  url: createImageUrl(blob),
  timestamp: Date.now(),
})
