// export type ImageStore = 'stockImages' | 'userImages'
import type { ImageStore } from './cardphotoSteps.types'

export type Role = 'originalImage' | 'workingImage' | 'miniImage'

export interface ImageCropState {
  role: Role | null
  store: ImageStore | null
  url: string | null
}

export interface StartImage {
  role: Role
  store: ImageStore
}

export interface IndexedImage {
  localId: string
  image: Blob
  store?: ImageStore
  role?: Role
}

export interface ImageBase {
  store: ImageStore
  role: Role
}

export interface LoadedImage extends ImageBase {
  url: string
  source: File
}
