import type { IDBPDatabase, IDBPTransaction } from 'idb'
import type { Card } from '@entities/card/domain/types'
import type { Postcard } from '@entities/postcard'
import { normalizePostcardRecord } from '@entities/postcard'
import type { DraftsItem } from '@entities/drafts/domain/types'
import { normalizeDraftsItemRecord } from '@entities/drafts/domain/types'

const MIGRATION_TARGET_VERSION = 14

type VersionChangeTx = IDBPTransaction<unknown, string[], 'versionchange'>

function postcardWithId(p: Postcard, explicitId?: string): Postcard & { id: string } {
  const id = explicitId ?? p.card.id
  return { ...p, id }
}

function migrateCartRow(row: unknown): Postcard & { id: string } {
  const p = normalizePostcardRecord(row as Postcard)
  const id = String((row as { id?: string }).id ?? p.card.id)
  return postcardWithId(p, id)
}

function migrateDraftsRow(row: unknown): Postcard & { id: string } {
  const d = normalizeDraftsItemRecord(row as DraftsItem)
  let card: Card = { ...d.card }
  const st = card.status as string
  if (st === 'drafts' || (st !== 'favorite' && st !== 'cart')) {
    card = { ...card, status: 'favorite' }
  }
  const postcard: Postcard = {
    localId: d.localId,
    price: card.meta?.price ?? '',
    card,
  }
  return postcardWithId(postcard)
}

/**
 * Копирует `cart` и `drafts` в `postcards`, затем удаляет старые stores.
 * Вызывать только из `upgrade` при переходе на версию ≥ MIGRATION_TARGET_VERSION.
 */
export async function migrateLegacyCartDraftsToPostcards(
  db: IDBPDatabase<unknown>,
  transaction: VersionChangeTx,
  oldVersion: number,
): Promise<void> {
  if (oldVersion >= MIGRATION_TARGET_VERSION) return

  if (!db.objectStoreNames.contains('postcards')) return

  const pcStore = transaction.objectStore('postcards')

  if (db.objectStoreNames.contains('cart')) {
    const cartStore = transaction.objectStore('cart')
    const rows = await cartStore.getAll()
    for (const row of rows) {
      const p = migrateCartRow(row)
      const existing = await pcStore.get(p.id)
      if (!existing) await pcStore.put(p)
    }
  }

  if (db.objectStoreNames.contains('drafts')) {
    const draftsStore = transaction.objectStore('drafts')
    const rows = await draftsStore.getAll()
    for (const row of rows) {
      const p = migrateDraftsRow(row)
      const existing = await pcStore.get(p.id)
      if (!existing) await pcStore.put(p)
    }
  }

  if (db.objectStoreNames.contains('cart')) {
    db.deleteObjectStore('cart')
  }
  if (db.objectStoreNames.contains('drafts')) {
    db.deleteObjectStore('drafts')
  }
}

export const POSTCARDS_IDB_MIGRATION_VERSION = MIGRATION_TARGET_VERSION
