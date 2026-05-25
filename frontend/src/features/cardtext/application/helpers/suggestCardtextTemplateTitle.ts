export const CARDTEXT_TEMPLATE_TITLE_MAX_LENGTH = 32

const DEFAULT_AUTO_TITLE_MAX_LENGTH = 28

/** Подпись шаблона из начала plainText (для автосохранения и сортировки). */
export function suggestCardtextTemplateTitle(
  plainText: string,
  maxLength = DEFAULT_AUTO_TITLE_MAX_LENGTH,
): string {
  const normalized = plainText.replace(/\s+/g, ' ').trim()
  if (!normalized) return ''
  if (normalized.length <= maxLength) return normalized

  const slice = normalized.slice(0, maxLength)
  const lastSpace = slice.lastIndexOf(' ')
  if (lastSpace > maxLength * 0.5) {
    return slice.slice(0, lastSpace).trim()
  }
  return slice.trim()
}

export function getCardtextTemplateDisplayTitle(entry: {
  title?: string
  plainText?: string
}): string {
  const explicit = entry.title?.trim() ?? ''
  if (explicit) return explicit
  const suggested = suggestCardtextTemplateTitle(entry.plainText ?? '')
  return suggested || '?'
}
