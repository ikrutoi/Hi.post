export interface CropRect {
  x: number
  y: number
  width: number
  height: number
}

export interface MousePosition {
  x: number
  y: number
}

export const performDragInteraction = (
  e: MouseEvent,
  isDragging: boolean,
  imgRef: React.RefObject<HTMLImageElement>,
  scaleX: number,
  scaleY: number,
  lastMousePosition: MousePosition,
  crop: CropRect,
  setCrop: (crop: CropRect) => void,
  setLastMousePosition: (pos: MousePosition) => void
): void => {
  if (!isDragging || !imgRef.current) return

  const containerRect = imgRef.current.getBoundingClientRect()
  const mouseX = e.clientX - containerRect.left
  const mouseY = e.clientY - containerRect.top
  const deltaX = (mouseX - lastMousePosition.x) * scaleX
  const deltaY = (mouseY - lastMousePosition.y) * scaleY

  let newX = crop.x + deltaX
  let newY = crop.y + deltaY
  const img = imgRef.current

  if (newX < 0) newX = 0
  if (newY < 0) newY = 0
  if (newX + crop.width > img.width * scaleX)
    newX = img.width * scaleX - crop.width
  if (newY + crop.height > img.height * scaleY)
    newY = img.height * scaleY - crop.height

  setCrop({ ...crop, x: newX, y: newY })
  setLastMousePosition({ x: mouseX, y: mouseY })
}
