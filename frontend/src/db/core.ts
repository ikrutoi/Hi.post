import { openDB, IDBPTransaction } from 'idb'
import type { IDBPDatabase } from 'idb'
import { storesSchema } from '@db/config/schema'
import { migrateLegacyCartDraftsToPostcards } from '@db/migrations/migrateLegacyCartDraftsToPostcards'
import {
  migratePostcardsToCanonicalShape,
  APP_DB_VERSION,
} from '@db/migrations/migratePostcardsCanonicalV15'

let dbInstance: IDBPDatabase | undefined

export const getDatabase = async () => {
  if (!dbInstance) {
    dbInstance = await openDB('AppDB', APP_DB_VERSION, {
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
        const versionChangeTx = transaction as IDBPTransaction<
          unknown,
          string[],
          'versionchange'
        >
        await migrateLegacyCartDraftsToPostcards(db, versionChangeTx, oldVersion)
        await migratePostcardsToCanonicalShape(db, versionChangeTx, oldVersion)
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
