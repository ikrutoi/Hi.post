export function calculateCropPosition(
  cropLeft: number,
  cropTop: number,
  aspectRatio: number,
  imageAspectRatio: number,
  imageLeft: number,
  imageTop: number
) {
  if (imageAspectRatio === aspectRatio) return { left: cropLeft, top: cropTop }
  if (imageAspectRatio < aspectRatio)
    return { left: cropLeft + imageLeft, top: cropTop }
  if (imageAspectRatio > aspectRatio)
    return { left: cropLeft, top: cropTop + imageTop }
  return { left: cropLeft, top: cropTop }
}
