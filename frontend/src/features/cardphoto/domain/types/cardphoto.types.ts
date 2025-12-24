export const IMAGE_SOURCE = ['stock', 'user', 'sent'] as const
export type ImageSource = (typeof IMAGE_SOURCE)[number]

export const IMAGE_ROLE = ['original', 'thumbnail', 'working'] as const
export type ImageRole = (typeof IMAGE_ROLE)[number]

export interface ImageMeta {
  id: string
  source: ImageSource
  role: ImageRole
  url?: string
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
  role: 'thumbnail'
  url: string
  width: number
  height: number
}

export const IMAGE_OPERATION_TYPE = ['crop', 'rotate', 'scale'] as const
export type ImageOperationType = (typeof IMAGE_OPERATION_TYPE)[number]

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
