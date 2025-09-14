export interface Position {
  x: number
  y: number
}

export interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

export type CropMode = 'startCrop' | 'maxCrop'
