import type { ImageHistory, ImageMeta, Orientation } from '../../domain/types'

export function ensureHistory(
  history: ImageHistory | null,
  activeImage?: ImageMeta | null
): ImageHistory {
  if (!history && activeImage) {
    return {
      original: activeImage,
      operations: [{ type: 'initial' }],
      activeIndex: 0,
      workingConfig: { orientation: 0 as Orientation, crop: null },
      lastApplied: null,
      finalImage: null,
    }
  }
  return history!
}
