import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import { roundTo } from '../../helpers'
import type { SizeCard } from '@layout/domain/types'

export interface SplitHeightResult {
  cardPanelHeight: number
  sectionEditorHeight: number
}

export const getSizeMiniCard = (size: { width: number; height: number }) => {
  // const rawWidth = size.width * CARD_SCALE_CONFIG.scaleMiniCard
  // const rawHeight = rawWidth / CARD_SCALE_CONFIG.aspectRatio

  const resultSide = size.height * 0.6

  return {
    width: roundTo.nearest(resultSide),
    height: roundTo.nearest(resultSide),
  }
}
