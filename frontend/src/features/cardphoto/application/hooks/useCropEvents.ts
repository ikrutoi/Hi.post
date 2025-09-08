import { useCallback, useEffect } from 'react'

interface Position {
  x: number
  y: number
}

interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

interface UseCropEventsParams {
  imgRef: React.RefObject<HTMLImageElement>
  crop: CropArea
  setCrop: (updater: (prev: CropArea) => CropArea) => void
  scaleX: number
  scaleY: number
  aspectRatio: number
  isResizing: boolean
  setIsResizing: (value: boolean) => void
  isDragging: boolean
  setIsDragging: (value: boolean) => void
  lastMousePosition: Position
  setLastMousePosition: (pos: Position) => void
}

export const useCropEvents = ({
  imgRef,
  crop,
  setCrop,
  scaleX,
  scaleY,
  aspectRatio,
  isResizing,
  setIsResizing,
  isDragging,
  setIsDragging,
  lastMousePosition,
  setLastMousePosition,
}: UseCropEventsParams) => {
  const handleMouseDownDrag = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isResizing) return
      setIsDragging(true)

      const containerRect = imgRef.current?.getBoundingClientRect()
      if (!containerRect) return

      const mouseX = e.clientX - containerRect.left
      const mouseY = e.clientY - containerRect.top
      setLastMousePosition({ x: mouseX, y: mouseY })
    },
    [isResizing, imgRef, setIsDragging, setLastMousePosition]
  )

  const handleMouseMoveDrag = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !imgRef.current) return

      const containerRect = imgRef.current.getBoundingClientRect()
      const mouseX = e.clientX - containerRect.left
      const mouseY = e.clientY - containerRect.top
      const deltaX = (mouseX - lastMousePosition.x) * scaleX
      const deltaY = (mouseY - lastMousePosition.y) * scaleY

      let newX = crop.x + deltaX
      let newY = crop.y + deltaY

      if (newX < 0) newX = 0
      if (newY < 0) newY = 0
      if (newX + crop.width > imgRef.current.width * scaleX)
        newX = imgRef.current.width * scaleX - crop.width
      if (newY + crop.height > imgRef.current.height * scaleY)
        newY = imgRef.current.height * scaleY - crop.height

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

  useEffect(() => {
    if (!isDragging) return

    window.addEventListener('mousemove', handleMouseMoveDrag)
    const onMouseUp = () => {
      setIsDragging(false)
      window.removeEventListener('mousemove', handleMouseMoveDrag)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('mouseleave', onMouseUp)
    }

    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('mouseleave', onMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMoveDrag)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('mouseleave', onMouseUp)
    }
  }, [isDragging, handleMouseMoveDrag, setIsDragging])

  return {
    handleMouseDownDrag,
    handleMouseDownResize,
  }
}
