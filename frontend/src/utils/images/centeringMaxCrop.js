export const centeringMaxCrop = (dimensions, aspectRatio) => {
  const aspectRatioImageUser = Number(
    (dimensions.width / dimensions.height).toFixed(2)
  )
  let x
  let y
  let width
  let height
  if (aspectRatioImageUser > aspectRatio + aspectRatio * 0.1) {
    height = dimensions.height
    width = height * aspectRatio
    y = 0
    x = (dimensions.width - width) / 2
  }
  if (
    aspectRatioImageUser >= aspectRatio &&
    aspectRatioImageUser <= aspectRatio + aspectRatio * 0.1
  ) {
    width = dimensions.width * 0.95
    height = (width / aspectRatio) * 0.95
    x = dimensions.width * 0.025
    y = (dimensions.height - height) / 2
  }
  if (aspectRatioImageUser < aspectRatio) {
    width = dimensions.width
    height = width / aspectRatio
    x = 0
    y = (dimensions.height - height) / 2
  }
  return { x, y, width, height }
}
