import { processPresetsCards } from './processPresetsCards'
import type { SectionPresetRow } from './sectionPresetRow'

export function preparePresets(
  records: SectionPresetRow[],
  getName: (record: SectionPresetRow) => string
) {
  const { sortedRecords, letterIndexList } = processPresetsCards(
    records,
    getName
  )
  return { sortedRecords, letterIndexList }
}
