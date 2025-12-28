import { useEffect } from 'react'
import type { ImageData, CropState } from '../../domain/types'

type ResetCropFn = (
  imageWidth: number,
  imageHeight: number,
  aspectRatio: number,
  imageAspectRatio: number,
  imageLeft: number,
  imageTop: number,
  imageId: string
) => void

export function useCropInitialization(
  imageData: CropState | null,
  crop: CropState,
  resetCrop: ResetCropFn,
  isReady: boolean,
  hasError: boolean,
  activeImageId?: string
) {
  useEffect(() => {
    if (!isReady || hasError || !imageData || !activeImageId) return

    const isEmpty = crop.width === 0 || crop.height === 0
    const isNewImage = crop.ownerImageId !== activeImageId
    const isImageDataFresh = imageData.ownerImageId === activeImageId

    if (isEmpty) {
      resetCrop(
        imageData.width,
        imageData.height,
        imageData.aspectRatio,
        imageData.imageAspectRatio,
        imageData.left,
        imageData.top,
        activeImageId
      )
      return
    }

    if (isNewImage && isImageDataFresh) {
      resetCrop(
        imageData.width,
        imageData.height,
        imageData.aspectRatio,
        imageData.imageAspectRatio,
        imageData.left,
        imageData.top,
        activeImageId
      )
    }
  }, [isReady, hasError, activeImageId, crop.ownerImageId, imageData])

  // useEffect(() => {
  //   console.log('cropInit', crop.ownerImageId, activeImageId)
  //   console.log('cropInit size', imageData?.width, imageData?.height)
  //   if (!isReady || hasError || !imageData || !activeImageId) return

  //   const isEmpty = crop.width === 0 || crop.height === 0
  //   const isNewImage = crop.ownerImageId !== activeImageId

  //   if (isEmpty || isNewImage) {
  //     resetCrop(
  //       imageData.width,
  //       imageData.height,
  //       imageData.aspectRatio,
  //       imageData.imageAspectRatio,
  //       imageData.left,
  //       imageData.top,
  //       activeImageId
  //     )
  //   }
  // }, [isReady, hasError, activeImageId, crop.ownerImageId, imageData])
}
