export type Role = 'originalImage' | 'workingImage' | 'miniImage'
export type ImageStore = 'stockImages' | 'userImages'

export interface ImageCropState {
  role: Role | null
  store: ImageStore | null
  url: string | null
}

export interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

export interface SizeCard {
  width: number | null
  height: number | null
}

export interface StartImage {
  role: Role
  store: ImageStore
}

export interface IndexedImage {
  id: string
  image: Blob
  store?: ImageStore
  role?: Role
}

export interface ImageSize {
  width: number
  height: number
}

export interface ImageDimensions {
  width: number
  height: number
}

export type CropMode = 'startCrop' | 'maxCrop'
