import type { IDBPDatabase, IDBPTransaction } from 'idb'
import type { Postcard } from '@entities/postcard'
import { normalizePostcardRecord } from '@entities/postcard'

/** Текущая версия AppDB (см. `openDB` в `db/core.ts`). */
export const APP_DB_VERSION = 15

type VersionChangeTx = IDBPTransaction<unknown, string[], 'versionchange'>

/**
 * Приводит все строки `postcards` к каноническому виду: метаданные на корне,
 * без легаси `status` / `meta` на вложенном `card` (id по-прежнему ключ IDB).
 */
export async function migratePostcardsToCanonicalShape(
  db: IDBPDatabase<unknown>,
  transaction: VersionChangeTx,
  oldVersion: number,
): Promise<void> {
  if (oldVersion >= APP_DB_VERSION) return
  if (!db.objectStoreNames.contains('postcards')) return

  const store = transaction.objectStore('postcards')
  const rows = await store.getAll()

  for (const row of rows) {
    const r = row as Postcard & { id?: string }
    const id = r.id ?? r.card?.id
    if (id == null) continue

    const normalized = normalizePostcardRecord(r as Postcard)
    await store.put({
      ...normalized,
      id: String(id),
    } as Postcard & { id: string })
  }
}
