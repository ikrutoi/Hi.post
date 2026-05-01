import type { PostcardHydrated } from './types/postcard.types'
import { postcardRefsFromCard } from './types/postcard.types'

/**
 * Есть ли среди открыток ссылка на шаблон cardtext с данным `templateId`
 * (см. `postcardRefsFromCard` — appliedData / assetData id).
 * Используется для политики A/B при сохранении: при `true` — fork (новый id),
 * при `false` — можно обновлять запись под тем же id.
 */
export function anyPostcardReferencesCardtextTemplateId(
  items: readonly PostcardHydrated[],
  templateId: string,
): boolean {
  const needle = String(templateId).trim()
  if (needle === '') return false
  for (const p of items) {
    if (postcardRefsFromCard(p.card).cardtext === needle) return true
  }
  return false
}
