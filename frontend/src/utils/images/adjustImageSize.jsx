export const adjustImageSize = (img, containerWidth, containerHeight) => {
  const imgWidth = img.naturalWidth
  const imgHeight = img.naturalHeight
  const widthRatio = containerWidth / imgWidth
  const heightRatio = containerHeight / imgHeight
  const bestRatio = Math.min(widthRatio, heightRatio)

  const newWidth = imgWidth * bestRatio
  const newHeight = imgHeight * bestRatio

  return { width: newWidth, height: newHeight }
}
