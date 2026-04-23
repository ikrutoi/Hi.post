/** «Имя, регион» → две части для второй строки списка дат / корзины. */
export function parseListEntryRecipientDetail(
  detailLine: string | null | undefined,
): { name: string; region: string } | null {
  if (detailLine == null) return null
  const t = detailLine.trim()
  if (!t) return null
  const idx = t.indexOf(',')
  if (idx === -1) return { name: t, region: '' }
  return {
    name: t.slice(0, idx).trim(),
    region: t.slice(idx + 1).trim(),
  }
}
