import { processPresetsCards } from './processPresetsCards'
import type { Postcard } from '@entities/postcard'

export function preparePresets(
  records: Postcard[],
  getName: (record: Postcard) => string
) {
  const { sortedRecords, letterIndexList } = processPresetsCards(
    records,
    getName
  )
  return { sortedRecords, letterIndexList }
}
