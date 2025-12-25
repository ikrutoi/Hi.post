import type { ImageMeta } from '@cardphoto/domain/types'

const modules = import.meta.glob('./*.jpg', { eager: true })

export const STOCK_IMAGES: ImageMeta[] = Object.entries(modules).map(
  ([path, mod]) => {
    const fileName = path.replace('./', '').replace('.jpg', '')
    return {
      id: `stock-${fileName}`,
      source: 'stock',
      role: 'original',
      url: (mod as { default: string }).default,
      timestamp: Date.now(),
      width: 1313,
      height: 925,
    }
  }
)
