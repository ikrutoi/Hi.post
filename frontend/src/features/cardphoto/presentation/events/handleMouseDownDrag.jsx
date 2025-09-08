import { MouseEvent } from 'react'
import { handleMouseMoveDrag } from '../../../../utils/events/handleMouseMoveDrag'
import { handleMouseUpDrag } from '../../../../utils/events/handleMouseUpDrag'

interface Position {
  x: number
  y: number
}

export const handleMouseDownDrag = (
  e: MouseEvent<HTMLDivElement>,
  setIsDragging: (value: boolean) => void,
  imgRef: React.RefObject<HTMLDivElement>,
  setLastMousePosition: (pos: Position) => void,
  isResizing: boolean
): void => {
  if (isResizing) return

  setIsDragging(true)

  const containerRect = imgRef.current?.getBoundingClientRect()
  if (!containerRect) return

  const mouseX = e.clientX - containerRect.left
  const mouseY = e.clientY - containerRect.top
  setLastMousePosition({ x: mouseX, y: mouseY })

  window.addEventListener('mousemove', handleMouseMoveDrag)
  window.addEventListener('mouseup', handleMouseUpDrag)
  window.addEventListener('mouseleave', handleMouseUpDrag)
}


// import { handleMouseMoveDrag } from '../../../../utils/events/handleMouseMoveDrag'
// import { handleMouseUpDrag } from '../../../../utils/events/handleMouseUpDrag'

// export const handleMouseDownDrag = (
//   e,
//   setIsDragging,
//   imgRef,
//   setLastMousePosition,
//   isResizing
// ) => {
//   if (isResizing) return
//   setIsDragging(true)
//   const containerRect = imgRef.current.getBoundingClientRect()
//   const mouseX = e.clientX - containerRect.left
//   const mouseY = e.clientY - containerRect.top
//   setLastMousePosition({ x: mouseX, y: mouseY })

//   window.addEventListener('mousemove', handleMouseMoveDrag)
//   window.addEventListener('mouseup', handleMouseUpDrag)
//   window.addEventListener('mouseleave', handleMouseUpDrag)
// }
