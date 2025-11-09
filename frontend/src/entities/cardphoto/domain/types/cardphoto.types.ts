import { FormatPreview } from '@entities/preview/domain/types'

export type CardphotoMeta = {
  source: string | null
  createdAt?: string
  author?: string
  [key: string]: unknown
}

export type CardphotoPreview = {
  blob: Blob
  // viewportSize: ViewportSize
  width: number
  height: number
  format: FormatPreview
}

export type CardphotoState = {
  url: Blob
  preview: CardphotoPreview
  meta?: CardphotoMeta
}
