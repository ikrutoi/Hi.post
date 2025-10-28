import { processPresetsCards } from './processPresetsCards'
import type { CartItem } from '@entities/cart/domain/types'

export function preparePresets(
  records: CartItem[],
  getName: (card: CartItem) => string
) {
  const { sortedRecords, letterIndexList } = processPresetsCards(
    records,
    getName
  )
  return { sortedRecords, letterIndexList }
}
