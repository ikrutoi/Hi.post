export const getCroppedImage = (imgRef, crop, sizeCard, scaleX, scaleY) => {
  const canvas = document.createElement('canvas')
  const img = imgRef.current

  canvas.width = sizeCard.width
  canvas.height = sizeCard.height
  const ctx = canvas.getContext('2d')

  ctx.drawImage(
    img,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    canvas.width,
    canvas.height
  )

  return canvas.toDataURL('image/png')
}
