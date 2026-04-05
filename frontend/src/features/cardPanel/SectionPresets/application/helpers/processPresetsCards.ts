import { PresetLetterItem } from '../../domain/types'
import type { Postcard } from '@entities/cart/domain/types'

export const processPresetsCards = (
  records: Postcard[],
  getName: (record: Postcard) => string
): { sortedRecords: Postcard[]; letterIndexList: PresetLetterItem[] } => {
  const sortedRecords = records.sort((a, b) =>
    getName(a).localeCompare(getName(b))
  )

  const letterIndexList = sortedRecords.map((record, i) => ({
    letter: getName(record)[0],
    id: String(record.LocalId),
    index: i,
  }))

  letterIndexList.push(letterIndexList[letterIndexList.length - 1])

  return { sortedRecords, letterIndexList }
}
