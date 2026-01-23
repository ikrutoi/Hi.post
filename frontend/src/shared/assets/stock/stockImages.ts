import { roundTo } from '@shared/utils/layout'
import type { ImageMeta } from '@cardphoto/domain/types'

const modules = import.meta.glob('./*.jpg', { eager: true })

export const STOCK_IMAGES: ImageMeta[] = Object.entries(modules).map(
  ([path, mod]) => {
    const fileName = path.replace('./', '').replace('.jpg', '')

    const width = 1313
    const height = 925

    return {
      id: `stock-${fileName}`,
      source: 'stock',
      url: (mod as { default: string }).default,
      width,
      height,
      imageAspectRatio: roundTo(width / height, 3),
      isCropped: true,
      timestamp: Date.now(),
    }
  },
)
