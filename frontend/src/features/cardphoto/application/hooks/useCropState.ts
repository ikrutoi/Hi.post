import { useEffect, useRef, useState } from 'react'
import { createInitialCropLayer } from '../utils'
import type { CropLayer, ImageLayer } from '../../domain/types'
import type { SizeCard } from '@layout/domain/types'
import type { IconState } from '@shared/config/constants'

export function useCropState(
  toolbarStateCrop: IconState,
  imageLayer: ImageLayer | null,
  sizeCard: SizeCard,
  currentConfigCrop: CropLayer | null
) {
  const [tempCrop, setTempCrop] = useState<CropLayer | null>(currentConfigCrop)
  const prevOrientationRef = useRef(sizeCard.orientation)

  useEffect(() => {
    if (!imageLayer) return

    const orientationChanged =
      prevOrientationRef.current !== sizeCard.orientation

    if (toolbarStateCrop === 'active') {
      if (orientationChanged) {
        const freshCrop = createInitialCropLayer(imageLayer, sizeCard)
        setTempCrop(freshCrop)
      } else if (currentConfigCrop) {
        setTempCrop(currentConfigCrop)
      }
    } else {
      if (orientationChanged) {
        setTempCrop(null)
      }
    }

    prevOrientationRef.current = sizeCard.orientation
  }, [toolbarStateCrop, sizeCard.orientation, imageLayer, currentConfigCrop])

  return [tempCrop, setTempCrop] as const
}
