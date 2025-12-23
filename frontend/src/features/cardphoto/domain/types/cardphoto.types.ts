export type ImageSource = 'stock' | 'user' | 'sentPreview'

export type ImageRole = 'original' | 'thumbnail' | 'working'

export interface ImageMeta {
  id: string
  source: ImageSource
  role: ImageRole
  url: string | null
  width?: number
  height?: number
  timestamp?: number
}

export interface ImageOriginal {
  id: string
  source: ImageSource
  blob?: Blob
  url?: string
}

export interface ImageThumbnail {
  id: string
  source: ImageSource
  url: string
  width: number
  height: number
}

export type ImageOperation =
  | { type: 'crop'; area: CropArea }
  | { type: 'rotate'; angle: number }
  | { type: 'scale'; factor: number }

export interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

export interface ImageHistory {
  original: ImageOriginal
  operations: ImageOperation[]
  activeIndex: number
}

export interface UserImageLimit {
  maxCount: number
}

export interface CardSize {
  width: number
  height: number
}
