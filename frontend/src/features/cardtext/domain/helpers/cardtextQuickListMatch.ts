import type { CardtextContent } from '../editor/editor.types'

function normalizePlainText(plainText: string | undefined): string {
  return (plainText ?? '').trim()
}

/** Запись из панели шаблонов (inLine), совпадающая с текущим текстом сессии. */
export function findCardtextQuickListMatch(
  plainText: string,
  templates: CardtextContent[] | null | undefined,
  assetId: string | null,
): CardtextContent | null {
  const list = templates ?? []
  const normalized = normalizePlainText(plainText)
  if (!normalized) return null

  if (assetId != null) {
    const byId = list.find(
      (t) => t.id != null && String(t.id) === String(assetId),
    )
    if (byId && normalizePlainText(byId.plainText) === normalized) return byId
  }

  return (
    list.find((t) => normalizePlainText(t.plainText) === normalized) ?? null
  )
}

export function isCardtextInQuickList(
  plainText: string,
  templates: CardtextContent[] | null | undefined,
  assetId: string | null,
): boolean {
  return findCardtextQuickListMatch(plainText, templates, assetId) != null
}

/** enabled — можно добавить в список; disabled — уже в списке или пустой текст. */
export function resolveCardtextAddListToolbarState(
  hasText: boolean,
  plainText: string,
  templates: CardtextContent[] | null | undefined,
  assetId: string | null,
): 'enabled' | 'disabled' {
  if (!hasText) return 'disabled'
  if (isCardtextInQuickList(plainText, templates, assetId)) return 'disabled'
  return 'enabled'
}
