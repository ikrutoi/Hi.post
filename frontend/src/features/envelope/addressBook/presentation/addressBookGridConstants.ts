import type { PanelDensity2Size } from '@shared/ui/icons'

/** Число ячеек в строке: density 1 — крупнее (4), density 2 — компактнее (5). */
export const ADDRESS_BOOK_GRID_COLUMNS_BY_DENSITY: Record<
  PanelDensity2Size,
  number
> = {
  1: 4,
  2: 5,
}

export function getAddressBookGridColumns(
  density: PanelDensity2Size = 1,
): number {
  return ADDRESS_BOOK_GRID_COLUMNS_BY_DENSITY[density] ?? 4
}
