import type { DispatchDate } from '@entities/date/domain/types'
import sealSource from '@shared/assets/stamps/seal_noOutline.svg?raw'

const MONTHS = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
] as const

/** Первая дата из списка секции «Дата». */
export function firstDispatchDate(
  dates: readonly DispatchDate[],
): DispatchDate | null {
  return dates[0] ?? null
}

export function sealDateLines(date: DispatchDate): {
  dayMonth: string
  year: string
} {
  const month = MONTHS[date.month] ?? 'JAN'
  const day = String(date.day).padStart(2, '0')
  return { dayMonth: `${day} ${month}`, year: String(date.year) }
}

/**
 * Основа печати. Пока Barlow не загружен, дата рисуется Arial:
 * SVG-текст с ещё не скачанным шрифтом браузер не показывает.
 */
export function buildSealNoOutlineSvg(
  date: DispatchDate,
  barlowReady: boolean,
): string {
  const { dayMonth, year } = sealDateLines(date)
  const font = barlowReady ? 'Barlow, sans-serif' : 'Arial, sans-serif'
  const dateText = `<text x="2560" y="2987" text-anchor="middle" font-family="${font}" font-weight="700" font-size="846" fill="#000">${dayMonth}</text><text x="2560" y="3936" text-anchor="middle" font-family="${font}" font-weight="700" font-size="846" fill="#000">${year}</text>`
  const end = sealSource.lastIndexOf('</g>')
  const body =
    end >= 0
      ? sealSource.slice(0, end) + dateText + sealSource.slice(end)
      : sealSource
  return body
    .replace(/<\?xml[\s\S]*?\?>/, '')
    .replace(/<!DOCTYPE[\s\S]*?>/, '')
    .replaceAll('class="fil0"', 'class="sealFil0"')
    .replaceAll('class="fil1"', 'class="sealFil1"')
    .replaceAll('class="fil2"', 'class="sealFil2"')
    .replaceAll('.fil0', '.sealFil0')
    .replaceAll('.fil1', '.sealFil1')
    .replaceAll('.fil2', '.sealFil2')
    .replace('width="512px"', 'width="100%"')
    .replace('height="512px"', 'height="100%"')
}
