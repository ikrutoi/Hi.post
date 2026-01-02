export function calculateCropPosition(
  cropLeft: number,
  cropTop: number,
  aspectRatio: number,
  imageAspectRatio: number,
  imageLeft: number,
  imageTop: number
) {
  if (imageAspectRatio === aspectRatio) return { x: cropLeft, y: cropTop }
  if (imageAspectRatio < aspectRatio)
    return { x: cropLeft + imageLeft, y: cropTop }
  if (imageAspectRatio > aspectRatio)
    return { x: cropLeft, y: cropTop + imageTop }
  return { x: cropLeft, y: cropTop }
}
