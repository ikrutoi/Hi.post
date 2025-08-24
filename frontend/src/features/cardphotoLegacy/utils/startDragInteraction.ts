import { performDragInteraction } from './performDragInteraction'
import { endDragInteraction } from './endDragInteraction'
import type { CropRect, MousePosition } from '../types'

export const startDragInteraction = (
  e: MouseEvent,
  setIsDragging: (value: boolean) => void,
  imgRef: React.RefObject<HTMLImageElement>,
  setLastMousePosition: (pos: MousePosition) => void,
  isResizing: boolean,
  scaleX: number,
  scaleY: number,
  crop: CropRect,
  setCrop: (crop: CropRect) => void
): void => {
  if (isResizing || !imgRef.current) return
  setIsDragging(true)

  const containerRect = imgRef.current.getBoundingClientRect()
  const mouseX = e.clientX - containerRect.left
  const mouseY = e.clientY - containerRect.top
  setLastMousePosition({ x: mouseX, y: mouseY })

  const moveHandler = (event: MouseEvent) => {
    performDragInteraction(
      event,
      true,
      imgRef,
      scaleX,
      scaleY,
      { x: mouseX, y: mouseY },
      crop,
      setCrop,
      setLastMousePosition
    )
  }

  const upHandler = () => {
    endDragInteraction(setIsDragging)
    window.removeEventListener('mousemove', moveHandler)
    window.removeEventListener('mouseup', upHandler)
    window.removeEventListener('mouseleave', upHandler)
  }

  window.addEventListener('mousemove', moveHandler)
  window.addEventListener('mouseup', upHandler)
  window.addEventListener('mouseleave', upHandler)
}
