export type ImageSource = 'originalImage' | 'workingImage' | 'miniImage'
export type ImageBase = 'stockImages' | 'userImages'

export interface ImageState {
  source: ImageSource | null
  url: string | null
  base: ImageBase | null
}

export interface CropRect {
  x: number
  y: number
  width: number
  height: number
}

export interface MousePosition {
  x: number
  y: number
}

export interface SizeCard {
  width: number
  height: number
}
