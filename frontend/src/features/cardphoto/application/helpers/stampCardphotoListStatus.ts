import type { ImageMeta, ImageStatus } from '../../domain/types'

/** List membership is LWW-synced by `timestamp` / `updatedAt`. */
export function stampCardphotoListStatus(
  record: ImageMeta,
  status: Extract<ImageStatus, 'inLine' | 'outLine'>,
): ImageMeta {
  return {
    ...record,
    status,
    timestamp: Date.now(),
  }
}
