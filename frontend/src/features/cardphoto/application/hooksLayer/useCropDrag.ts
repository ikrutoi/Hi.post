import { useCallback, useEffect } from 'react'
import type { Position, CropArea } from '../../domain/typesLayout'

interface UseCropDragParams {
  imgRef: React.RefObject<HTMLImageElement | null>
  crop: CropArea
  setCrop: (updater: (prev: CropArea) => CropArea) => void
  scaleX: number
  scaleY: number
  isDragging: boolean
  setIsDragging: (value: boolean) => void
  lastMousePosition: Position
  setLastMousePosition: (pos: Position) => void
}

export const useCropDrag = ({
  imgRef,
  crop,
  setCrop,
  scaleX,
  scaleY,
  isDragging,
  setIsDragging,
  lastMousePosition,
  setLastMousePosition,
}: UseCropDragParams) => {
  const handleMouseDownDrag = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setIsDragging(true)
      const rect = imgRef.current?.getBoundingClientRect()
      if (!rect) return
      setLastMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    },
    [imgRef, setIsDragging, setLastMousePosition]
  )

  const handleMouseMoveDrag = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !imgRef.current) return
      const rect = imgRef.current.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top
      const deltaX = (mouseX - lastMousePosition.x) * scaleX
      const deltaY = (mouseY - lastMousePosition.y) * scaleY

      let newX = crop.x + deltaX
      let newY = crop.y + deltaY

      const img = imgRef.current
      newX = Math.max(0, Math.min(newX, img.width * scaleX - crop.width))
      newY = Math.max(0, Math.min(newY, img.height * scaleY - crop.height))

      setCrop((prev) => ({ ...prev, x: newX, y: newY }))
      setLastMousePosition({ x: mouseX, y: mouseY })
    },
    [
      isDragging,
      imgRef,
      lastMousePosition,
      crop,
      scaleX,
      scaleY,
      setCrop,
      setLastMousePosition,
    ]
  )

  useEffect(() => {
    if (!isDragging) return

    const onMouseUp = () => {
      setIsDragging(false)
      window.removeEventListener('mousemove', handleMouseMoveDrag)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('mouseleave', onMouseUp)
    }

    window.addEventListener('mousemove', handleMouseMoveDrag)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('mouseleave', onMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMoveDrag)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('mouseleave', onMouseUp)
    }
  }, [isDragging, handleMouseMoveDrag, setIsDragging])

  return { handleMouseDownDrag }
}
