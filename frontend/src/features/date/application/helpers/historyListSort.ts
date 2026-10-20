import type { IconKey } from '@shared/config/constants'
import type { DispatchDate } from '@entities/date/domain/types'
import { POSTCARD_DISPATCH_DATE_FALLBACK } from '@entities/postcard'
export type HistoryListSortableItem = {
  sourceDate?: DispatchDate
  detailLine?: string
  postcardLocalId?: number
}

export type HistoryListSortMode = 'dateDesc' | 'dateAsc'

export const HISTORY_LIST_SORT_MODE_SEQUENCE: readonly HistoryListSortMode[] = [
  'dateAsc',
  'dateDesc',
]

export const HISTORY_LIST_SORT_MODE_TO_ICON: Record<
  HistoryListSortMode,
  IconKey
> = {
  dateDesc: 'sort131Up',
  dateAsc: 'sort131Down',
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

/**
 * Год, затем месяц, затем день. Без даты — в конце и при возрастании, и при убывании.
 * Одинаковая дата — по localId, чтобы порядок внутри дня не прыгал.
 */
function compareHistoryBySourceDate(
  a: HistoryListSortableItem,
  b: HistoryListSortableItem,
  direction: 1 | -1,
): number {
  const da = a.sourceDate
  const db = b.sourceDate
  const aBad = !da || isFallbackDispatchDate(da)
  const bBad = !db || isFallbackDispatchDate(db)
  if (aBad && bBad) return 0
  if (aBad) return 1
  if (bBad) return -1
  const dateA = da as DispatchDate
  const dateB = db as DispatchDate
  if (dateA.year !== dateB.year) return (dateA.year - dateB.year) * direction
  if (dateA.month !== dateB.month) return (dateA.month - dateB.month) * direction
  if (dateA.day !== dateB.day) return (dateA.day - dateB.day) * direction
  return (a.postcardLocalId ?? 0) - (b.postcardLocalId ?? 0)
}

export function sortHistoryListEntries<T extends HistoryListSortableItem>(
  entries: readonly T[],
  mode: HistoryListSortMode,
): T[] {
  if (entries.length <= 1) return [...entries]
  const direction = mode === 'dateDesc' ? -1 : 1
  return [...entries].sort((a, b) =>
    compareHistoryBySourceDate(a, b, direction),
  )
}
