export const resizeImage = (
  blob: Blob,
  width = 128,
  height = 90
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = URL.createObjectURL(blob)

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('Canvas context is null'))

      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob((resizedBlob) => {
        if (resizedBlob) {
          resolve(URL.createObjectURL(resizedBlob))
        } else {
          reject(new Error('Failed to resize image'))
        }
      }, blob.type)
    }

    img.onerror = (e) => reject(e)
  })
}
