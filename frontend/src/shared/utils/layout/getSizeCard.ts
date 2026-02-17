import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import { roundTo } from '../../helpers'
import type { SizeCard } from '@layout/domain/types'

export const getSizeCard = (
  sizeForm: { width: number; height: number },
  remSize: number,
) => {
  const rawHeight = sizeForm.height - 9 * remSize
  const rawWidth = rawHeight * CARD_SCALE_CONFIG.aspectRatio

  return {
    width: roundTo.nearest(rawWidth),
    height: roundTo.nearest(rawHeight),
  }
}
