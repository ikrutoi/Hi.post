import type { PostcardHydrated } from '@entities/postcard'

export type PostcardLwwMerge = {
  /** Rows that should live in IndexedDB after merge. */
  nextLocal: PostcardHydrated[]
  /** Local winners / local-only rows to upsert to /v2. */
  push: PostcardHydrated[]
}

function updatedAt(row: PostcardHydrated): number {
  return row.updatedAt ?? row.createdAt ?? 0
}

/** Last-write-wins by `updatedAt`. Equal timestamps keep remote. */
export function mergePostcardsLastWriteWins(
  localRows: PostcardHydrated[],
  remoteRows: PostcardHydrated[],
): PostcardLwwMerge {
  const localById = new Map(localRows.map((row) => [row.id, row]))
  const remoteById = new Map(remoteRows.map((row) => [row.id, row]))
  const ids = new Set([...localById.keys(), ...remoteById.keys()])
  const nextLocal: PostcardHydrated[] = []
  const push: PostcardHydrated[] = []

  for (const id of ids) {
    const local = localById.get(id)
    const remote = remoteById.get(id)

    if (local && !remote) {
      nextLocal.push(local)
      push.push(local)
      continue
    }

    if (remote && !local) {
      nextLocal.push(remote)
      continue
    }

    if (local && remote) {
      if (updatedAt(local) > updatedAt(remote)) {
        nextLocal.push(local)
        push.push(local)
      } else {
        nextLocal.push(remote)
      }
    }
  }

  return { nextLocal, push }
}
