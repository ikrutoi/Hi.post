import type { PostcardHydrated } from '@entities/postcard'
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
  | { type: 'delete' }

type LibraryOp =
  | { type: 'upsert'; kind: V2LibraryKind; item: V2LibraryItem }
  | { type: 'delete'; kind: V2LibraryKind }

const pendingPostcards = new Map<string, PostcardOp>()
const pendingLibrary = new Map<string, LibraryOp>()

function libraryKey(kind: V2LibraryKind, id: string): string {
  return `${kind}:${id}`
}

export function enqueuePostcardUpsert(postcard: PostcardHydrated): void {
  if (!postcard.id) return
  pendingPostcards.set(postcard.id, { type: 'upsert', postcard })
}

export function enqueuePostcardDelete(id: string): void {
  if (!id) return
  pendingPostcards.set(id, { type: 'delete' })
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
}

export function enqueueLibraryDelete(kind: V2LibraryKind, id: string): void {
  if (!id) return
  pendingLibrary.set(libraryKey(kind, id), { type: 'delete', kind })
}

export function hasPendingV2Sync(): boolean {
  return pendingPostcards.size > 0 || pendingLibrary.size > 0
}

export async function flushPendingV2Sync(): Promise<void> {
  if (!hasPendingV2Sync()) return

  const postcardBatch = [...pendingPostcards.entries()]
  const libraryBatch = [...pendingLibrary.entries()]
  pendingPostcards.clear()
  pendingLibrary.clear()

  for (const [id, op] of postcardBatch) {
    try {
      if (op.type === 'delete') await deleteV2Postcard(id)
      else await upsertV2Postcard(op.postcard)
    } catch {
      if (!pendingPostcards.has(id)) pendingPostcards.set(id, op)
    }
  }

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
