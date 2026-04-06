import type { IDBPDatabase, IDBPTransaction } from 'idb'
import type { Card } from '@entities/card/domain/types'
import type { Postcard, CardStatus, PostcardRecordMeta } from '@entities/postcard'
import { normalizePostcardRecord } from '@entities/postcard'
import type { DraftsItem } from '@entities/drafts/domain/types'
import { normalizeDraftsItemRecord } from '@entities/drafts/domain/types'

const MIGRATION_TARGET_VERSION = 14

type VersionChangeTx = IDBPTransaction<unknown, string[], 'versionchange'>

type LegacyCardFields = Card & {
  status?: string
  meta?: Partial<PostcardRecordMeta>
}

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
  const inner = d.card as LegacyCardFields
  const st = inner.status
  const status: CardStatus =
    st === 'cart' ? 'cart' : st === 'favorite' ? 'favorite' : 'favorite'

  const m = inner.meta
  const now = Date.now()
  const createdAt = m?.createdAt ?? now
  const updatedAt = m?.updatedAt ?? createdAt

  const { status: _st, meta: _meta, ...cardFields } = inner
  const card = cardFields as Card

  const postcard: Postcard = {
    localId: d.localId,
    price: m?.price ?? '',
    status,
    createdAt,
    updatedAt,
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

