export const resizeImage = async (
  blob: Blob,
  width: number,
  height: number
): Promise<Blob> => {
  const imageBitmap = await createImageBitmap(blob)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas context not available')

  ctx.drawImage(imageBitmap, 0, 0, width, height)

  return new Promise((resolve, reject) => {
    canvas.toBlob((resizedBlob) => {
      if (resizedBlob) resolve(resizedBlob)
      else reject(new Error('Failed to create resized image'))
    }, 'image/jpeg')
  })
}
