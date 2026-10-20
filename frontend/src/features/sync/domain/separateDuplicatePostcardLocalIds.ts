import type { PostcardHydrated } from '@entities/postcard'

export type SeparatedPostcardLocalIds = {
  rows: PostcardHydrated[]
  /** Строки, которым выдан новый `localId`. */
  changed: PostcardHydrated[]
}

/**
 * В корзине и истории выбор идёт по `localId`.
 * После слияния гостевых и аккаунтных открыток два разных id могут
 * получить один номер: клик подсвечивает обе строки, а пай показывает первую.
 * Ранняя по `createdAt` оставляет номер, остальные получают следующий свободный.
 */
export function separateDuplicatePostcardLocalIds(
  rows: readonly PostcardHydrated[],
  now = Date.now(),
): SeparatedPostcardLocalIds {
  const order = rows.map((row, index) => ({ row, index }))
  order.sort((a, b) => {
    const created = (a.row.createdAt ?? 0) - (b.row.createdAt ?? 0)
    if (created !== 0) return created
    const id = String(a.row.id ?? '').localeCompare(String(b.row.id ?? ''))
    if (id !== 0) return id
    return a.index - b.index
  })

  let max = 0
  for (const row of rows) {
    if (typeof row.localId === 'number' && row.localId > max) max = row.localId
  }

  const used = new Set<number>()
  const byIndex = new Map<number, PostcardHydrated>()
  const changed: PostcardHydrated[] = []

  for (const { row, index } of order) {
    const localId = row.localId
    if (typeof localId === 'number' && localId > 0 && !used.has(localId)) {
      used.add(localId)
      byIndex.set(index, row)
      continue
    }
    max += 1
    used.add(max)
    const next = { ...row, localId: max, updatedAt: now }
    byIndex.set(index, next)
    changed.push(next)
  }

  return {
    rows: rows.map((row, index) => byIndex.get(index) ?? row),
    changed,
  }
}
