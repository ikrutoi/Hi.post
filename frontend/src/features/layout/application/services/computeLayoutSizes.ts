import { calculateSizeCard } from '../../../../shared/utils/layout/calculateSizeCard'
import { calculateMaxCardsList } from '../../../../shared/utils/layout/calculateMaxCardsList'
import { cardScaleFactors } from 'shared-legacy/config/layout/cardScaleFactors'
import type { SizeCard } from '@features/layout/domain/types/layout.types'

interface ComputeLayoutSizesParams {
  containerHeight: number
  containerWidth: number
  remSize: number
}

export interface ComputedLayoutSizes {
  cardSize: SizeCard
  miniCardSize: SizeCard
  maxCardsList: number
}

export const computeLayoutSizes = ({
  containerHeight,
  containerWidth,
  remSize,
}: ComputeLayoutSizesParams): ComputedLayoutSizes => {
  const cardSize = calculateSizeCard(containerHeight, cardScaleFactors.card)
  const miniCardSize = calculateSizeCard(
    containerHeight,
    cardScaleFactors.miniCard
  )

  const maxCardsList = calculateMaxCardsList(
    containerWidth,
    remSize,
    miniCardSize.height ?? 0
  )

  return { cardSize, miniCardSize, maxCardsList }
}
