import { PresetLetterItem } from '../../domain/types'
import type { SectionPresetRow } from './sectionPresetRow'
import { sectionPresetRowId } from './sectionPresetRow'

export const processPresetsCards = (
  records: SectionPresetRow[],
  getName: (record: SectionPresetRow) => string
): {
  sortedRecords: SectionPresetRow[]
  letterIndexList: PresetLetterItem[]
} => {
  const sortedRecords = records.sort((a, b) =>
    getName(a).localeCompare(getName(b))
  )

  const letterIndexList = sortedRecords.map((record, i) => ({
    letter: getName(record)[0],
    id: sectionPresetRowId(record),
    index: i,
  }))

  letterIndexList.push(letterIndexList[letterIndexList.length - 1])

  return { sortedRecords, letterIndexList }
}
