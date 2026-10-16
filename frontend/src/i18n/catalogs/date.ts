import type { DaysOfWeek } from '@entities/date/domain/types'
import type { Lang } from '../types'

type DateCatalog = {
  weekdays: Record<DaysOfWeek, string>
  monthsUpper: readonly string[]
}

const en: DateCatalog = {
  weekdays: {
    Sun: 'Sun',
    Mon: 'Mon',
    Tue: 'Tue',
    Wed: 'Wed',
    Thu: 'Thu',
    Fri: 'Fri',
    Sat: 'Sat',
  },
  monthsUpper: [
    'JANUARY',
    'FEBRUARY',
    'MARCH',
    'APRIL',
    'MAY',
    'JUNE',
    'JULY',
    'AUGUST',
    'SEPTEMBER',
    'OCTOBER',
    'NOVEMBER',
    'DECEMBER',
  ],
}

const ru: DateCatalog = {
  weekdays: {
    Sun: 'Вс',
    Mon: 'Пн',
    Tue: 'Вт',
    Wed: 'Ср',
    Thu: 'Чт',
    Fri: 'Пт',
    Sat: 'Сб',
  },
  monthsUpper: [
    'ЯНВАРЬ',
    'ФЕВРАЛЬ',
    'МАРТ',
    'АПРЕЛЬ',
    'МАЙ',
    'ИЮНЬ',
    'ИЮЛЬ',
    'АВГУСТ',
    'СЕНТЯБРЬ',
    'ОКТЯБРЬ',
    'НОЯБРЬ',
    'ДЕКАБРЬ',
  ],
}

const dateCatalogs: Partial<Record<Lang, DateCatalog>> = { en, ru }

/** Date section copy. The rest of the app stays on `DEFAULT_LANG`. */
export const DATE_SECTION_LANG: Lang = 'ru'

function dateCatalog(lang: Lang): DateCatalog {
  return dateCatalogs[lang] ?? en
}

export function dateWeekdayLabel(
  day: DaysOfWeek,
  lang: Lang = DATE_SECTION_LANG,
): string {
  return dateCatalog(lang).weekdays[day]
}

export function dateMonthUpperLabel(
  monthIndex: number,
  lang: Lang = DATE_SECTION_LANG,
): string {
  const months = dateCatalog(lang).monthsUpper
  return months[monthIndex] ?? en.monthsUpper[monthIndex] ?? ''
}
