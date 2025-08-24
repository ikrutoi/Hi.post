import type { ImageState } from '../../domain/model/types'

export const downloadImage = (image: ImageState): void => {
  if (!image.url) return

  const link = document.createElement('a')
  link.href = image.url
  link.download = `${image.source || 'image'}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
