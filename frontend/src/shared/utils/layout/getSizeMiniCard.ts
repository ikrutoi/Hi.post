import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import { roundTo } from '../../helpers'
import type { SizeCard } from '@layout/domain/types'

export interface SplitHeightResult {
  cardPanelHeight: number
  sectionEditorHeight: number
}

export const getSizeMiniCard = (size: SizeCard) => {
  const rawWidth = size.width / 7
  const rawHeight = rawWidth / CARD_SCALE_CONFIG.aspectRatio

  return {
    width: roundTo.nearest(rawWidth),
    height: roundTo.nearest(rawHeight),
  }
}
