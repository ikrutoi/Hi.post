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
import img118_22 from '../../assets/118_22.png'
import img119_22 from '../../assets/119_22.png'
import img120_22 from '../../assets/120_22.png'
import img121_22 from '../../assets/121_22.png'
import img122_22 from '../../assets/122_22.png'
import img123_22 from '../../assets/123_22.png'
import img124_22 from '../../assets/124_22.png'
import img125_22 from '../../assets/125_22.png'
import img126_22 from '../../assets/126_22.png'
import img127_22 from '../../assets/127_22.png'
import img100_11 from '../../assets/300_11.png'
import img301_11 from '../../assets/301_11.png'
import img302_11 from '../../assets/302_11.png'
import img303_11 from '../../assets/303_11.png'
import img304_11 from '../../assets/304_11.png'
import img305_11 from '../../assets/305_11.png'
import img306_11 from '../../assets/306_11.png'
import img307_11 from '../../assets/307_11.png'
import img308_11 from '../../assets/308_11.png'
import img309_11 from '../../assets/309_11.png'
import img310_11 from '../../assets/310_11.png'

export const AROMA_IMAGES: Partial<Record<string, string>> = {
  empty: img100_11,
  '01': img303_11,
  '02': img308_11,
  '03': img302_11,
  '04': img307_11,
  '05': img306_11,
  '06': img305_11,
  '07': img301_11,
  '08': img310_11,
}

export const aromaIndexes = [
  'empty',
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
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
