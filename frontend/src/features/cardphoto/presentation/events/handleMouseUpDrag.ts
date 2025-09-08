import { handleMouseMoveDrag } from './handleMouseMoveDrag'
import { handleMouseDownDrag } from './handleMouseDownDrag'

export const handleMouseUpDrag = (
  e: MouseEvent,
  setIsDragging: (value: boolean) => void
): void => {
  setIsDragging(false)

  window.removeEventListener('mousemove', handleMouseMoveDrag)
  window.removeEventListener('mouseup', () =>
    handleMouseUpDrag(e, setIsDragging)
  )
  window.removeEventListener('mouseleave', () =>
    handleMouseUpDrag(e, setIsDragging)
  )
}

// import { handleMouseMoveDrag } from './handleMouseMoveDrag'

// export const handleMouseUpDrag = (setIsDragging) => {
//   setIsDragging(false)

//   window.removeEventListener('mousemove', handleMouseMoveDrag)
//   window.removeEventListener('mouseup', handleMouseUpDrag)
//   window.removeEventListener('mouseleave', handleMouseUpDrag)
// }
