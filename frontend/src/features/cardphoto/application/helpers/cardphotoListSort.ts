import type { IconKey } from '@shared/config/constants'
export type CardphotoListTitleCoverage = 'none' | 'all' | 'mixed'

export type CardphotoListSortMode =
  | 'dateDesc'
  | 'dateAsc'
  | 'titleAsc'
  | 'titleDesc'

export type CardphotoListSortableRow = {
  id: string
  title?: string
  timestamp: number
}

export const CARDPHOTO_LIST_SORT_MODE_TO_ICON: Record<
  CardphotoListSortMode,
  IconKey
> = {
  dateDesc: 'sortDown',
  dateAsc: 'sortUp',
  titleAsc: 'sortAZDown',
  titleDesc: 'sortAZUp',
}

export const CARDPHOTO_LIST_SORT_ICON_KEYS = [
  'sortDown',
  'sortUp',
  'sortAZDown',
  'sortAZUp',
] as const satisfies readonly IconKey[]

export type CardphotoListSortIconKey =
  (typeof CARDPHOTO_LIST_SORT_ICON_KEYS)[number]

export function isCardphotoListSortIconKey(
  key: IconKey,
): key is CardphotoListSortIconKey {
  return (CARDPHOTO_LIST_SORT_ICON_KEYS as readonly IconKey[]).includes(key)
}

export function hasCardphotoListTitle(row: CardphotoListSortableRow): boolean {
  return Boolean(row.title?.trim())
}

export function resolveCardphotoListTitleCoverage(
  rows: readonly CardphotoListSortableRow[],
): CardphotoListTitleCoverage {
  if (rows.length === 0) return 'none'
  const withTitle = rows.filter(hasCardphotoListTitle).length
  if (withTitle === 0) return 'none'
  if (withTitle === rows.length) return 'all'
  return 'mixed'
}

export function getDefaultCardphotoListSortMode(
  coverage: CardphotoListTitleCoverage,
): CardphotoListSortMode {
  return coverage === 'all' ? 'titleAsc' : 'dateDesc'
}

export function getCardphotoListSortModeSequence(
  coverage: CardphotoListTitleCoverage,
): readonly CardphotoListSortMode[] {
  switch (coverage) {
    case 'none':
      return ['dateDesc', 'dateAsc']
    case 'all':
      return ['titleAsc', 'titleDesc']
    case 'mixed':
      return ['dateDesc', 'dateAsc', 'titleAsc', 'titleDesc']
  }
}

export function getCardphotoListSortIconForMode(
  mode: CardphotoListSortMode,
): IconKey {
  return CARDPHOTO_LIST_SORT_MODE_TO_ICON[mode]
}

export function getNextCardphotoListSortMode(
  coverage: CardphotoListTitleCoverage,
  current: CardphotoListSortMode,
): CardphotoListSortMode {
  const sequence = getCardphotoListSortModeSequence(coverage)
  const idx = sequence.indexOf(current)
  return sequence[(idx < 0 ? 0 : idx + 1) % sequence.length]
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

function compareByTitleAsc(
  a: CardphotoListSortableRow,
  b: CardphotoListSortableRow,
): number {
  return (a.title ?? '').localeCompare(b.title ?? '', undefined, {
    sensitivity: 'base',
  })
}

function compareByTitleDesc(
  a: CardphotoListSortableRow,
  b: CardphotoListSortableRow,
): number {
  return compareByTitleAsc(b, a)
}

export function sortCardphotoListRows<T extends CardphotoListSortableRow>(
  rows: readonly T[],
  mode: CardphotoListSortMode,
): T[] {
  if (rows.length <= 1) return [...rows]

  switch (mode) {
    case 'dateDesc':
      return [...rows].sort(compareByDateDesc)
    case 'dateAsc':
      return [...rows].sort(compareByDateAsc)
    case 'titleAsc': {
      const withTitle = rows.filter(hasCardphotoListTitle)
      const withoutTitle = rows.filter((row) => !hasCardphotoListTitle(row))
      if (withoutTitle.length === 0) {
        return [...withTitle].sort(compareByTitleAsc)
      }
      if (withTitle.length === 0) {
        return [...withoutTitle].sort(compareByDateDesc)
      }
      return [
        ...[...withTitle].sort(compareByTitleAsc),
        ...[...withoutTitle].sort(compareByDateDesc),
      ]
    }
    case 'titleDesc': {
      const withTitle = rows.filter(hasCardphotoListTitle)
      const withoutTitle = rows.filter((row) => !hasCardphotoListTitle(row))
      if (withoutTitle.length === 0) {
        return [...withTitle].sort(compareByTitleDesc)
      }
      if (withTitle.length === 0) {
        return [...withoutTitle].sort(compareByDateAsc)
      }
      return [
        ...[...withTitle].sort(compareByTitleDesc),
        ...[...withoutTitle].sort(compareByDateAsc),
      ]
    }
  }
}
