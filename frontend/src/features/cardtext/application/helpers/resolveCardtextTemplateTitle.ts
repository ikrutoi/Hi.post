import { getUniqueCardtextTemplateTitle } from './getUniqueCardtextTemplateTitle'
import { suggestCardtextTemplateTitle } from './suggestCardtextTemplateTitle'

/** Titles for uniqueness; `exceptId` skips the record being updated so it does not get « (1)». */
export function titlesForCardtextUniqueness(
  templates:
    | Iterable<{ id?: string | null; title?: string | null }>
    | null
    | undefined,
  exceptId?: string | null,
): string[] {
  const skip =
    exceptId != null && String(exceptId).length > 0 ? String(exceptId) : null
  return [...(templates ?? [])]
    .filter((t) => skip == null || t.id == null || String(t.id) !== skip)
    .map((t) => t.title ?? '')
}

/** Заголовок для БД: явный или из текста; при коллизиях — суффикс « (n)». */
export function resolveCardtextTemplateTitle(
  plainText: string,
  existingTitles: Iterable<string>,
  explicitTitle?: string,
): string {
  const base =
    explicitTitle?.trim() || suggestCardtextTemplateTitle(plainText)
  if (!base) return ''
  const existing = new Set(
    [...existingTitles].map((t) => t?.trim() ?? '').filter(Boolean),
  )
  return getUniqueCardtextTemplateTitle(base, existing)
}
