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
  const [prevConfigCrop, setPrevConfigCrop] = useState<CropLayer | null>(
    currentConfigCrop,
  )

  if (currentConfigCrop !== prevConfigCrop) {
    setTempCrop(currentConfigCrop)
    setPrevConfigCrop(currentConfigCrop)
  }

  useEffect(() => {
    if (toolbarStateCrop !== 'active') {
      setTempCrop(null)
    } else {
      setTempCrop(currentConfigCrop)
    }
  }, [toolbarStateCrop])

  return [tempCrop, setTempCrop] as const
}

export function useCropState1(
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
