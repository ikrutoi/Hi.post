export const IMAGE_SOURCE = ['stock', 'user', 'sent'] as const
export type ImageSource = (typeof IMAGE_SOURCE)[number]

export const IMAGE_ROLE = ['original', 'thumbnail', 'working'] as const
export type ImageRole = (typeof IMAGE_ROLE)[number]

export interface ImageMeta {
  id: string
  source: ImageSource
  role: ImageRole
  url?: string
  width: number
  height: number
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

export const IMAGE_OPERATION_TYPE = ['initial', 'crop', 'apply'] as const
export type ImageOperationType = (typeof IMAGE_OPERATION_TYPE)[number]

export interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

export type Orientation = 0 | 90 | 180 | 270

export type ImageOperation =
  | { type: 'initial'; payload?: undefined }
  | {
      type: 'crop'
      payload: { area: CropArea; orientation: Orientation }
    }
  | {
      type: 'apply'
      payload: {
        snapshot: WorkingConfig
        orientation: Orientation
      }
    }

export interface WorkingConfig {
  crop?: CropArea
  orientation: Orientation
}

export interface ImageHistory {
  original: ImageOriginal
  operations: ImageOperation[]
  activeIndex: number
  workingConfig: WorkingConfig
  lastApplied?: WorkingConfig | null
}

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
