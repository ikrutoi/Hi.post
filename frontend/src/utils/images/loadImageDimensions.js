export const loadImageDimensions = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = src
    img.onload = () => resolve({ width: img.width, height: img.height })
    img.onerror = (err) => reject(err)
  })
}
