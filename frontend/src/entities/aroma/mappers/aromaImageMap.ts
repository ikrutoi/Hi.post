import { AromaImageIndex } from '../domain/aromaTypes'

import img00 from '../assets/no-parfum.png'
import img10 from '../assets/10.png'
import img11 from '../assets/11.png'
import img12 from '../assets/12.png'
import img13 from '../assets/13.png'
import img14 from '../assets/14.png'
import img15 from '../assets/15.png'
import img20 from '../assets/20.png'
import img21 from '../assets/21.png'
import img22 from '../assets/22.png'
import img23 from '../assets/23.png'
import img24 from '../assets/24.png'
import img25 from '../assets/25.png'

const fallbackImage = img00

export const aromaImageMap: Record<AromaImageIndex, string> = {
  '00': img00,
  '10': img10,
  '11': img11,
  '12': img12,
  '13': img13,
  '14': img14,
  '15': img15,
  '20': img20,
  '21': img21,
  '22': img22,
  '23': img23,
  '24': img24,
  '25': img25,
}

export const getAromaImage = (index: string): string => {
  return aromaImageMap[index as AromaImageIndex] ?? fallbackImage
}
