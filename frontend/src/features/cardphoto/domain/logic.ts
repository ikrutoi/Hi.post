export const base64ToBlob = (base64: string, mimeType: string): Blob => {
  const byteString = atob(base64.split(',')[1])
  const arrayBuffer = new ArrayBuffer(byteString.length)
  const intArray = new Uint8Array(arrayBuffer)

  for (let i = 0; i < byteString.length; i++) {
    intArray[i] = byteString.charCodeAt(i)
  }

  return new Blob([intArray], { type: mimeType })
}

export const shouldShowToolbar = (clipId: string | null): boolean => {
  const hiddenModes = ['cart', 'minimize', 'drafts']
  return clipId !== null && !hiddenModes.includes(clipId)
}

export const checkImages = (
  base: { id: string }[]
): {
  originalImage: boolean
  workingImage: boolean
  miniImage: boolean
} => {
  const miniImage = base.some((image) => image.id === 'miniImage')
  const workingImage = base.some((image) => image.id === 'workingImage')
  const originalImage = base.some((image) => image.id === 'originalImage')
  return { originalImage, workingImage, miniImage }
}

export const checkStartImage = (
  base: { id: string }[],
  baseName: 'stockImages' | 'userImages'
): { base: string; source: string } | null => {
  const workingImage = base.find((image) => image.id === 'workingImage')
  const originalImage = base.find((image) => image.id === 'originalImage')
  if (workingImage) return { base: baseName, source: 'workingImage' }
  if (originalImage) return { base: baseName, source: 'originalImage' }
  return null
}
