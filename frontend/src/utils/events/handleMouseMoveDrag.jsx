export const handleMouseMoveDrag = (
  e,
  isDragging,
  imgRef,
  scaleX,
  scaleY,
  lastMousePosition,
  crop,
  setCrop,
  setLastMousePosition
) => {
  if (!isDragging) return
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

  setCrop((prevCrop) => ({
    ...prevCrop,
    x: newX,
    y: newY,
  }))

  setLastMousePosition({ x: mouseX, y: mouseY })
}
