export type Role = 'originalImage' | 'workingImage' | 'miniImage'
export type ImageStore = 'stockImages' | 'userImages'

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
  id: string
  image: Blob
  store?: ImageStore
  role?: Role
}

export interface ImageBase {
  store: ImageStore
  role: Role
}
