/**
 * Центры bbox путей `sprite_digits.svg` (user space 7080×10241), см. `scripts/stamp-digit-centers.py`.
 * Используются, чтобы поставить глиф в область медальона (`anchor` в base SVG), не угадывая %.
 */
export const MARK_STAMP_ANCHOR_CX = 754 + 2842 / 2
export const MARK_STAMP_ANCHOR_CY = 7277 + 2048 / 2

/** Минимальный зазор между bbox соседних глифов (user space спрайта). */
const PAIR_GAP = 200

/** Полная ширина bbox глифа в координатах спрайта (см. `scripts/stamp-digit-centers.py`). */
export const MARK_STAMP_DIGIT_SPRITE_WIDTH: Record<string, number> = {
  '0': 1357.0,
  '1': 745.0,
  '2': 1360.0,
  '3': 1320.0,
  '4': 1493.0,
  '5': 1317.0,
  '6': 1314.0,
  '7': 1314.0,
  '8': 1326.0,
  '9': 1314.0,
}

/** Центр bbox глифа в координатах спрайта. */
export const MARK_STAMP_DIGIT_SPRITE_CENTER: Record<
  string,
  { cx: number; cy: number }
> = {
  '0': { cx: 1246.5, cy: 1514.0 },
  '1': { cx: 2904.5, cy: 1509.5 },
  '2': { cx: 4845.0, cy: 1498.0 },
  '3': { cx: 1348.0, cy: 3921.0 },
  '4': { cx: 3034.5, cy: 3909.5 },
  '5': { cx: 5077.5, cy: 3919.5 },
  '6': { cx: 1036.0, cy: 6300.0 },
  '7': { cx: 2421.0, cy: 6301.5 },
  '8': { cx: 3919.0, cy: 6294.5 },
  '9': { cx: 5644.0, cy: 6303.0 },
}

/**
 * Центры слотов для цифр: один — по центру медальона; два — симметрично по X.
 * Для пары расстояние между центрами ≥ полусумма ширин bbox + `PAIR_GAP`, чтобы не «липли».
 */
export function markStampMedallionSlotCenters(chars: string[]): Array<{
  x: number
  y: number
}> {
  if (chars.length <= 1) {
    return [{ x: MARK_STAMP_ANCHOR_CX, y: MARK_STAMP_ANCHOR_CY }]
  }
  const a = chars[0] ?? '0'
  const b = chars[1] ?? '0'
  const w0 = MARK_STAMP_DIGIT_SPRITE_WIDTH[a] ?? 1300
  const w1 = MARK_STAMP_DIGIT_SPRITE_WIDTH[b] ?? 1300
  const halfSlotDx = w0 / 4 + w1 / 4 + PAIR_GAP / 2
  return [
    {
      x: MARK_STAMP_ANCHOR_CX - halfSlotDx,
      y: MARK_STAMP_ANCHOR_CY,
    },
    {
      x: MARK_STAMP_ANCHOR_CX + halfSlotDx,
      y: MARK_STAMP_ANCHOR_CY,
    },
  ]
}
