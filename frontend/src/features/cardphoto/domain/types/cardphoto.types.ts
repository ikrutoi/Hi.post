import { CardStatus } from '@/entities/card/domain/types'
import type { LayoutOrientation } from '@layout/domain/types'

export type ImageSource = 'stock' | 'user' | 'processed' | 'apply'

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

/** Matches layout `SizeCard` when used as the working card in editor config. */
export interface CardLayer {
  width: number
  height: number
  aspectRatio: number
  orientation: LayoutOrientation
}

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
  isCropped: boolean
  timestamp: number
  parentImageId?: string
  orientation?: LayoutOrientation
  rotation?: number
  imageAspectRatio?: number
}

export interface ImageLayer {
  meta: ImageMeta
  left: number
  top: number
  rotation: number
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
  appliedImageUrl: string | null
}

export type CardphotoOperationReason =
  | 'reset'
  | 'cropFull'
  | 'rotateCard'
  | 'rotateImage'
  | 'applyCrop'
  | 'rebuild'

export type CardphotoOperation = {
  type: 'operation'
  payload: {
    config: WorkingConfig
    reason?: CardphotoOperationReason
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
  appended: string | null
}

export interface PreviewItem {
  item: { previewUrl: string }
  status: CardStatus
  cardId: string
}
