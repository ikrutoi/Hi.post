/**
 * Цвета марки `stamp_aroma_99` по серии аромата.
 * Верх `logo` во всех сериях чёрный и в константу не входит.
 * Серии без своей палитры берут цвета 400 — они стоят в SVG по умолчанию.
 */
export type StampAroma99Colors = {
  /** Низ градиента `logo`. */
  logoDown: string
  /** Верх градиента `background`. */
  backgroundUp: string
  /** Низ градиента `background`. */
  backgroundDown: string
  /** Общая заливка `count` и `hi`. */
  countHi: string
}

export const AROMA_SERIES_BY_SLOT = [
  101, 200, 300, 400, 500, 600, 700, 800, 900,
] as const

export const STAMP_AROMA_99_COLORS = {
  300: {
    logoDown: '#05FFFF',
    backgroundUp: '#83C5C4',
    backgroundDown: '#2E7C84',
    countHi: '#026262',
  },
  400: {
    logoDown: '#DE8E93',
    backgroundUp: '#FAF2EB',
    backgroundDown: '#DFADB3',
    countHi: '#543638',
  },
  500: {
    logoDown: '#0561FF',
    backgroundUp: '#F4E591',
    backgroundDown: '#CB9925',
    countHi: '#022561',
  },
  600: {
    logoDown: '#C9C08C',
    backgroundUp: '#C5C0BC',
    backgroundDown: '#817E7D',
    countHi: '#4D4A36',
  },
  800: {
    logoDown: '#16DE66',
    backgroundUp: '#F4BB2C',
    backgroundDown: '#F56B02',
    countHi: '#085427',
  },
  900: {
    logoDown: '#E60CA5',
    backgroundUp: '#CCFF66',
    backgroundDown: '#3996FC',
    countHi: '#57053F',
  },
} as const satisfies Record<number, StampAroma99Colors>

const DEFAULT_SERIES = 400

export function stampAroma99ColorsForSlot(
  slot: number | null | undefined,
): StampAroma99Colors | null {
  if (slot == null || !Number.isInteger(slot)) return null
  const series = AROMA_SERIES_BY_SLOT[slot]
  if (series == null) return null
  return (
    STAMP_AROMA_99_COLORS[series as keyof typeof STAMP_AROMA_99_COLORS] ??
    STAMP_AROMA_99_COLORS[DEFAULT_SERIES]
  )
}
