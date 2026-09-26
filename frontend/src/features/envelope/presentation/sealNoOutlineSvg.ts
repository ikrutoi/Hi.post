import type { DispatchDate } from '@entities/date/domain/types'
import sealSource from '@shared/assets/stamps/seal_noOutline.svg?raw'
import '../view/presentation/stampCountFont.scss'

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

/** Основа печати: стандартные «26 SEP / 2026» заменены на дату открытки. */
export function buildSealNoOutlineSvg(date: DispatchDate): string {
  const { dayMonth, year } = sealDateLines(date)
  const dateText = `<text x="2560" y="2987" text-anchor="middle" font-family="Barlow, sans-serif" font-weight="700" font-size="846" fill="#000">${dayMonth}</text><text x="2560" y="3936" text-anchor="middle" font-family="Barlow, sans-serif" font-weight="700" font-size="846" fill="#000">${year}</text>`
  const start = sealSource.indexOf('<path id="day_month"')
  const end = sealSource.lastIndexOf('</g>')
  const body =
    start >= 0 && end > start
      ? sealSource.slice(0, start) + dateText + sealSource.slice(end)
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
