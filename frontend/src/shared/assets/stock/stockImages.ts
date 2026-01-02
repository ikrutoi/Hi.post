import type { ImageMeta } from '@cardphoto/domain/types'

const modules = import.meta.glob('./*.jpg', { eager: true })

export const STOCK_IMAGES: ImageMeta[] = Object.entries(modules).map(
  ([path, mod]) => {
    const fileName = path.replace('./', '').replace('.jpg', '')
    return {
      id: `stock-${fileName}`,
      source: 'stock',
      url: (mod as { default: string }).default,
      width: 1313,
      height: 925,
    }
  }
)
