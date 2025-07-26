import { handleMouseMoveDrag } from './handleMouseMoveDrag'
import { handleMouseUpDrag } from './handleMouseUpDrag'

export const handleMouseDownDrag = (
  e,
  setIsDragging,
  imgRef,
  setLastMousePosition,
  isResizing
) => {
  if (isResizing) return
  setIsDragging(true)
  const containerRect = imgRef.current.getBoundingClientRect()
  const mouseX = e.clientX - containerRect.left
  const mouseY = e.clientY - containerRect.top
  setLastMousePosition({ x: mouseX, y: mouseY })

  window.addEventListener('mousemove', handleMouseMoveDrag)
  window.addEventListener('mouseup', handleMouseUpDrag)
  window.addEventListener('mouseleave', handleMouseUpDrag)
}
