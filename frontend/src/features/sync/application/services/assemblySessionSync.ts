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
/** Session was saved while a pull was writing it back. Push that edit after. */
let assemblyEditedDuringSuppress = false

export function beginAssemblyCloudPushSuppression(): void {
  suppressAssemblyCloudPush += 1
}

export function isAssemblyCloudPushSuppressed(): boolean {
  return suppressAssemblyCloudPush > 0
}

export function noteAssemblyEditedDuringSuppression(): void {
  if (suppressAssemblyCloudPush > 0) assemblyEditedDuringSuppress = true
}

/** Returns true when this device edited assembly during the suppress window. */
export function endAssemblyCloudPushSuppression(): boolean {
  suppressAssemblyCloudPush = Math.max(0, suppressAssemblyCloudPush - 1)
  if (suppressAssemblyCloudPush > 0 || !assemblyEditedDuringSuppress) return false
  assemblyEditedDuringSuppress = false
  return true
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
    const localTs = local?.timestamp ?? 0
    /**
     * Only a newer save from another device replaces this browser.
     * An older server copy must not snap an open editor back to applied.
     */
    if (localTs >= next.timestamp) {
      if (localTs > next.timestamp && local != null && !hasPendingLibraryUpsert('assembly', ASSEMBLY_ID)) {
        pushAssemblySession(local)
      }
      return false
    }
    await storeAdapters.session.put(next)
    return true
  } catch {
    return false
  }
}
