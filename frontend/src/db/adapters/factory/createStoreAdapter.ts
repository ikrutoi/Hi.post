import { getDatabase, handleTransactionPromise } from '@db/core'
import type { StoreAdapter } from '@db/types'

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

  const getMaxId = async (): Promise<number> => {
    const all = await getAll()
    const ids = all.map((r: any) => r.id).filter((id) => typeof id === 'number')
    return ids.length ? Math.max(...ids) : 0
  }

  const addUniqueRecord = async (
    recordPayload: Record<string, unknown>
  ): Promise<void> => {
    const id = (await getMaxId()) + 1
    await put({ id, ...recordPayload } as T & { id: number })
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
    getMaxId,
    addUniqueRecord,
    count,
  }
}
