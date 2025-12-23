import type { Role, ImageStore } from '../typesLayout'

export const checkImages = (base: { id: string }[]): Record<Role, boolean> => {
  const miniImage = base.some((image) => image.id === 'miniImage')
  const workingImage = base.some((image) => image.id === 'workingImage')
  const originalImage = base.some((image) => image.id === 'originalImage')
  return { originalImage, workingImage, miniImage }
}

export const checkStartImage = (
  base: { id: string }[],
  baseName: ImageStore
): { base: ImageStore; source: Role } | null => {
  const workingImage = base.find((image) => image.id === 'workingImage')
  const originalImage = base.find((image) => image.id === 'originalImage')
  if (workingImage) return { base: baseName, source: 'workingImage' }
  if (originalImage) return { base: baseName, source: 'originalImage' }
  return null
}
