import img100_02 from '../../assets/100_02.png'
import img111_01 from '../../assets/111_01.png'
import img112_01 from '../../assets/112_01.png'
import img113_02 from '../../assets/113_02.png'
import img114_01 from '../../assets/114_01.png'
import img115_01 from '../../assets/115_01.png'
import img100_22 from '../../assets/100_22.png'
import img111_22 from '../../assets/111_22.png'
import img112_22 from '../../assets/112_22.png'
import img113_22 from '../../assets/113_22.png'
import img114_22 from '../../assets/114_22.png'
import img115_22 from '../../assets/115_22.png'
import img116_22 from '../../assets/116_22.png'
import img117_22 from '../../assets/117_22.png'

export const AROMA_IMAGES: Partial<Record<string, string>> = {
  '100_22': img100_22,
  '111_22': img111_22,
  '112_22': img112_22,
  '113_22': img113_22,
  '114_22': img114_22,
  '115_22': img115_22,
  '116_22': img116_22,
  '117_22': img117_22,
}

export const aromaIndexes = [
  '100_22',
  '113_22',
  '114_22',
  '115_22',
  '111_22',
  '112_22',
  '116_22',
  '117_22',
  '__e3',
  '__e4',
  '__e5',
  '__e6',
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
