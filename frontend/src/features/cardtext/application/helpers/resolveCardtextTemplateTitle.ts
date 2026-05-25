import { getUniqueCardtextTemplateTitle } from './getUniqueCardtextTemplateTitle'
import { suggestCardtextTemplateTitle } from './suggestCardtextTemplateTitle'

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
