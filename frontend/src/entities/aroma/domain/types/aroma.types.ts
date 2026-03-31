import img100_01 from '../../assets/100_01.png'
import img101_01 from '../../assets/101_01.png'
import img102_01 from '../../assets/102_01.png'
import img103_01 from '../../assets/103_01.png'

export const AROMA_IMAGES: Partial<Record<string, string>> = {
  '00': img100_01,
  // '100_01': img100_01,
  '101_01': img101_01,
  '102_01': img102_01,
  '103_01': img103_01,
}

export const aromaIndexes = [
  '00',
  '100_01',
  '101_01',
  '102_01',
  '103_01',
  '__e1',
  '__e2',
  '__e3',
  '__e4',
  '__e5',
  /** @deprecated сохранённые открытки */
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '20',
  '21',
  '22',
  '23',
  '24',
  '25',
] as const

export type AromaImageIndex = (typeof aromaIndexes)[number]

export interface AromaItem {
  make: string
  name: string
  index: AromaImageIndex
  category?: 'male' | 'female' | 'unisex'
}

export interface AromaState {
  selectedAroma: AromaItem | null
  isComplete: boolean
}
