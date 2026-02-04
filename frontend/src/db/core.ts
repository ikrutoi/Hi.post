import { openDB, IDBPTransaction } from 'idb'
import type { IDBPDatabase } from 'idb'
import { storesSchema } from '@db/config/schema'

let dbInstance: IDBPDatabase | undefined

export const getDatabase = async () => {
  if (!dbInstance) {
    dbInstance = await openDB('AppDB', 3, {
      upgrade(db) {
        storesSchema.forEach(({ name, keyPath }) => {
          if (!db.objectStoreNames.contains(name)) {
            db.createObjectStore(name, { keyPath })
          }
        })
      },
    })
  }
  return dbInstance
}

export const handleTransactionPromise = (
  tx: IDBPTransaction<any, any, any>,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    tx.done.then(resolve).catch(reject)
  })
}
