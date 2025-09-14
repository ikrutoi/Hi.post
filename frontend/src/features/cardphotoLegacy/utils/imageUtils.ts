import { adjustImageSize } from '@shared/images/adjustImageSize'
import { centeringMaxCrop } from '@shared/images/centeringMaxCrop'
import { loadImageDimensions } from '@shared/images/loadImageDimensions'
import { CropRect } from '@cardphoto/types'
import { SizeCard } from 'shared-legacy/layoutLegacy/model'

export const base64ToBlob = (
  base64: string,
  contentType = '',
  sliceSize = 512
): Blob => {
  const byteCharacters = atob(base64.split(',')[1])
  const byteArrays: Uint8Array[] = []

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize)
    const byteNumbers = Array.from(slice).map((char) => char.charCodeAt(0))
    byteArrays.push(new Uint8Array(byteNumbers))
  }

  return new Blob(byteArrays, { type: contentType })
}

export const fetchImageDimensions = async (
  src: string,
  modeCrop: string,
  imgRef: React.RefObject<HTMLImageElement>,
  sizeCard: SizeCard,
  layoutMemoryCrop: CropRect | null,
  aspectRatio: number,
  setCrop: (crop: CropRect) => void,
  setScaleX: (x: number) => void,
  setScaleY: (y: number) => void
) => {
  try {
    const dimensions = await loadImageDimensions(src)
    const img = imgRef.current
    if (!img) return

    img.src = ''
    img.onload = () => {
      const { width, height } = adjustImageSize(
        img,
        sizeCard.width,
        sizeCard.height
      )
      img.style.width = `${width}px`
      img.style.height = `${height}px`

      const scaleX = dimensions.width / img.width
      const scaleY = dimensions.height / img.height
      setScaleX(scaleX)
      setScaleY(scaleY)

      if (layoutMemoryCrop) {
        setCrop(layoutMemoryCrop)
      } else {
        const valueCrop = centeringMaxCrop(dimensions, aspectRatio, modeCrop)
        setCrop(valueCrop)
      }
    }

    img.src = src
  } catch (err) {
    console.error('Error loading image:', err)
  }
}
