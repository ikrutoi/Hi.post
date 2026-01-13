export const IMAGE_SOURCE = ['stock', 'user', 'sent'] as const
export type ImageSource = (typeof IMAGE_SOURCE)[number]
import type { LayoutOrientation } from '@layout/domain/types'

export interface ImageThumbnail {
  id: string
  source: ImageSource
  role: 'thumbnail'
  url: string
  width: number
  height: number
}

// export type LayoutOrientation = 'portrait' | 'landscape'

export interface CardLayer {
  width: number
  height: number
  aspectRatio: number
  orientation: LayoutOrientation
}

export type ImageOrientation = 0 | 90 | 180 | 270

export interface ImageMeta {
  id: string
  source: ImageSource
  url: string
  blob?: Blob
  width: number
  height: number
  imageAspectRatio: number
  timestamp?: number
}

export interface ImageLayer {
  meta: ImageMeta
  left: number
  top: number
  orientation: ImageOrientation
}

export interface CropMeta {
  width: number
  height: number
  aspectRatio: number
}

export interface CropLayer {
  meta: CropMeta
  x: number
  y: number
  orientation: LayoutOrientation
}

export interface WorkingConfig {
  card: CardLayer
  image: ImageLayer
  crop: CropLayer
}

export interface CardphotoBase {
  stock: { image: ImageMeta | null }
  user: { image: ImageMeta | null }
  apply: { image: ImageMeta | null }
}

export type CardphotoOperation = {
  type: 'operation'
  payload: {
    config: WorkingConfig
    reason?:
      | 'crop'
      | 'rotateCard'
      | 'rotateImage'
      | 'moveCrop'
      | 'initStock'
      | 'uploadUser'
      | 'applyFinal'
      | 'resetCrop'
      | 'cropFull'
      | 'initCrop'
      | 'initUserImage'
  }
}

export interface CardphotoState {
  base: CardphotoBase
  operations: CardphotoOperation[]
  activeIndex: number
  currentConfig: WorkingConfig | null
}

// ----------------------

export const IMAGE_OPERATION_TYPE = ['initial', 'crop', 'apply'] as const
export type ImageOperationType = (typeof IMAGE_OPERATION_TYPE)[number]

export type ImageOperation =
  | { type: 'initial'; payload?: undefined }
  | {
      type: 'crop'
      payload: { area: CropLayer }
    }
  | {
      type: 'apply'
      payload: {
        snapshot: WorkingConfig
        orientation: LayoutOrientation
      }
    }

export interface ImageHistory {
  original: ImageMeta
  operations: ImageOperation[]
  activeIndex: number
  workingConfig: WorkingConfig
  lastApplied: WorkingConfig | null
  finalImage: ImageMeta | null
}

// ----------------------

export interface UserImageLimit {
  maxCount: number
}

export interface CardSize {
  width: number
  height: number
}

export interface ImageData {
  width: number
  height: number
  left: number
  top: number
  aspectRatio: number
  imageAspectRatio: number
}

export interface CropState extends ImageData {
  ownerImageId: string | null
}
