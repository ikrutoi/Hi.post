import type { StoreAdapter } from '@/db/types'
import type { V2LibraryItem, V2LibraryKind } from '../domain/types/v2Library.types'
import {
  enqueueLibraryDelete,
  enqueueLibraryUpsert,
} from './postcardV2PendingSync'

type RowWithId = { id?: string | null }

export function withLibraryRemoteSync<T extends RowWithId>(
  base: StoreAdapter<T>,
  kind: V2LibraryKind,
  options?: {
    shouldSync?: (row: T) => boolean
    stamp?: (row: T) => T
  },
): StoreAdapter<T> & { putLocal: StoreAdapter<T>['put'] } {
  const putLocal = base.put

  return {
    ...base,
    putLocal,
    put: async (record: T & { id: IDBValidKey }) => {
      const stamped = options?.stamp ? options.stamp(record as T) : (record as T)
      await putLocal(stamped as T & { id: IDBValidKey })
      const id = stamped.id != null ? String(stamped.id) : ''
      if (!id) return
      if (options?.shouldSync && !options.shouldSync(stamped)) return
      enqueueLibraryUpsert(kind, { ...(stamped as unknown as V2LibraryItem), id })
    },
    deleteById: async (id: IDBValidKey) => {
      await base.deleteById(id)
      enqueueLibraryDelete(kind, String(id))
    },
  }
}
