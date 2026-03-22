import { useEffect, useState } from 'react'
import type { CropLayer } from '../../domain/types'
import type { IconState } from '@shared/config/constants'

export function useCropState(
  toolbarStateCrop: IconState,
  currentConfigCrop: CropLayer | null,
) {
  const [tempCrop, setTempCrop] = useState<CropLayer | null>(currentConfigCrop)

  // Только в эффектах: обновление стейта во время render запрещено (ошибка при сбросе сессии / удалении фото).
  useEffect(() => {
    if (toolbarStateCrop !== 'active') {
      setTempCrop(null)
    } else {
      setTempCrop(currentConfigCrop)
    }
  }, [toolbarStateCrop, currentConfigCrop])

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
