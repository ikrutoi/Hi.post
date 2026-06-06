export type PieScatterSlot = {
  x: number
  y: number
  fontSize: number
  rotate?: number
}

/** Слоты в координатах pattern envelope (как IconUsersV3). */
export const PIE_ENVELOPE_SCATTER_SLOTS: PieScatterSlot[] = [
  { x: 220, y: 480, fontSize: 300, rotate: -16 },
  { x: 980, y: 220, fontSize: 260, rotate: 12 },
  { x: 1680, y: 560, fontSize: 320, rotate: -7 },
  { x: 520, y: 920, fontSize: 280, rotate: 18 },
  { x: 1320, y: 1080, fontSize: 340, rotate: -11 },
  { x: 1960, y: 860, fontSize: 250, rotate: 9 },
  { x: 340, y: 1380, fontSize: 290, rotate: -20 },
  { x: 1120, y: 1560, fontSize: 310, rotate: 6 },
  { x: 1840, y: 1320, fontSize: 270, rotate: -13 },
  { x: 760, y: 1680, fontSize: 240, rotate: 15 },
  { x: 1520, y: 1760, fontSize: 300, rotate: -9 },
  { x: 2080, y: 420, fontSize: 260, rotate: 14 },
  { x: 120, y: 1120, fontSize: 250, rotate: -5 },
  { x: 880, y: 640, fontSize: 280, rotate: 10 },
  { x: 1760, y: 1680, fontSize: 290, rotate: -17 },
  { x: 2280, y: 1180, fontSize: 260, rotate: 8 },
]

/** Слоты в координатах pattern date (как IconDateBkg), размер — текущий (~×1.5). */
export const PIE_DATE_SCATTER_SLOTS: PieScatterSlot[] = [
  { x: 1580, y: 1280, fontSize: 780, rotate: -14 },
  { x: 2360, y: 960, fontSize: 690, rotate: 10 },
  { x: 3120, y: 1420, fontSize: 750, rotate: -8 },
  { x: 1880, y: 1880, fontSize: 660, rotate: 16 },
  { x: 2680, y: 1680, fontSize: 720, rotate: -11 },
  { x: 3480, y: 1180, fontSize: 630, rotate: 7 },
  { x: 1420, y: 2280, fontSize: 690, rotate: -18 },
  { x: 2240, y: 2480, fontSize: 750, rotate: 12 },
  { x: 3020, y: 2120, fontSize: 660, rotate: -6 },
  { x: 3720, y: 1780, fontSize: 720, rotate: 9 },
  { x: 1760, y: 2680, fontSize: 630, rotate: -15 },
  { x: 2580, y: 2880, fontSize: 690, rotate: 11 },
  { x: 3340, y: 2520, fontSize: 660, rotate: -9 },
  { x: 2060, y: 1080, fontSize: 600, rotate: 13 },
  { x: 2860, y: 1320, fontSize: 660, rotate: -12 },
  { x: 3620, y: 2280, fontSize: 690, rotate: 5 },
]

function hashSeed(seed: string): number {
  let h = 2166136261
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** Повторяет и перемешивает элементы для заполнения фона (детерминированно). */
export function expandAndShuffleForBg(
  items: string[],
  slotCount: number,
  seed: string,
): string[] {
  if (items.length === 0 || slotCount <= 0) return []

  const expanded: string[] = []
  while (expanded.length < slotCount) {
    expanded.push(...items)
  }
  const trimmed = expanded.slice(0, slotCount)

  let h = hashSeed(seed)
  for (let i = trimmed.length - 1; i > 0; i -= 1) {
    h = (Math.imul(h, 1103515245) + 12345) >>> 0
    const j = h % (i + 1)
    const tmp = trimmed[i]
    trimmed[i] = trimmed[j]
    trimmed[j] = tmp
  }

  return trimmed
}

export function truncateScatterLabel(label: string, maxLen = 16): string {
  const trimmed = label.trim()
  if (trimmed.length <= maxLen) return trimmed
  return `${trimmed.slice(0, maxLen - 1)}…`
}
