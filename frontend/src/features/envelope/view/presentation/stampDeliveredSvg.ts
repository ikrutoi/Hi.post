import './stampCountFont.scss'
import stampDelivered99Source from '@shared/assets/stamps/stamp_delivered_99.svg?raw'

/** Правый край и низ контура `countYear` в viewBox марки. */
const COUNT_RIGHT = 3872
const COUNT_BASELINE = 9492
/** Рост контура «1» в `countYear`. */
const COUNT_FONT_SIZE = 4100
/** Сжатие по ширине. Правый край остаётся на месте. */
const COUNT_SCALE_X = 0.8
const COUNT_INK = '#022561'

function countLabel(yearCount: number | null): string | null {
  if (yearCount == null || yearCount >= 100) return null
  const value = Math.round(yearCount)
  if (value < 1 || value > 99) return null
  return String(value)
}

function isolateStampClasses(svg: string): string {
  return svg.replaceAll('class="fil', 'class="stampFil').replaceAll('.fil', '.stampFil')
}

/**
 * `stamp_delivered_99`: `countYear` и `hi` только при выбранной дате.
 * Цифра года подставляется вместо контура `countYear`.
 */
export function buildStampDeliveredSvg(yearCount: number | null): string {
  let svg = isolateStampClasses(
    stampDelivered99Source
      .replace(/<\?xml[\s\S]*?\?>/, '')
      .replace(/<!DOCTYPE[\s\S]*?>/, '')
      .replace('width="708px"', 'width="100%"')
      .replace('height="1024px"', 'height="100%"'),
  )

  const label = countLabel(yearCount)
  if (yearCount == null) {
    svg = svg
      .replace(/<path id="countYear"[\s\S]*?\/>/, '')
      .replace(/<g id="hi"[\s\S]*?<\/g>/, '')
    return svg
  }

  const fontSize =
    label != null && label.length > 1
      ? Math.round(COUNT_FONT_SIZE * 0.85)
      : COUNT_FONT_SIZE
  const countMarkup = label
    ? `<text id="countYear" x="${COUNT_RIGHT}" y="${COUNT_BASELINE}" text-anchor="end" font-family="Barlow, sans-serif" font-weight="700" font-size="${fontSize}" fill="${COUNT_INK}" transform="translate(${COUNT_RIGHT} 0) scale(${COUNT_SCALE_X} 1) translate(${-COUNT_RIGHT} 0)">${label}</text>`
    : ''
  return svg.replace(/<path id="countYear"[\s\S]*?\/>/, countMarkup)
}
