import type { SizeCard } from '@layout/domain/types'

export const getMaxMiniCardsCount = (
  widthPanel: number,
  sizeMiniCard: SizeCard,
  remSize: number
): number | undefined => {
  if (!remSize || !widthPanel || !sizeMiniCard?.width) return 0

  return Math.floor(widthPanel / (sizeMiniCard.width + remSize))
}
