import img100_11 from '../../assets/300_11.png'
import img301_11 from '../../assets/301_11.png'
import img302_11 from '../../assets/302_11.png'
import img303_11 from '../../assets/303_11.png'
import img304_11 from '../../assets/304_11.png'
import img305_11 from '../../assets/305_11.png'
import img306_11 from '../../assets/306_11.png'
import img307_11 from '../../assets/307_11.png'
import img308_11 from '../../assets/308_11.png'
import img310_11 from '../../assets/310_11.png'
import img311_11 from '../../assets/311_11.png'
import img312_11 from '../../assets/312_11.png'
import img313_11 from '../../assets/313_11.png'
import img314_11 from '../../assets/314_11.png'

export const AROMA_CELL_COUNT = 9 as const

export const aromaSlotOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const

export type AromaSlot = (typeof aromaSlotOrder)[number]

export const AROMA_IMAGES: Record<AromaSlot, string> = {
  0: img100_11,
  1: img314_11,
  2: img303_11,
  3: img302_11,
  4: img307_11,
  5: img306_11,
  6: img305_11,
  7: img301_11,
  8: img311_11,
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
