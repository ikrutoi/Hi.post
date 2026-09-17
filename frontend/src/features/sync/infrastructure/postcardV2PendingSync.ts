import type { PostcardHydrated } from '@entities/postcard'
import {
  deleteV2Postcard,
  upsertV2Postcard,
} from './v2PostcardRemote'

type PendingOp =
  | { type: 'upsert'; postcard: PostcardHydrated }
  | { type: 'delete' }

const pending = new Map<string, PendingOp>()

export function enqueuePostcardUpsert(postcard: PostcardHydrated): void {
  if (!postcard.id) return
  pending.set(postcard.id, { type: 'upsert', postcard })
}

export function enqueuePostcardDelete(id: string): void {
  if (!id) return
  pending.set(id, { type: 'delete' })
}

export function hasPendingV2Sync(): boolean {
  return pending.size > 0
}

export async function flushPendingV2Sync(): Promise<void> {
  if (pending.size === 0) return

  const batch = [...pending.entries()]
  pending.clear()

  for (const [id, op] of batch) {
    try {
      if (op.type === 'delete') {
        await deleteV2Postcard(id)
      } else {
        await upsertV2Postcard(op.postcard)
      }
    } catch {
      if (!pending.has(id)) {
        pending.set(id, op)
      }
    }
  }
}
