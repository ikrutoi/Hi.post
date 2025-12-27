import { useState, useCallback } from 'react'
import { CardScaleConfig } from '@shared/config/constants'

export interface CropArea {
  left: number
  top: number
  width: number
  height: number
}

export function useCropArea(
  imageWidth: number,
  imageHeight: number,
  config: CardScaleConfig
) {
  const initialWidth = Math.round(imageWidth * 0.9)
  const initialHeight = Math.round(initialWidth / config.aspectRatio)

  const [crop, setCrop] = useState<CropArea>({
    left: Math.round((imageWidth - initialWidth) / 2),
    top: Math.round((imageHeight - initialHeight) / 2),
    width: initialWidth,
    height: initialHeight,
  })

  const updateCrop = useCallback((next: Partial<CropArea>) => {
    setCrop((prev) => ({
      ...prev,
      ...next,
    }))
  }, [])

  return { crop, updateCrop }
}
