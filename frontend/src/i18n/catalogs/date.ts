import type { DaysOfWeek } from '@entities/date/domain/types'
import { getActiveLang } from '../langPreference'
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

const de: DateCatalog = {
  weekdays: {
    Sun: 'So',
    Mon: 'Mo',
    Tue: 'Di',
    Wed: 'Mi',
    Thu: 'Do',
    Fri: 'Fr',
    Sat: 'Sa',
  },
  monthsUpper: [
    'JANUAR',
    'FEBRUAR',
    'MÄRZ',
    'APRIL',
    'MAI',
    'JUNI',
    'JULI',
    'AUGUST',
    'SEPTEMBER',
    'OKTOBER',
    'NOVEMBER',
    'DEZEMBER',
  ],
}

const es: DateCatalog = {
  weekdays: {
    Sun: 'Dom',
    Mon: 'Lun',
    Tue: 'Mar',
    Wed: 'Mié',
    Thu: 'Jue',
    Fri: 'Vie',
    Sat: 'Sáb',
  },
  monthsUpper: [
    'ENERO',
    'FEBRERO',
    'MARZO',
    'ABRIL',
    'MAYO',
    'JUNIO',
    'JULIO',
    'AGOSTO',
    'SEPTIEMBRE',
    'OCTUBRE',
    'NOVIEMBRE',
    'DICIEMBRE',
  ],
}

const fr: DateCatalog = {
  weekdays: {
    Sun: 'Dim',
    Mon: 'Lun',
    Tue: 'Mar',
    Wed: 'Mer',
    Thu: 'Jeu',
    Fri: 'Ven',
    Sat: 'Sam',
  },
  monthsUpper: [
    'JANVIER',
    'FÉVRIER',
    'MARS',
    'AVRIL',
    'MAI',
    'JUIN',
    'JUILLET',
    'AOÛT',
    'SEPTEMBRE',
    'OCTOBRE',
    'NOVEMBRE',
    'DÉCEMBRE',
  ],
}

const pt: DateCatalog = {
  weekdays: {
    Sun: 'Dom',
    Mon: 'Seg',
    Tue: 'Ter',
    Wed: 'Qua',
    Thu: 'Qui',
    Fri: 'Sex',
    Sat: 'Sáb',
  },
  monthsUpper: [
    'JANEIRO',
    'FEVEREIRO',
    'MARÇO',
    'ABRIL',
    'MAIO',
    'JUNHO',
    'JULHO',
    'AGOSTO',
    'SETEMBRO',
    'OUTUBRO',
    'NOVEMBRO',
    'DEZEMBRO',
  ],
}

const it: DateCatalog = {
  weekdays: {
    Sun: 'Dom',
    Mon: 'Lun',
    Tue: 'Mar',
    Wed: 'Mer',
    Thu: 'Gio',
    Fri: 'Ven',
    Sat: 'Sab',
  },
  monthsUpper: [
    'GENNAIO',
    'FEBBRAIO',
    'MARZO',
    'APRILE',
    'MAGGIO',
    'GIUGNO',
    'LUGLIO',
    'AGOSTO',
    'SETTEMBRE',
    'OTTOBRE',
    'NOVEMBRE',
    'DICEMBRE',
  ],
}

const pl: DateCatalog = {
  weekdays: {
    Sun: 'Nd',
    Mon: 'Pn',
    Tue: 'Wt',
    Wed: 'Śr',
    Thu: 'Cz',
    Fri: 'Pt',
    Sat: 'So',
  },
  monthsUpper: [
    'STYCZEŃ',
    'LUTY',
    'MARZEC',
    'KWIECIEŃ',
    'MAJ',
    'CZERWIEC',
    'LIPIEC',
    'SIERPIEŃ',
    'WRZESIEŃ',
    'PAŹDZIERNIK',
    'LISTOPAD',
    'GRUDZIEŃ',
  ],
}

const uk: DateCatalog = {
  weekdays: {
    Sun: 'Нд',
    Mon: 'Пн',
    Tue: 'Вт',
    Wed: 'Ср',
    Thu: 'Чт',
    Fri: 'Пт',
    Sat: 'Сб',
  },
  monthsUpper: [
    'СІЧЕНЬ',
    'ЛЮТИЙ',
    'БЕРЕЗЕНЬ',
    'КВІТЕНЬ',
    'ТРАВЕНЬ',
    'ЧЕРВЕНЬ',
    'ЛИПЕНЬ',
    'СЕРПЕНЬ',
    'ВЕРЕСЕНЬ',
    'ЖОВТЕНЬ',
    'ЛИСТОПАД',
    'ГРУДЕНЬ',
  ],
}

const tr: DateCatalog = {
  weekdays: {
    Sun: 'Paz',
    Mon: 'Pzt',
    Tue: 'Sal',
    Wed: 'Çar',
    Thu: 'Per',
    Fri: 'Cum',
    Sat: 'Cmt',
  },
  monthsUpper: [
    'OCAK',
    'ŞUBAT',
    'MART',
    'NİSAN',
    'MAYIS',
    'HAZİRAN',
    'TEMMUZ',
    'AĞUSTOS',
    'EYLÜL',
    'EKİM',
    'KASIM',
    'ARALIK',
  ],
}

const id: DateCatalog = {
  weekdays: {
    Sun: 'Min',
    Mon: 'Sen',
    Tue: 'Sel',
    Wed: 'Rab',
    Thu: 'Kam',
    Fri: 'Jum',
    Sat: 'Sab',
  },
  monthsUpper: [
    'JANUARI',
    'FEBRUARI',
    'MARET',
    'APRIL',
    'MEI',
    'JUNI',
    'JULI',
    'AGUSTUS',
    'SEPTEMBER',
    'OKTOBER',
    'NOVEMBER',
    'DESEMBER',
  ],
}

const zh: DateCatalog = {
  weekdays: {
    Sun: '日',
    Mon: '一',
    Tue: '二',
    Wed: '三',
    Thu: '四',
    Fri: '五',
    Sat: '六',
  },
  monthsUpper: [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月',
  ],
}

const ja: DateCatalog = {
  weekdays: {
    Sun: '日',
    Mon: '月',
    Tue: '火',
    Wed: '水',
    Thu: '木',
    Fri: '金',
    Sat: '土',
  },
  monthsUpper: [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月',
  ],
}

const ko: DateCatalog = {
  weekdays: {
    Sun: '일',
    Mon: '월',
    Tue: '화',
    Wed: '수',
    Thu: '목',
    Fri: '금',
    Sat: '토',
  },
  monthsUpper: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
}

const ar: DateCatalog = {
  weekdays: {
    Sun: 'أحد',
    Mon: 'إثن',
    Tue: 'ثلا',
    Wed: 'أرب',
    Thu: 'خمي',
    Fri: 'جمع',
    Sat: 'سبت',
  },
  monthsUpper: [
    'يناير',
    'فبراير',
    'مارس',
    'أبريل',
    'مايو',
    'يونيو',
    'يوليو',
    'أغسطس',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر',
  ],
}

const hi: DateCatalog = {
  weekdays: {
    Sun: 'रवि',
    Mon: 'सोम',
    Tue: 'मंगल',
    Wed: 'बुध',
    Thu: 'गुरु',
    Fri: 'शुक्र',
    Sat: 'शनि',
  },
  monthsUpper: [
    'जनवरी',
    'फ़रवरी',
    'मार्च',
    'अप्रैल',
    'मई',
    'जून',
    'जुलाई',
    'अगस्त',
    'सितंबर',
    'अक्टूबर',
    'नवंबर',
    'दिसंबर',
  ],
}

const dateCatalogs: Record<Lang, DateCatalog> = {
  en,
  ru,
  de,
  es,
  zh,
  fr,
  ar,
  pt,
  it,
  hi,
  ja,
  tr,
  ko,
  id,
  uk,
  pl,
}

function dateCatalog(lang: Lang): DateCatalog {
  return dateCatalogs[lang] ?? en
}

export function dateWeekdayLabel(
  day: DaysOfWeek,
  lang: Lang = getActiveLang(),
): string {
  return dateCatalog(lang).weekdays[day]
}

export function dateMonthUpperLabel(
  monthIndex: number,
  lang: Lang = getActiveLang(),
): string {
  const months = dateCatalog(lang).monthsUpper
  return months[monthIndex] ?? en.monthsUpper[monthIndex] ?? ''
}
