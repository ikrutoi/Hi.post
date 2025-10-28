import { useCallback } from 'react'
import type { CropArea } from '../../domain/types'

interface UseCropResizeParams {
  imgRef: React.RefObject<HTMLImageElement | null>
  crop: CropArea
  setCrop: (updater: (prev: CropArea) => CropArea) => void
  scaleX: number
  scaleY: number
  aspectRatio: number
  setIsResizing: (value: boolean) => void
}

export const useCropResize = ({
  imgRef,
  crop,
  setCrop,
  scaleX,
  scaleY,
  aspectRatio,
  setIsResizing,
}: UseCropResizeParams) => {
  const handleMouseDownResize = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      setIsResizing(true)

      const startX = e.clientX
      const startY = e.clientY
      const startWidth = crop.width
      const startHeight = crop.height

      const onMouseMove = (e: MouseEvent) => {
        const deltaX = (e.clientX - startX) * scaleX
        const deltaY = (e.clientY - startY) * scaleY
        let newWidth = startWidth + deltaX
        let newHeight = startHeight + deltaY

        if (newWidth / newHeight !== aspectRatio) {
          newHeight = newWidth / aspectRatio
        }

        const img = imgRef.current
        if (!img) return

        if (crop.x + newWidth > img.width * scaleX) {
          newWidth = img.width * scaleX - crop.x
          newHeight = newWidth / aspectRatio
        }
        if (crop.y + newHeight > img.height * scaleY) {
          newHeight = img.height * scaleY - crop.y
          newWidth = newHeight * aspectRatio
        }

        setCrop((prev) => ({ ...prev, width: newWidth, height: newHeight }))
      }

      const onMouseUp = () => {
        setIsResizing(false)
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('mouseup', onMouseUp)
      }

      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', onMouseUp)
    },
    [crop, scaleX, scaleY, aspectRatio, imgRef, setCrop, setIsResizing]
  )

  return { handleMouseDownResize }
}
