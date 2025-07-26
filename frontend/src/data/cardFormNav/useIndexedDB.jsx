import { useEffect, useState } from 'react'
import { openDB } from 'idb'

export const useIndexedDB = () => {
  const [db, setDb] = useState(null)

  useEffect(() => {
    const initDB = async () => {
      const db = await openDB('files-db', 1, {
        upgrade(db) {
          db.createObjectStore('files', { autoIncrement: true })
        },
      })
      setDb(db)
    }
    initDB()
  }, [])

  return db
}
