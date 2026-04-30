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

/** Всего 9 ячеек: 0 — без аромата, 1…8 — выбранный слот (данные аромата на сервере). */
export const AROMA_CELL_COUNT = 9 as const

export const aromaSlotOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const

export type AromaSlot = (typeof aromaSlotOrder)[number]

export const AROMA_IMAGES: Record<AromaSlot, string> = {
  0: img100_11,
  1: img303_11,
  2: img308_11,
  3: img302_11,
  4: img307_11,
  5: img306_11,
  6: img305_11,
  7: img301_11,
  8: img310_11,
}

export interface AromaItem {
  index: AromaSlot
}

export interface AromaState {
  selectedAroma: AromaItem | null
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

/**
 * Приводит значение из Redux / IndexedDB к текущему виду (раньше были строки `empty` / `01`… и поля make/name).
 */
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
