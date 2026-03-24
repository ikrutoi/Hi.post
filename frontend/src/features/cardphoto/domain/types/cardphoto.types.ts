import { CardStatus } from '@/entities/card/domain/types'
import type { LayoutOrientation } from '@layout/domain/types'

export type CardphotoImageStageRect = { width: number; height: number }

export type ImageSource = 'stock' | 'user' | 'original'

export type ImageStatus = 'processed' | 'outLine' | 'inLine'

export type CardphotoAssetToolbar =
  | 'cardphotoCreate'
  | 'cardphotoProcessed'
  | 'cardphotoView'
  | null

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
  favorite?: boolean
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
}

export interface WorkingConfig {
  card: CardLayer
  image: ImageLayer
  crop: CropLayer
}

export interface CardphotoSessionRecord {
  assetConfig: {
    card: CardLayer
    image: Omit<ImageLayer, 'meta'> & { metaId: string }
    crop: CropLayer
  }
  appliedData: ImageMeta | null
  assetData: ImageMeta | null
  userOriginalData: ImageMeta | null
}

export interface CardphotoState {
  imageStageRect: CardphotoImageStageRect | null
  appliedData: ImageMeta | null
  assetData: ImageMeta | null
  userOriginalData: ImageMeta | null
  assetConfig: WorkingConfig | null
}

export interface PreviewItemForCalendar {
  item: { previewUrl: string }
  status: CardStatus
  cardId: string
}
