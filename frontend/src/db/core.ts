import { openDB, IDBPTransaction } from 'idb'
import type { IDBPDatabase } from 'idb'
import { storesSchema } from '@db/config/schema'
import {
  migrateLegacyCartDraftsToPostcards,
  POSTCARDS_IDB_MIGRATION_VERSION,
} from '@db/migrations/migrateLegacyCartDraftsToPostcards'

let dbInstance: IDBPDatabase | undefined

export const getDatabase = async () => {
  if (!dbInstance) {
    dbInstance = await openDB('AppDB', POSTCARDS_IDB_MIGRATION_VERSION, {
      async upgrade(db, oldVersion, _newVersion, transaction) {
        if (db.objectStoreNames.contains('cropImages')) {
          db.deleteObjectStore('cropImages')
        }
        if (db.objectStoreNames.contains('cardtextTemplates')) {
          db.deleteObjectStore('cardtextTemplates')
        }
        if (db.objectStoreNames.contains('sent')) {
          db.deleteObjectStore('sent')
        }
        storesSchema.forEach(({ name, keyPath }) => {
          if (!db.objectStoreNames.contains(name)) {
            db.createObjectStore(name, { keyPath })
          }
        })
        await migrateLegacyCartDraftsToPostcards(
          db,
          transaction as IDBPTransaction<unknown, string[], 'versionchange'>,
          oldVersion,
        )
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
