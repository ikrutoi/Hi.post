import type { SessionData } from '@entities/db/domain/types'
import { storeAdapters } from '@db/adapters/storeAdapters'
import {
  enqueueLibraryUpsert,
  hasPendingLibraryUpsert,
} from '../../infrastructure/postcardV2PendingSync'
import { fetchV2Library } from '../../infrastructure/v2LibraryRemote'
import { libraryItemUpdatedAt, type V2LibraryItem } from '../../domain/types/v2Library.types'

const ASSEMBLY_ID = 'current'
const SESSION_ID = 'current_session'

let suppressAssemblyCloudPush = 0

export function beginAssemblyCloudPushSuppression(): void {
  suppressAssemblyCloudPush += 1
}

export function endAssemblyCloudPushSuppression(): void {
  suppressAssemblyCloudPush = Math.max(0, suppressAssemblyCloudPush - 1)
}

function jsonReplacer(key: string, value: unknown): unknown {
  if (key === 'blob') return undefined
  if (typeof value === 'string' && value.startsWith('blob:')) return ''
  return value
}

/** Queue the working assembly (pie section fills) for /v2/assembly. */
export function pushAssemblySession(session: SessionData): void {
  if (suppressAssemblyCloudPush > 0) return
  const raw = JSON.parse(JSON.stringify(session, jsonReplacer)) as SessionData
  enqueueLibraryUpsert('assembly', {
    ...(raw as unknown as V2LibraryItem),
    id: ASSEMBLY_ID,
    updatedAt: session.timestamp,
  })
}

function sessionFromRemote(item: V2LibraryItem): SessionData | null {
  const timestamp = libraryItemUpdatedAt(item)
  if (!timestamp) return null
  const copy = { ...item }
  delete copy.updatedAt
  return {
    ...(copy as unknown as SessionData),
    id: SESSION_ID,
    timestamp,
  }
}

/**
 * If another device saved a newer assembly, write it into IndexedDB.
 * Returns true when the local session was replaced.
 */
export async function pullAssemblySessionIntoIdb(): Promise<boolean> {
  try {
    const remote = (await fetchV2Library('assembly')).find((row) => row.id === ASSEMBLY_ID)
    if (remote == null) return false
    const next = sessionFromRemote(remote)
    if (next == null) return false
    const local = await storeAdapters.session.getById(SESSION_ID)
    const localDirty = hasPendingLibraryUpsert('assembly', ASSEMBLY_ID)
    if (
      localDirty &&
      local != null &&
      local.timestamp > next.timestamp
    ) {
      return false
    }
    if ((local?.timestamp ?? 0) === next.timestamp) return false
    await storeAdapters.session.put(next)
    return true
  } catch {
    return false
  }
}
