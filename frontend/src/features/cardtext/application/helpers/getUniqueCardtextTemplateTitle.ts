/** Уникальное имя шаблона среди уже существующих (добавляет " (1)", " (2)", …). */
export function getUniqueCardtextTemplateTitle(
  baseTitle: string,
  existingTitles: Set<string>,
): string {
  if (!baseTitle) return baseTitle
  if (!existingTitles.has(baseTitle)) return baseTitle
  let n = 1
  while (existingTitles.has(`${baseTitle} (${n})`)) n++
  return `${baseTitle} (${n})`
}
