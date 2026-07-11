import type { IconKey } from '@shared/config/constants'
import type { DispatchDate } from '@entities/date/domain/types'
import { POSTCARD_DISPATCH_DATE_FALLBACK } from '@entities/postcard'
export type HistoryListSortableItem = {
  sourceDate?: DispatchDate
  detailLine?: string
}

export type HistoryListSortMode =
  | 'dateDesc'
  | 'dateAsc'
  | 'titleAsc'
  | 'titleDesc'

export const HISTORY_LIST_SORT_MODE_SEQUENCE: readonly HistoryListSortMode[] = [
  'dateAsc',
  'dateDesc',
  'titleAsc',
  'titleDesc',
]

export const HISTORY_LIST_SORT_MODE_TO_ICON: Record<
  HistoryListSortMode,
  IconKey
> = {
  dateDesc: 'sort131Up',
  dateAsc: 'sort131Down',
  titleAsc: 'sortAZDown',
  titleDesc: 'sortAZUp',
}

export const HISTORY_LIST_SORT_ICON_KEYS = [
  'sort131Up',
  'sort131Down',
  'sortAZDown',
  'sortAZUp',
] as const satisfies readonly IconKey[]

export type HistoryListSortIconKey = (typeof HISTORY_LIST_SORT_ICON_KEYS)[number]

export function isHistoryListSortIconKey(
  key: IconKey,
): key is HistoryListSortIconKey {
  return (HISTORY_LIST_SORT_ICON_KEYS as readonly IconKey[]).includes(key)
}

export function getHistoryListSortIconForMode(
  mode: HistoryListSortMode,
): IconKey {
  return HISTORY_LIST_SORT_MODE_TO_ICON[mode]
}

/** `sort131Up` / `sort131Down` — сортировка по дате; имя в ячейке приглушаем. */
export function isHistoryListSortByDate(mode: HistoryListSortMode): boolean {
  return mode === 'dateDesc' || mode === 'dateAsc'
}

/** `sortAZDown` / `sortAZUp` — сортировка по имени; дату вниз, имя вверх. */
export function isHistoryListSortByTitle(mode: HistoryListSortMode): boolean {
  return mode === 'titleAsc' || mode === 'titleDesc'
}

export type HistoryListSortEmphasis = 'date' | 'title'

export function getHistoryListSortEmphasis(
  mode: HistoryListSortMode,
): HistoryListSortEmphasis | undefined {
  if (isHistoryListSortByDate(mode)) return 'date'
  if (isHistoryListSortByTitle(mode)) return 'title'
  return undefined
}

export function getNextHistoryListSortMode(
  current: HistoryListSortMode,
): HistoryListSortMode {
  const idx = HISTORY_LIST_SORT_MODE_SEQUENCE.indexOf(current)
  return HISTORY_LIST_SORT_MODE_SEQUENCE[
    (idx < 0 ? 0 : idx + 1) % HISTORY_LIST_SORT_MODE_SEQUENCE.length
  ]
}

function isFallbackDispatchDate(d: DispatchDate): boolean {
  return (
    d.year === POSTCARD_DISPATCH_DATE_FALLBACK.year &&
    d.month === POSTCARD_DISPATCH_DATE_FALLBACK.month &&
    d.day === POSTCARD_DISPATCH_DATE_FALLBACK.day
  )
}

function dispatchDateUtcMidnightMs(d: DispatchDate): number {
  return Date.UTC(d.year, d.month, d.day)
}

/** Раньше — меньше; без даты / fallback — в конце. */
function compareHistoryBySourceDateChronological(
  a: HistoryListSortableItem,
  b: HistoryListSortableItem,
): number {
  const da = a.sourceDate
  const db = b.sourceDate
  const aBad = !da || isFallbackDispatchDate(da)
  const bBad = !db || isFallbackDispatchDate(db)
  if (aBad && bBad) return 0
  if (aBad) return 1
  if (bBad) return -1
  return dispatchDateUtcMidnightMs(da) - dispatchDateUtcMidnightMs(db)
}

function compareByDateDesc(
  a: HistoryListSortableItem,
  b: HistoryListSortableItem,
): number {
  return -compareHistoryBySourceDateChronological(a, b)
}

function compareByDateAsc(
  a: HistoryListSortableItem,
  b: HistoryListSortableItem,
): number {
  return compareHistoryBySourceDateChronological(a, b)
}

function hasHistoryListName(item: HistoryListSortableItem): boolean {
  return Boolean(item.detailLine?.trim())
}

function compareByNameAsc(
  a: HistoryListSortableItem,
  b: HistoryListSortableItem,
): number {
  return (a.detailLine ?? '').localeCompare(b.detailLine ?? '', undefined, {
    sensitivity: 'base',
  })
}

function compareByNameDesc(
  a: HistoryListSortableItem,
  b: HistoryListSortableItem,
): number {
  return compareByNameAsc(b, a)
}

export function sortHistoryListEntries<T extends HistoryListSortableItem>(
  entries: readonly T[],
  mode: HistoryListSortMode,
): T[] {
  if (entries.length <= 1) return [...entries]

  switch (mode) {
    case 'dateDesc':
      return [...entries].sort(compareByDateDesc)
    case 'dateAsc':
      return [...entries].sort(compareByDateAsc)
    case 'titleAsc': {
      const withName = entries.filter(hasHistoryListName)
      const withoutName = entries.filter((row) => !hasHistoryListName(row))
      if (withoutName.length === 0) {
        return [...withName].sort(compareByNameAsc)
      }
      if (withName.length === 0) {
        return [...withoutName].sort(compareByDateDesc)
      }
      return [
        ...[...withName].sort(compareByNameAsc),
        ...[...withoutName].sort(compareByDateDesc),
      ]
    }
    case 'titleDesc': {
      const withName = entries.filter(hasHistoryListName)
      const withoutName = entries.filter((row) => !hasHistoryListName(row))
      if (withoutName.length === 0) {
        return [...withName].sort(compareByNameDesc)
      }
      if (withName.length === 0) {
        return [...withoutName].sort(compareByDateAsc)
      }
      return [
        ...[...withName].sort(compareByNameDesc),
        ...[...withoutName].sort(compareByDateAsc),
      ]
    }
  }
}
