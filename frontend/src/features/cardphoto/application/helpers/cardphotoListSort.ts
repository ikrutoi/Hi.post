import type { IconKey } from '@shared/config/constants'

export type CardphotoListSortMode = 'dateDesc' | 'dateAsc'

export type CardphotoListSortableRow = {
  id: string
  title?: string
  timestamp: number
}

/** Новее сверху — стрелка вверх; старше сверху — стрелка вниз. Как в списке истории. */
export const CARDPHOTO_LIST_SORT_MODE_TO_ICON: Record<
  CardphotoListSortMode,
  IconKey
> = {
  dateDesc: 'sort131Up',
  dateAsc: 'sort131Down',
}

export const CARDPHOTO_LIST_SORT_MODE_SEQUENCE: readonly CardphotoListSortMode[] =
  ['dateDesc', 'dateAsc']

export const CARDPHOTO_LIST_SORT_ICON_KEYS = [
  'sort131Up',
  'sort131Down',
] as const satisfies readonly IconKey[]

export type CardphotoListSortIconKey =
  (typeof CARDPHOTO_LIST_SORT_ICON_KEYS)[number]

export function isCardphotoListSortIconKey(
  key: IconKey,
): key is CardphotoListSortIconKey {
  return (CARDPHOTO_LIST_SORT_ICON_KEYS as readonly IconKey[]).includes(key)
}

export function getCardphotoListSortIconForMode(
  mode: CardphotoListSortMode,
): IconKey {
  return CARDPHOTO_LIST_SORT_MODE_TO_ICON[mode]
}

export function getNextCardphotoListSortMode(
  current: CardphotoListSortMode,
): CardphotoListSortMode {
  const idx = CARDPHOTO_LIST_SORT_MODE_SEQUENCE.indexOf(current)
  return CARDPHOTO_LIST_SORT_MODE_SEQUENCE[
    (idx < 0 ? 0 : idx + 1) % CARDPHOTO_LIST_SORT_MODE_SEQUENCE.length
  ]
}

function compareByDateDesc(
  a: CardphotoListSortableRow,
  b: CardphotoListSortableRow,
): number {
  return (b.timestamp ?? 0) - (a.timestamp ?? 0)
}

function compareByDateAsc(
  a: CardphotoListSortableRow,
  b: CardphotoListSortableRow,
): number {
  return (a.timestamp ?? 0) - (b.timestamp ?? 0)
}

export function sortCardphotoListRows<T extends CardphotoListSortableRow>(
  rows: readonly T[],
  mode: CardphotoListSortMode,
): T[] {
  if (rows.length <= 1) return [...rows]
  return mode === 'dateAsc'
    ? [...rows].sort(compareByDateAsc)
    : [...rows].sort(compareByDateDesc)
}
