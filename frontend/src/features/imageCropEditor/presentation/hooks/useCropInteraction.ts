import type {
  CropRect,
  MousePosition,
} from '../../domain/types/imageCrop.types'

interface UseCropInteractionParams {
  imgRef: React.RefObject<HTMLImageElement>
  scaleX: number
  scaleY: number
  crop: CropRect
  setCrop: (crop: CropRect) => void
  setIsDragging: (v: boolean) => void
  setLastMousePosition: (pos: MousePosition) => void
  isResizing: boolean
}

export const useCropInteraction = ({
  imgRef,
  scaleX,
  scaleY,
  crop,
  setCrop,
  setIsDragging,
  setLastMousePosition,
  isResizing,
  setIsResizing,
}: UseCropInteractionParams & { setIsResizing: (v: boolean) => void }) => {
  const handleMouseDownDrag = (e: React.MouseEvent<HTMLDivElement>): void => {
    setIsDragging(true)
    const rect = imgRef.current?.getBoundingClientRect()
    if (!rect) return
    setLastMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const handleMouseMoveDrag = (
    e: React.MouseEvent<HTMLDivElement>,
    isDragging: boolean,
    lastMousePosition: MousePosition
  ): void => {
    if (!isDragging || isResizing || !imgRef.current) return

    const rect = imgRef.current.getBoundingClientRect()
    const currentX = e.clientX - rect.left
    const currentY = e.clientY - rect.top

    const deltaX = (currentX - lastMousePosition.x) * scaleX
    const deltaY = (currentY - lastMousePosition.y) * scaleY

    setCrop({
      ...crop,
      x: crop.x + deltaX,
      y: crop.y + deltaY,
    })

    setLastMousePosition({ x: currentX, y: currentY })
  }

  const handleMouseUpDrag = (): void => {
    setIsDragging(false)
  }

  const handleMouseDownResize = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation()
    setIsResizing(true)
    const rect = imgRef.current?.getBoundingClientRect()
    if (!rect) return
    setLastMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const handleMouseMoveResize = (
    e: React.MouseEvent<HTMLDivElement>,
    lastMousePosition: MousePosition
  ): void => {
    if (!isResizing || !imgRef.current) return

    const rect = imgRef.current.getBoundingClientRect()
    const currentX = e.clientX - rect.left
    const currentY = e.clientY - rect.top

    const deltaX = (currentX - lastMousePosition.x) * scaleX
    const deltaY = (currentY - lastMousePosition.y) * scaleY

    const newWidth = Math.max(20, crop.width + deltaX)
    const newHeight = Math.max(20, crop.height + deltaY)

    setCrop({
      ...crop,
      width: newWidth,
      height: newHeight,
    })

    setLastMousePosition({ x: currentX, y: currentY })
  }

  const handleMouseUpResize = (): void => {
    setIsResizing(false)
  }

  return {
    handleMouseDownDrag,
    handleMouseMoveDrag,
    handleMouseUpDrag,
    handleMouseDownResize,
    handleMouseMoveResize,
    handleMouseUpResize,
  }
}
