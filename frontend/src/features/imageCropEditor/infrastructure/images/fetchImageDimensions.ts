import { loadImageDimensions } from './loadImageDimensions'
import { adjustImageSize } from './adjustImageSize'
import type { CropRect } from '../../domain/types/imageCrop.types'

interface FetchImageDimensionsParams {
  src: string
  imgElement: HTMLImageElement
  containerWidth: number
  containerHeight: number
  aspectRatio: number
  memoryCrop?: CropRect | null
  modeCrop: 'startCrop' | 'maxCrop'
  setScaleX: (v: number) => void
  setScaleY: (v: number) => void
  setCrop: (crop: CropRect) => void
}

export const fetchImageDimensions = async ({
  src,
  imgElement,
  containerWidth,
  containerHeight,
  aspectRatio,
  memoryCrop,
  modeCrop,
  setScaleX,
  setScaleY,
  setCrop,
}: FetchImageDimensionsParams): Promise<void> => {
  try {
    const dimensions = await loadImageDimensions(src)

    imgElement.src = ''
    imgElement.onload = () => {
      const { width, height } = adjustImageSize(
        imgElement,
        containerWidth,
        containerHeight
      )
      imgElement.style.width = `${width}px`
      imgElement.style.height = `${height}px`

      const scaleX = dimensions.width / width
      const scaleY = dimensions.height / height
      setScaleX(scaleX)
      setScaleY(scaleY)

      const crop = memoryCrop
        ? memoryCrop
        : centeringMaxCrop(dimensions, aspectRatio, modeCrop)

      setCrop(crop)
    }

    imgElement.src = src
  } catch (error) {
    console.error('Error loading image dimensions:', error)
  }
}
