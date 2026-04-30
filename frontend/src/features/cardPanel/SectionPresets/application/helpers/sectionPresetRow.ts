import type { PostcardHydrated } from '@entities/postcard'
import type { DraftsItem } from '@entities/drafts/domain/types'
import type { AddressTemplateItem } from '@entities/envelope/domain/types'

export type SectionPresetRow = PostcardHydrated | DraftsItem | AddressTemplateItem

export function sectionPresetRowId(row: SectionPresetRow): string {
  if ('postcard' in row && 'card' in row) return row.id
  if ('card' in row) return String((row as DraftsItem).localId)
  return (row as AddressTemplateItem).id
}

export function isMemoryPresetRow(
  row: SectionPresetRow
): row is PostcardHydrated | DraftsItem {
  return 'card' in row
}
