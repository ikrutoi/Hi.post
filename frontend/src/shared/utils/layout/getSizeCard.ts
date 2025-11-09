import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import { roundTo } from '../../helpers'
import type { SizeCard } from '@layout/domain/types'

export const getSizeCard = (size: SizeCard, sizeMiniCard: SizeCard) => {
  const rawHeight =
    (size.height - sizeMiniCard.height) * CARD_SCALE_CONFIG.scaleCardHeight
  const rawWidth = rawHeight * CARD_SCALE_CONFIG.aspectRatio

  return {
    width: roundTo.nearest(rawWidth),
    height: roundTo.nearest(rawHeight),
  }
}
