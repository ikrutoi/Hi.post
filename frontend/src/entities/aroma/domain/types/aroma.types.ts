import imgNl101 from '../../assets/nl_101.png'
import imgNl101Thumb from '../../assets/nl_101_thumb.png'
import imgNl200 from '../../assets/nl_200.png'
import imgNl200Thumb from '../../assets/nl_200_thumb.png'
import imgNl300 from '../../assets/nl_300.png'
import imgNl300Thumb from '../../assets/nl_300_thumb.png'
import imgNl400 from '../../assets/nl_400.png'
import imgNl400Thumb from '../../assets/nl_400_thumb.png'
import imgNl500 from '../../assets/nl_500.png'
import imgNl500Thumb from '../../assets/nl_500_thumb.png'
import imgNl600 from '../../assets/nl_600.png'
import imgNl600Thumb from '../../assets/nl_600_thumb.png'
import imgNl700 from '../../assets/nl_700.png'
import imgNl700Thumb from '../../assets/nl_700_thumb.png'
import imgNl800 from '../../assets/nl_800.png'
import imgNl800Thumb from '../../assets/nl_800_thumb.png'
import imgNl900 from '../../assets/nl_900.png'
import imgNl900Thumb from '../../assets/nl_900_thumb.png'

export const AROMA_CELL_COUNT = 9 as const

export const aromaSlotOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const

export type AromaSlot = (typeof aromaSlotOrder)[number]

/** Full assets — сетка аромы и упрощённый peek на всю секцию. */
export const AROMA_IMAGES: Record<AromaSlot, string> = {
  0: imgNl101,
  1: imgNl200,
  2: imgNl300,
  3: imgNl400,
  4: imgNl500,
  5: imgNl600,
  6: imgNl700,
  7: imgNl800,
  8: imgNl900,
}

/**
 * Thumb для CardPie / mini — меньше decode.
 */
export const AROMA_IMAGES_THUMB: Record<AromaSlot, string> = {
  0: imgNl101Thumb,
  1: imgNl200Thumb,
  2: imgNl300Thumb,
  3: imgNl400Thumb,
  4: imgNl500Thumb,
  5: imgNl600Thumb,
  6: imgNl700Thumb,
  7: imgNl800Thumb,
  8: imgNl900Thumb,
}

export interface AromaItem {
  index: AromaSlot
}

export interface AromaState {
  selectedAroma: AromaItem | null
  /** Draft for CardPie preview and tile highlight; applied only via apply toolbar. */
  viewAroma: AromaItem | null
  isComplete: boolean
}

const LEGACY_STRING_SLOT: Record<string, AromaSlot> = {
  empty: 0,
  '01': 1,
  '02': 2,
  '03': 3,
  '04': 4,
  '05': 5,
  '06': 6,
  '07': 7,
  '08': 8,
}

export function normalizeAromaItem(raw: unknown): AromaItem {
  if (raw == null || typeof raw !== 'object') return { index: 0 }
  const o = raw as { index?: unknown; make?: unknown }
  if (typeof o.index === 'number' && o.index >= 0 && o.index <= 8) {
    return { index: o.index as AromaSlot }
  }
  if (typeof o.index === 'string') {
    const key = o.index.trim()
    if (key in LEGACY_STRING_SLOT) return { index: LEGACY_STRING_SLOT[key]! }
    const n = Number.parseInt(key, 10)
    if (!Number.isNaN(n) && n >= 0 && n <= 8) return { index: n as AromaSlot }
  }
  if (o.make === '0') return { index: 0 }
  return { index: 0 }
}
