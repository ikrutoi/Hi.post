import type { LayoutOrientation } from '@layout/domain/types'

export const IMAGE_SOURCE = ['stock', 'user', 'processed', 'apply'] as const
export type ImageSource = (typeof IMAGE_SOURCE)[number]

export interface GalleryItem extends ImageMeta {
  orientation: LayoutOrientation
  previewUrl?: string
}

export interface CardphotoBase {
  stock: { image: ImageMeta | null }
  user: { image: ImageMeta | null }
  processed: { image: ImageMeta | null }
  apply: { image: ImageMeta | null }
}

export interface ImageRecord {
  id: string
  image: ImageMeta
}

export interface CardLayer {
  width: number
  height: number
  aspectRatio: number
  orientation: LayoutOrientation
}

export type ImageRotation = 0 | 90 | 180 | 270

export type QualityLevel = 'high' | 'medium' | 'low'
export interface ImageData {
  blob?: Blob
  url: string
  width: number
  height: number
}

export interface ImageMeta {
  id: string
  source: ImageSource
  url: string
  full: ImageData
  thumbnail?: ImageData
  width: number
  height: number
  imageAspectRatio: number
  isCropped: boolean
  timestamp: number
  parentImageId?: string
  orientation: LayoutOrientation
  rotation: ImageRotation
}

export interface ImageLayer {
  meta: ImageMeta
  left: number
  top: number
  rotation: ImageRotation
}

export interface CropMeta {
  width: number
  height: number
  aspectRatio: number
  quality: QualityLevel
  qualityProgress: number
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

export interface CardphotoSessionRecord {
  source: ImageSource
  activeMetaId: string
  cropIds: string[]
  config: {
    card: CardLayer
    image: Omit<ImageLayer, 'meta'> & { metaId: string }
    crop: CropLayer
  }
  apply: ImageMeta | null
  isComplete: boolean
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
      | 'initStockImage'
      | 'uploadUser'
      | 'applyFinal'
      | 'resetCrop'
      | 'cropFull'
      | 'initCrop'
      | 'initUserImage'
      | 'activateCrop'
      | 'applyCrop'
      | 'init'
      | 'rebuild_by_orientation'
      | 'rebuild'
      | 'rotateCard'
      | 'reset'
  }
}

export interface CardphotoState {
  base: CardphotoBase
  operations: CardphotoOperation[]
  activeIndex: number
  cropCount: number
  cropIds: string[]
  activeSource: ImageSource | null
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

export interface ImageThumbnail {
  id: string
  source: ImageSource
  role: 'thumbnail'
  url: string
  width: number
  height: number
}
