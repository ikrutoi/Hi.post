export type PieScatterSlot = {
  x: number
  y: number
  fontSize: number
  rotate?: number
}

/** Растягивает слоты по Y от исходного min, умножая вертикальный span на factor. */
function spreadScatterSlotsY(
  slots: PieScatterSlot[],
  spanFactor: number,
): PieScatterSlot[] {
  if (slots.length === 0) return slots

  let minY = slots[0].y
  let maxY = slots[0].y
  for (const slot of slots) {
    if (slot.y < minY) minY = slot.y
    if (slot.y > maxY) maxY = slot.y
  }

  const span = maxY - minY
  if (span <= 0) {
    return slots.map((slot) => ({ ...slot, y: minY }))
  }

  const targetMaxY = minY + span * spanFactor

  return slots.map((slot) => ({
    ...slot,
    y: minY + ((slot.y - minY) / span) * (targetMaxY - minY),
  }))
}

function applyFontSizesFromSlots(
  slots: PieScatterSlot[],
  source: PieScatterSlot[],
): PieScatterSlot[] {
  return slots.map((slot, i) => ({
    ...slot,
    fontSize: source[i]?.fontSize ?? slot.fontSize,
  }))
}

/** Размер SVG-pattern секции «Конверт». */
export const PIE_ENVELOPE_PATTERN_WIDTH = 2560
export const PIE_ENVELOPE_PATTERN_HEIGHT = 4120

const PIE_ENVELOPE_SCATTER_PADDING_X = 100
const PIE_ENVELOPE_SCATTER_PADDING_Y = 150

function mapEnvelopeScatterSlotsToPattern(
  slots: PieScatterSlot[],
): PieScatterSlot[] {
  if (slots.length === 0) return slots

  let minX = slots[0].x
  let maxX = slots[0].x
  let minY = slots[0].y
  let maxY = slots[0].y
  for (const slot of slots) {
    if (slot.x < minX) minX = slot.x
    if (slot.x > maxX) maxX = slot.x
    if (slot.y < minY) minY = slot.y
    if (slot.y > maxY) maxY = slot.y
  }

  const spanX = maxX - minX || 1
  const spanY = maxY - minY || 1
  const targetMinX = PIE_ENVELOPE_SCATTER_PADDING_X
  const targetMaxX = PIE_ENVELOPE_PATTERN_WIDTH - PIE_ENVELOPE_SCATTER_PADDING_X
  const targetMinY = PIE_ENVELOPE_SCATTER_PADDING_Y
  const targetMaxY = PIE_ENVELOPE_PATTERN_HEIGHT - PIE_ENVELOPE_SCATTER_PADDING_Y

  return slots.map((slot) => ({
    ...slot,
    x: targetMinX + ((slot.x - minX) / spanX) * (targetMaxX - targetMinX),
    y: targetMinY + ((slot.y - minY) / spanY) * (targetMaxY - targetMinY),
  }))
}

/** Вертикальный разброс фона относительно исходной раскладки слотов. */
const SCATTER_Y_SPAN_FACTOR = 1.5

/** Слоты-шаблон для раскладки фона «Конверт» (нормализуются под pattern 2560×4120). */
const PIE_ENVELOPE_SCATTER_SLOTS_BASE: PieScatterSlot[] = [
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
const PIE_DATE_SCATTER_SLOTS_BASE: PieScatterSlot[] = [
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

export const PIE_ENVELOPE_SCATTER_SLOTS = mapEnvelopeScatterSlotsToPattern(
  applyFontSizesFromSlots(
    PIE_ENVELOPE_SCATTER_SLOTS_BASE,
    PIE_DATE_SCATTER_SLOTS_BASE,
  ),
)

export const PIE_DATE_SCATTER_SLOTS = spreadScatterSlotsY(
  PIE_DATE_SCATTER_SLOTS_BASE,
  SCATTER_Y_SPAN_FACTOR,
)

function hashSeed(seed: string): number {
  let h = 2166136261
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function shuffleStrings(items: string[], seed: string): string[] {
  const trimmed = [...items]
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

  return shuffleStrings(expanded.slice(0, slotCount), seed)
}

function splitNameIntoScatterWords(name: string): string[] {
  return name.trim().split(/\s+/).filter((word) => word.length > 0)
}

function repeatNames(names: string[], times: number): string[] {
  if (times <= 0) return []
  return names.flatMap((name) => Array.from({ length: times }, () => name))
}

/**
 * Имена получателей для фона «Конверт»:
 * 2 → ×3, 3 → ×2, >3 → случайные 3 имени ×2; многословные → слова по отдельности.
 */
export function expandEnvelopeRecipientsForBg(
  items: string[],
  slotCount: number,
  seed: string,
): string[] {
  if (items.length === 0 || slotCount <= 0) return []

  let selected: string[]
  let repeatCount: number

  if (items.length === 2) {
    selected = [...items]
    repeatCount = 3
  } else if (items.length === 3) {
    selected = [...items]
    repeatCount = 2
  } else {
    selected = shuffleStrings([...items], seed).slice(0, 3)
    repeatCount = 2
  }

  const words = repeatNames(selected, repeatCount).flatMap(
    splitNameIntoScatterWords,
  )
  if (words.length === 0) return []

  return shuffleStrings(words, `${seed}:layout`).slice(0, slotCount)
}

export function truncateScatterLabel(label: string, maxLen = 16): string {
  const trimmed = label.trim()
  if (trimmed.length <= maxLen) return trimmed
  return `${trimmed.slice(0, maxLen - 1)}…`
}

/** Смещение центра концентрических кругов от края pattern. */
const PIE_ENVELOPE_SINGLE_CIRCLE_INSET = 0.03
/** Множитель радиуса относительно mini-раскладки (дуга крупнее в секторе pie). */
const PIE_ENVELOPE_SINGLE_CIRCLE_RADIUS_SCALE = 1.35
/** Радиус круга отправителя относительно внутреннего круга получателя. */
const PIE_ENVELOPE_SENDER_CIRCLE_RADIUS_FACTOR = 0.85

export type PieEnvelopeSingleCircleLayout = {
  cx: number
  cy: number
  outerRadius: number
  innerRadius: number
}

export type PieEnvelopeSenderCircleLayout = {
  cx: number
  cy: number
  radius: number
}

/** Раскладка фона одного получателя: 2 концентрических круга в правом нижнем углу. */
export function getPieEnvelopeSingleCircleLayout(
  patternWidth: number,
  patternHeight: number,
): PieEnvelopeSingleCircleLayout {
  const sizeOuterPercent =
    2 * (1 - PIE_ENVELOPE_SINGLE_CIRCLE_INSET) * Math.SQRT2 * 100
  const sizeInnerPercent = sizeOuterPercent / 2
  const cx = patternWidth * (1 - PIE_ENVELOPE_SINGLE_CIRCLE_INSET)
  const cy = patternHeight * (1 - PIE_ENVELOPE_SINGLE_CIRCLE_INSET)
  const outerRadius =
    (((sizeOuterPercent / 100) * patternWidth) / 2) *
    PIE_ENVELOPE_SINGLE_CIRCLE_RADIUS_SCALE
  const innerRadius =
    (((sizeInnerPercent / 100) * patternWidth) / 2) *
    PIE_ENVELOPE_SINGLE_CIRCLE_RADIUS_SCALE

  return { cx, cy, outerRadius, innerRadius }
}

export const PIE_ENVELOPE_SINGLE_CIRCLE_LAYOUT = getPieEnvelopeSingleCircleLayout(
  PIE_ENVELOPE_PATTERN_WIDTH,
  PIE_ENVELOPE_PATTERN_HEIGHT,
)

/** Круг отправителя в левом верхнем углу (меньше кругов получателя). */
export function getPieEnvelopeSenderCircleLayout(
  patternWidth: number,
  patternHeight: number,
): PieEnvelopeSenderCircleLayout {
  const recipientLayout = getPieEnvelopeSingleCircleLayout(
    patternWidth,
    patternHeight,
  )

  return {
    cx: patternWidth * PIE_ENVELOPE_SINGLE_CIRCLE_INSET,
    cy: patternHeight * PIE_ENVELOPE_SINGLE_CIRCLE_INSET,
    radius: recipientLayout.innerRadius * PIE_ENVELOPE_SENDER_CIRCLE_RADIUS_FACTOR,
  }
}

export const PIE_ENVELOPE_SENDER_CIRCLE_LAYOUT = getPieEnvelopeSenderCircleLayout(
  PIE_ENVELOPE_PATTERN_WIDTH,
  PIE_ENVELOPE_PATTERN_HEIGHT,
)
