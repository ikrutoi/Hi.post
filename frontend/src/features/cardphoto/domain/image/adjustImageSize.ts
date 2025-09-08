export interface ImageSize {
  width: number
  height: number
}

export const adjustImageSize = (
  img: HTMLImageElement,
  containerWidth: number,
  containerHeight: number
): ImageSize => {
  const imgWidth = img.naturalWidth
  const imgHeight = img.naturalHeight

  const widthRatio = containerWidth / imgWidth
  const heightRatio = containerHeight / imgHeight
  const bestRatio = Math.min(widthRatio, heightRatio)

  return {
    width: imgWidth * bestRatio,
    height: imgHeight * bestRatio,
  }
}
