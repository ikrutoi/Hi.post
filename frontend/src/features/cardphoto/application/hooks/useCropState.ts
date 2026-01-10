import { useEffect, useState } from 'react'
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

  useEffect(() => {
    setTempCrop(currentConfigCrop)
  }, [currentConfigCrop, imageLayer])

  useEffect(() => {
    if (!imageLayer) return

    if (toolbarStateCrop === 'active') {
      if (!currentConfigCrop) {
        const freshCrop = createInitialCropLayer(imageLayer, sizeCard)
        setTempCrop(freshCrop)
      }
    }
  }, [toolbarStateCrop, sizeCard.orientation, imageLayer])

  return [tempCrop, setTempCrop] as const
}
