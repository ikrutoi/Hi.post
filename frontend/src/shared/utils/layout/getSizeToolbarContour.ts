import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import { roundTo } from '../../helpers'

export const getSizeToolbarContour = (
  size: { width: number; height: number },
  remSize: number,
) => {
  const height = size.height + 6 * remSize
  const width = Number(
    (size.height * CARD_SCALE_CONFIG.aspectRatio + 6 * 1.42 * remSize).toFixed(
      2,
    ),
  )

  return {
    width: roundTo.nearest(width),
    height: roundTo.nearest(height),
  }
}
