import { PresetLetterItem } from '../../domain/types'
import type { CartItem } from '@entities/cart/domain/types'

export const processPresetsCards = (
  records: CartItem[],
  getName: (card: CartItem) => string
): { sortedRecords: CartItem[]; letterIndexList: PresetLetterItem[] } => {
  const sortedRecords = records.sort((a, b) =>
    getName(a).localeCompare(getName(b))
  )

  const letterIndexList = sortedRecords.map((card, i) => ({
    letter: getName(card)[0],
    id: card.id,
    index: i,
  }))

  letterIndexList.push(letterIndexList[letterIndexList.length - 1])

  return { sortedRecords, letterIndexList }
}
