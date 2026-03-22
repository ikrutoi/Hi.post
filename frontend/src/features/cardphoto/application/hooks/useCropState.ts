import { useEffect, useState } from 'react'
import type { CropLayer } from '../../domain/types'
import type { IconState } from '@shared/config/constants'

/** Сравнение без учёта ссылки: при каждом commit в Redux приходит новый объект с теми же числами. */
function cropLayersEqual(
  a: CropLayer | null,
  b: CropLayer | null,
): boolean {
  if (a === b) return true
  if (!a || !b) return false
  return (
    a.x === b.x &&
    a.y === b.y &&
    a.meta.width === b.meta.width &&
    a.meta.height === b.meta.height &&
    a.meta.aspectRatio === b.meta.aspectRatio &&
    a.meta.qualityProgress === b.meta.qualityProgress
  )
}

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
      setTempCrop((prev) => {
        if (cropLayersEqual(prev, currentConfigCrop)) return prev
        return currentConfigCrop
      })
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
