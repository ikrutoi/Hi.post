import { SectionPreset, PresetLetterInfo } from '../../domain/types'

export const processPresetsCards = (
  records: SectionPreset[],
  getName: (card: SectionPreset) => string
): { sortedRecords: SectionPreset[]; firstLetterList: PresetLetterInfo[] } => {
  const sortedRecords = records.sort((a, b) =>
    getName(a).localeCompare(getName(b))
  )

  const firstLetterList = sortedRecords.map((card, i) => ({
    letter: getName(card)[0],
    id: card.id,
    index: i,
  }))

  firstLetterList.push(firstLetterList[firstLetterList.length - 1])

  return { sortedRecords, firstLetterList }
}
