import type { ImageMeta } from '@cardphoto/domain/types'
import type { TemplateBase, TemplateMetadata } from './template.types'
import type {
  PhotoMonetization,
  PhotoTemplateStats,
  TemplateVisibility,
} from './monetization.types'

export type ImageSourceType = 'stock' | 'user'

export interface ImageMetadata {
  width: number
  height: number
}

export interface CardphotoTemplate extends TemplateBase, TemplateMetadata {
  userId: string

  image: ImageMeta
  source: ImageSourceType
  theme?: string
  imageBlob?: Blob

  imageUrl?: string
  thumbnailUrl?: string

  metadata?: ImageMetadata

  visibility: TemplateVisibility
  isPublic: boolean
  isModerated: boolean
  isApproved: boolean

  monetization: PhotoMonetization

  stats: PhotoTemplateStats
}

export interface CreateCardphotoTemplatePayload {
  image: ImageMeta
  source: ImageSourceType
  theme?: string
  name?: string
  imageBlob?: Blob
  /** Опционально: свой id (иначе будет сгенерирован nanoid()) */
  id?: string
  visibility?: TemplateVisibility
  monetizationEnabled?: boolean
  pricePerUse?: number
}

export interface UpdateCardphotoTemplatePayload {
  image?: ImageMeta
  theme?: string
  name?: string
  imageBlob?: Blob
  visibility?: TemplateVisibility
  monetization?: Partial<PhotoMonetization>
}

export interface PublishPhotoPayload {
  visibility: TemplateVisibility
  monetization?: {
    enabled: boolean
    pricePerUse?: number
  }
}
