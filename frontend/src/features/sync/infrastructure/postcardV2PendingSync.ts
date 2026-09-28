import type { PostcardHydrated } from '@entities/postcard'
import { readAuthSession } from '@features/auth/infrastructure/sessionStorage'
import { isHttpAuthMode } from '@shared/config/authMode'
import {
  deleteV2Postcard,
  upsertV2Postcard,
} from './v2PostcardRemote'
import type { V2LibraryItem, V2LibraryKind } from '../domain/types/v2Library.types'
import {
  deleteV2LibraryItem,
  upsertV2LibraryItem,
} from './v2LibraryRemote'

type PostcardOp =
  | { type: 'upsert'; postcard: PostcardHydrated }
  | { type: 'delete'; localId: number | null }

type LibraryOp =
  | { type: 'upsert'; kind: V2LibraryKind; item: V2LibraryItem }
  | { type: 'delete'; kind: V2LibraryKind }

const DELETE_TOMBSTONE_KEY = 'hi.post.v2.postcardDeleteIds'

const pendingPostcards = new Map<string, PostcardOp>()
const pendingLibrary = new Map<string, LibraryOp>()

type DeleteTombstone = { id: string; localId: number | null }

function readDeleteTombstones(): DeleteTombstone[] {
  if (typeof localStorage === 'undefined') return []
  try {
    const raw = localStorage.getItem(DELETE_TOMBSTONE_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    if (!Array.isArray(parsed)) return []
    const tombstones: DeleteTombstone[] = []
    for (const item of parsed) {
      if (typeof item === 'string' && item !== '') {
        tombstones.push({ id: item, localId: null })
        continue
      }
      if (item == null || typeof item !== 'object') continue
      const id = (item as { id?: unknown }).id
      const localId = (item as { localId?: unknown }).localId
      if (typeof id !== 'string' || id === '') continue
      tombstones.push({
        id,
        localId: typeof localId === 'number' ? localId : null,
      })
    }
    return tombstones
  } catch {
    return []
  }
}

function writeDeleteTombstones(ids: DeleteTombstone[]): void {
  if (typeof localStorage === 'undefined') return
  if (ids.length === 0) {
    localStorage.removeItem(DELETE_TOMBSTONE_KEY)
    return
  }
  localStorage.setItem(DELETE_TOMBSTONE_KEY, JSON.stringify(ids))
}

function persistDeleteTombstones(): void {
  const ids = [...pendingPostcards.entries()].flatMap(([id, op]) =>
    op.type === 'delete' ? [{ id, localId: op.localId }] : [],
  )
  writeDeleteTombstones(ids)
}

for (const tombstone of readDeleteTombstones()) {
  pendingPostcards.set(tombstone.id, {
    type: 'delete',
    localId: tombstone.localId,
  })
}

const V2_SYNC_DEBOUNCE_MS = 3000
let flushTimer: ReturnType<typeof setTimeout> | null = null
let pageHideFlushBound = false

function schedulePendingV2Flush(): void {
  if (flushTimer != null) clearTimeout(flushTimer)
  flushTimer = setTimeout(() => {
    flushTimer = null
    void flushPendingV2Sync()
  }, V2_SYNC_DEBOUNCE_MS)
  bindPageHideFlushOnce()
}

function bindPageHideFlushOnce(): void {
  if (pageHideFlushBound || typeof window === 'undefined') return
  pageHideFlushBound = true
  const flushNow = () => {
    if (flushTimer != null) {
      clearTimeout(flushTimer)
      flushTimer = null
    }
    void flushPendingV2Sync()
  }
  window.addEventListener('pagehide', flushNow)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushNow()
  })
}

function libraryKey(kind: V2LibraryKind, id: string): string {
  return `${kind}:${id}`
}

export function enqueuePostcardUpsert(postcard: PostcardHydrated): void {
  if (!postcard.id) return
  if (isPostcardPendingDelete(postcard)) return
  pendingPostcards.set(postcard.id, { type: 'upsert', postcard })
  schedulePendingV2Flush()
}

export function enqueuePostcardDelete(
  id: string,
  localId?: number | null,
): void {
  if (!id) return
  const prev = pendingPostcards.get(id)
  const nextLocalId =
    typeof localId === 'number'
      ? localId
      : prev?.type === 'delete'
        ? prev.localId
        : null
  pendingPostcards.set(id, { type: 'delete', localId: nextLocalId })
  persistDeleteTombstones()
  schedulePendingV2Flush()
}

/** Ids removed locally but not yet confirmed on the server. */
export function pendingPostcardDeleteIds(): ReadonlySet<string> {
  const ids = new Set<string>()
  for (const [id, op] of pendingPostcards) {
    if (op.type === 'delete') ids.add(id)
  }
  return ids
}

export function isPostcardPendingDelete(row: {
  id?: unknown
  localId?: number
}): boolean {
  const id = row.id != null && row.id !== '' ? String(row.id) : ''
  if (id && pendingPostcardDeleteIds().has(id)) return true
  if (typeof row.localId !== 'number') return false
  for (const op of pendingPostcards.values()) {
    if (op.type === 'delete' && op.localId === row.localId) return true
  }
  return false
}

function isNotFound(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error != null &&
    'response' in error &&
    (error as { response?: { status?: number } }).response?.status === 404
  )
}

export function enqueueLibraryUpsert(
  kind: V2LibraryKind,
  item: V2LibraryItem,
): void {
  if (!item.id) return
  pendingLibrary.set(libraryKey(kind, item.id), {
    type: 'upsert',
    kind,
    item: { ...item, updatedAt: item.updatedAt ?? Date.now() },
  })
  schedulePendingV2Flush()
}

export function enqueueLibraryDelete(kind: V2LibraryKind, id: string): void {
  if (!id) return
  pendingLibrary.set(libraryKey(kind, id), { type: 'delete', kind })
  schedulePendingV2Flush()
}

export function hasPendingV2Sync(): boolean {
  return pendingPostcards.size > 0 || pendingLibrary.size > 0
}

export async function flushPendingV2Sync(): Promise<void> {
  if (!hasPendingV2Sync()) return
  if (isHttpAuthMode() && !readAuthSession()?.token) return

  const postcardBatch = [...pendingPostcards.entries()]
  const libraryBatch = [...pendingLibrary.entries()]
  pendingPostcards.clear()
  pendingLibrary.clear()

  for (const [id, op] of postcardBatch) {
    try {
      if (op.type === 'delete') await deleteV2Postcard(id)
      else await upsertV2Postcard(op.postcard)
    } catch (error) {
      if (op.type === 'delete' && isNotFound(error)) continue
      if (!pendingPostcards.has(id)) pendingPostcards.set(id, op)
    }
  }
  persistDeleteTombstones()

  for (const [key, op] of libraryBatch) {
    try {
      if (op.type === 'delete') {
        const id = key.slice(op.kind.length + 1)
        await deleteV2LibraryItem(op.kind, id)
      } else {
        await upsertV2LibraryItem(op.kind, op.item)
      }
    } catch {
      if (!pendingLibrary.has(key)) pendingLibrary.set(key, op)
    }
  }
}
