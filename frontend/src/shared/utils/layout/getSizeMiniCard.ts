import { roundTo } from '../../helpers'
import type { SizeCard } from '@layout/domain/types'

export interface SplitHeightResult {
  cardPanelHeight: number
  sectionEditorHeight: number
}

const MINI_CARD_HEIGHT_RATIO = 0.75

export const getSizeMiniCard = (size: { width: number; height: number }) => {
  const resultSide = size.height * MINI_CARD_HEIGHT_RATIO

  return {
    width: roundTo.nearest(resultSide),
    height: roundTo.nearest(resultSide),
  }
}
