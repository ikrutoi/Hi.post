import { CardStatus } from '@/entities/card/domain/types'
import type { LayoutOrientation } from '@layout/domain/types'

/** Pixel box of the cardphoto editor stage (DOM), used as WorkingConfig.card when present. */
export type CardphotoPhotoStageRect = { width: number; height: number }

/**
 * Origin of the underlying photo, not the processing stage.
 * Used in `ImageMeta.source`.
 */
export type ImageSource = 'stock' | 'user'

/**
 * Stage/visibility of a photo variant.
 * Used in `ImageMeta.status`.
 */
export type ImageStatus = 'processed' | 'outLine' | 'inLine'

/**
 * UI/editor mode used across the current editor flow.
 * This is *not* `ImageMeta.source`.
 */
export type ActiveImageSource = 'stock' | 'user' | 'processed' | 'apply'

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

/** Working “card” in editor math: pixel size + aspect; orientation from layout for crop helpers. */
export interface CardLayer {
  width: number
  height: number
  aspectRatio: number
  orientation: LayoutOrientation
}

export interface ImageData {
  blob?: Blob
  url: string
  width: number
  height: number
}

export interface ImageMeta {
  id: string
  source: ImageSource
  status: ImageStatus
  url: string
  full: ImageData
  thumbnail?: ImageData
  width: number
  height: number
  isCropped: boolean
  timestamp: number
  parentImageId?: string
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
  qualityProgress: number
}

export interface CropLayer {
  meta: CropMeta
  x: number
  y: number
  // orientation: LayoutOrientation
}

export interface WorkingConfig {
  card: CardLayer
  image: ImageLayer
  crop: CropLayer
}

export interface CardphotoSessionRecord {
  source: ActiveImageSource
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

export interface CardphotoState {
  base: CardphotoBase
  cropCount: number
  cropIds: string[]
  activeSource: ActiveImageSource | null
  currentConfig: WorkingConfig | null
  appended: string | null
  photoStageRect: CardphotoPhotoStageRect | null
}

export interface PreviewItem {
  item: { previewUrl: string }
  status: CardStatus
  cardId: string
}
