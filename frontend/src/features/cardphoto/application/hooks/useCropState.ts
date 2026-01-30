import { useEffect, useState } from 'react'
import { createInitialCropLayer } from '../utils'
import type { CropLayer, ImageLayer } from '../../domain/types'
import type { SizeCard } from '@layout/domain/types'
import type { IconState } from '@shared/config/constants'

export function useCropState(
  toolbarStateCrop: IconState,
  currentConfigCrop: CropLayer | null,
) {
  const [tempCrop, setTempCrop] = useState<CropLayer | null>(currentConfigCrop)

  useEffect(() => {
    setTempCrop(currentConfigCrop)
  }, [currentConfigCrop])

  useEffect(() => {
    if (toolbarStateCrop === 'active') {
      setTempCrop(currentConfigCrop)
    } else {
      setTempCrop(null)
    }
  }, [toolbarStateCrop, currentConfigCrop])

  return [tempCrop, setTempCrop] as const
}
