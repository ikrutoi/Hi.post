import { getDatabase, handleTransactionPromise } from '@db/core'
import type { StoreAdapter } from '@/db/types'

export const createStoreAdapter = <T>(storeName: string): StoreAdapter<T> => {
  const getAll = async (): Promise<T[]> => {
    const db = await getDatabase()
    const tx = db.transaction(storeName, 'readonly')
    const result = await tx.objectStore(storeName).getAll()
    await handleTransactionPromise(tx)
    return result || []
  }

  const getById = async (id: IDBValidKey): Promise<T | null> => {
    const db = await getDatabase()
    const tx = db.transaction(storeName, 'readonly')
    const result = await tx.objectStore(storeName).get(id)
    await handleTransactionPromise(tx)
    return result || null
  }

  const put = async (record: T & { id: IDBValidKey }): Promise<void> => {
    const db = await getDatabase()
    const tx = db.transaction(storeName, 'readwrite')
    tx.objectStore(storeName).put(record)
    await handleTransactionPromise(tx)
  }

  const deleteById = async (id: IDBValidKey): Promise<void> => {
    const db = await getDatabase()
    const tx = db.transaction(storeName, 'readwrite')
    tx.objectStore(storeName).delete(id)
    await handleTransactionPromise(tx)
  }

  const getMaxLocalId = async (): Promise<number> => {
    const all = await getAll()
    const localIds = (all as { localId?: number; id?: string | number }[])
      .map((r) => {
        if (typeof r.localId === 'number') return r.localId
        if (typeof r.id === 'number') return r.id
        if (typeof r.id === 'string') {
          const numId = Number.parseInt(r.id, 10)
          return Number.isNaN(numId) ? 0 : numId
        }
        return 0
      })
      .filter((id): id is number => typeof id === 'number' && id > 0)

    return localIds.length > 0 ? Math.max(...localIds) : 0
  }

  const addRecordWithId = async (
    id: IDBValidKey,
    recordPayload: Omit<T, 'id'>,
  ): Promise<void> => {
    await put({ id, ...recordPayload } as T & { id: IDBValidKey })
  }

  const clear = async (): Promise<void> => {
    const db = await getDatabase()
    const tx = db.transaction(storeName, 'readwrite')
    const store = tx.objectStore(storeName)
    store.clear()
    await handleTransactionPromise(tx)
  }

  const count = async (): Promise<number> => {
    const db = await getDatabase()
    const tx = db.transaction(storeName, 'readonly')
    const store = tx.objectStore(storeName)
    const result = await store.count()
    await handleTransactionPromise(tx)
    return result
  }

  return {
    getAll,
    getById,
    put,
    deleteById,
    getMaxLocalId,
    addRecordWithId,
    count,
    clear,
  }
}
