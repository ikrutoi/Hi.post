export const FILE_VARIANTS = ['original', 'display', 'thumb'] as const

export type FileVariant = (typeof FILE_VARIANTS)[number]

export type UserFileVariantPayload = {
  url: string
  mime: string
  size: number
  width: number | null
  height: number | null
}

export type UserFilePayload = {
  id: string
  original: UserFileVariantPayload
  display: UserFileVariantPayload
  thumb: UserFileVariantPayload | null
}

export type UserFileUploadInput = {
  original: Blob
  display?: Blob | null
  thumb?: Blob | null
  originalWidth?: number
  originalHeight?: number
  displayWidth?: number
  displayHeight?: number
  thumbWidth?: number
  thumbHeight?: number
}
