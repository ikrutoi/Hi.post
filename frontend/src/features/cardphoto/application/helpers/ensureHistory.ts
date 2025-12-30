import type { ImageHistory, ImageMeta } from '../../domain/types'

export function ensureHistory(
  history: ImageHistory | null,
  activeImage?: ImageMeta | null
): ImageHistory {
  if (!history && activeImage) {
    return {
      original: {
        id: activeImage.id,
        source: activeImage.source,
        url: activeImage.url,
      },
      operations: [{ type: 'initial' }],
      activeIndex: 0,
    }
  }
  return history!
}
