export const centeringMaxCrop = (dimensions, aspectRatio) => {
  let x
  let y
  let width
  let height
  if (dimensions.width / dimensions.height > aspectRatio) {
    height = dimensions.height
    width = height * aspectRatio
    y = 0
    x = (dimensions.width - width) / 2
  }
  if (dimensions.width / dimensions.height <= aspectRatio) {
    width = dimensions.width
    height = width / aspectRatio
    x = 0
    y = (dimensions.height - height) / 2
  }
  return { x, y, width, height }
}
