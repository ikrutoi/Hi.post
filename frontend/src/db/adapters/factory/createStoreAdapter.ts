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

  const getByLocalId = async (localId: IDBValidKey): Promise<T | null> => {
    const db = await getDatabase()
    const tx = db.transaction(storeName, 'readonly')
    const result = await tx.objectStore(storeName).get(localId)
    await handleTransactionPromise(tx)
    return result || null
  }

  const put = async (record: T & { localId: IDBValidKey }): Promise<void> => {
    const db = await getDatabase()
    const tx = db.transaction(storeName, 'readwrite')
    tx.objectStore(storeName).put(record)
    await handleTransactionPromise(tx)
  }

  const deleteByLocalId = async (localId: IDBValidKey): Promise<void> => {
    const db = await getDatabase()
    const tx = db.transaction(storeName, 'readwrite')
    tx.objectStore(storeName).delete(localId)
    await handleTransactionPromise(tx)
  }

  const getMaxLocalId = async (): Promise<number> => {
    const all = await getAll()
    const localIds = all
      .map((r: any) => r.localId)
      .filter((localId) => typeof localId === 'number')
    return localIds.length ? Math.max(...localIds) : 0
  }

  const addAutoLocalIdRecord = async (
    recordPayload: Omit<T, 'localId'>
  ): Promise<void> => {
    const localId = (await getMaxLocalId()) + 1
    await put({ localId, ...recordPayload } as T & { localId: number })
  }

  const addRecordWithLocalId = async (
    localId: IDBValidKey,
    recordPayload: Omit<T, 'localId'>
  ): Promise<void> => {
    await put({ localId, ...recordPayload } as T & { localId: IDBValidKey })
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
    getByLocalId,
    put,
    deleteByLocalId,
    getMaxLocalId,
    addAutoLocalIdRecord,
    addRecordWithLocalId,
    count,
  }
}
