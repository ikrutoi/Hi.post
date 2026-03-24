import { STOCK_IMAGES } from '@shared/assets/stock'
import type { ImageMeta } from '@cardphoto/domain/types'

export function getRandomStockMeta(): ImageMeta {
  const index = Math.floor(Math.random() * STOCK_IMAGES.length)
  return STOCK_IMAGES[index]
}

export function* cardphotoHistorySaga() {
  // Legacy saga disabled: random stock autoload on init is no longer used.
}
