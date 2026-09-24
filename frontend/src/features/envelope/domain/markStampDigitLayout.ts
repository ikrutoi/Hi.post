/**
 * Цифры срока на марке: левый нижний угол, высота ≈ 1.5 высоты знака в правом нижнем.
 * Координаты оверлея — viewBox `mark_cart.svg` / `mark_paid.svg` (10240×14811).
 * Центры глифов — user space спрайта 7080×10241.
 */
export const MARK_STAMP_VB_W = 10240
export const MARK_STAMP_VB_H = 14811

/** Знак «hi» в правом нижнем углу (bbox кривых). */
const CORNER_MARK_H = 2852
const CORNER_MARK_MIN_X = 5552.95
const CORNER_MARK_RIGHT_INSET = 1337.41
const CORNER_MARK_BOTTOM_INSET = 1318
/** Самый высокий глиф (8). */
const TALLEST_GLYPH_H = 2051
/** Зазор между цифрами и знаком справа, в координатах марки. */
const GAP_BEFORE_MARK = 80

const LEFT_INSET = CORNER_MARK_RIGHT_INSET
const BOTTOM_Y = MARK_STAMP_VB_H - CORNER_MARK_BOTTOM_INSET
/**
 * Квадрат в левом нижнем углу: сторона ≈ 1.5 высоты знака,
 * но не заходит на сам знак.
 */
const CORNER_SQUARE = Math.min(
  CORNER_MARK_H * 1.5,
  CORNER_MARK_MIN_X - LEFT_INSET - GAP_BEFORE_MARK,
)
/** Минимальный зазор между bbox соседних глифов (user space спрайта). */
const PAIR_GAP = 200

export const MARK_STAMP_DIGIT_SCALE = CORNER_SQUARE / TALLEST_GLYPH_H

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

/** Высота bbox глифа в координатах спрайта. */
export const MARK_STAMP_DIGIT_SPRITE_HEIGHT: Record<string, number> = {
  '0': 2046,
  '1': 1991,
  '2': 2014,
  '3': 2014,
  '4': 1991,
  '5': 2011,
  '6': 2034,
  '7': 1991,
  '8': 2051,
  '9': 2034,
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

export type MarkStampDigitPlacement = {
  transform: string
}

/** Прямоугольник чернил цифр в координатах марки — по нему тянется градиент заливки. */
export type MarkStampDigitInk = {
  x: number
  y: number
  width: number
  height: number
}

export type MarkStampDigitLayout = {
  placements: MarkStampDigitPlacement[]
  ink: MarkStampDigitInk
}

function glyphWidth(ch: string): number {
  return MARK_STAMP_DIGIT_SPRITE_WIDTH[ch] ?? 1300
}

function runWidth(chars: string[], scale: number): number {
  const gap = PAIR_GAP * scale
  return chars.reduce(
    (sum, ch, index) => sum + glyphWidth(ch) * scale + (index > 0 ? gap : 0),
    0,
  )
}

/** Глифы в левом нижнем углу. `ink` — их общий bbox, без поля вокруг. */
export function markStampDigitLayout(chars: string[]): MarkStampDigitLayout {
  const heightScale = MARK_STAMP_DIGIT_SCALE
  const widthAtHeight = runWidth(chars, heightScale)
  const scale =
    widthAtHeight > CORNER_SQUARE
      ? heightScale * (CORNER_SQUARE / widthAtHeight)
      : heightScale
  let cursor = LEFT_INSET
  const gap = PAIR_GAP * scale
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  const placements = chars.map((ch) => {
    const width = glyphWidth(ch)
    const height = MARK_STAMP_DIGIT_SPRITE_HEIGHT[ch] ?? TALLEST_GLYPH_H
    const center =
      MARK_STAMP_DIGIT_SPRITE_CENTER[ch] ?? MARK_STAMP_DIGIT_SPRITE_CENTER['0']
    const inkW = width * scale
    const inkH = height * scale
    const x = cursor + inkW / 2
    const y = BOTTOM_Y - inkH / 2
    minX = Math.min(minX, x - inkW / 2)
    maxX = Math.max(maxX, x + inkW / 2)
    minY = Math.min(minY, y - inkH / 2)
    maxY = Math.max(maxY, y + inkH / 2)
    cursor += inkW + gap
    return {
      transform: `translate(${x} ${y}) scale(${scale}) translate(${-center.cx} ${-center.cy})`,
    }
  })
  return {
    placements,
    ink: {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    },
  }
}
