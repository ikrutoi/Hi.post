import stampAroma99Source from '@shared/assets/stamps/stamp_aroma_99.svg?raw'
import type { StampAroma99Colors } from '@envelope/domain/stampAroma99Colors'

/** Правый край и низ контура `count` в viewBox марки. */
const COUNT_RIGHT = 4082
const COUNT_BASELINE = 9459
/** Высота контура «1»; кегль подобран так, чтобы цифра встала в этот рост. */
const COUNT_FONT_SIZE = 4100
/** Сжатие по ширине. Правый край остаётся на месте. */
const COUNT_SCALE_X = 0.8

function countLabel(yearCount: number | null): string | null {
  if (yearCount == null || yearCount >= 100) return null
  const value = Math.round(yearCount)
  if (value < 1 || value > 99) return null
  return String(value)
}

export function buildStampAroma99Svg(
  colors: StampAroma99Colors,
  yearCount: number | null,
  uid: string,
): string {
  const logoId = `${uid}-logo`
  const backgroundId = `${uid}-bg`
  let svg = stampAroma99Source
    .replace(/<\?xml[\s\S]*?\?>/, '')
    .replace(/<!DOCTYPE[\s\S]*?>/, '')
    .replace('width="708px"', 'width="100%"')
    .replace('height="1024px"', 'height="100%"')
    .replace('id="id0"', `id="${logoId}"`)
    .replace('id="id1"', `id="${backgroundId}"`)
    .replace('url(#id0)', `url(#${logoId})`)
    .replace('url(#id1)', `url(#${backgroundId})`)
    .replace('stop-color:#DE8E93', `stop-color:${colors.logoDown}`)
    .replace('stop-color:#FAF2EB', `stop-color:${colors.backgroundUp}`)
    .replace('stop-color:#DFADB3', `stop-color:${colors.backgroundDown}`)
    .replace(/\s*<stop offset="0\.470588"[^>]*\/>/, '')
    .replaceAll('#543638', colors.countHi)

  const label = countLabel(yearCount)
  const countMarkup = label
    ? `<text id="count" x="${COUNT_RIGHT}" y="${COUNT_BASELINE}" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="${COUNT_FONT_SIZE}" fill="${colors.countHi}" transform="translate(${COUNT_RIGHT} 0) scale(${COUNT_SCALE_X} 1) translate(${-COUNT_RIGHT} 0)">${label}</text>`
    : ''
  svg = svg.replace(/<path id="count"[\s\S]*?\/>/, countMarkup)
  return svg
}
