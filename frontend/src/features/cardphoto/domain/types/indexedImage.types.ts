export const IMAGE_STORE = ['stockImages', 'userImages'] as const

export type ImageStore = (typeof IMAGE_STORE)[number]

export type Role = 'originalImage' | 'workingImage' | 'miniImage'

export interface IndexedImage {
  localId: string
  image: Blob
  store?: ImageStore
  role?: Role
}
