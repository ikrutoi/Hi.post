import { handleMouseMoveDrag } from './handleMouseMoveDrag'

export const handleMouseUpDrag = (setIsDragging) => {
  setIsDragging(false)

  window.removeEventListener('mousemove', handleMouseMoveDrag)
  window.removeEventListener('mouseup', handleMouseUpDrag)
  window.removeEventListener('mouseleave', handleMouseUpDrag)
}
