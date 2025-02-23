import { openDB } from 'idb'

const dbPromise = openDB('images-database', 4, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('startImages')) {
      db.createObjectStore('startImages', { keyPath: 'id' })
    }
    if (!db.objectStoreNames.contains('userImages')) {
      db.createObjectStore('userImages', { keyPath: 'id' })
    }
  },
})

export const addStartImage = async (id, file) => {
  const db = await dbPromise
  await db.put('startImages', { id, image: file })
}

export const getStartImage = async (id) => {
  const db = await dbPromise
  const result = await db.get('startImages', id)
  return result ? result.image : null
}

export const deleteStartImage = async (id) => {
  const db = await dbPromise
  await db.delete('startImages', id)
}

export const getAllStartImages = async () => {
  const db = await dbPromise
  return await db.getAll('startImages')
}

export const addUserImage = async (id, file) => {
  const db = await dbPromise
  await db.put('userImages', { id, image: file })
}

export const getUserImage = async (id) => {
  const db = await dbPromise
  const result = await db.get('userImages', id)
  return result ? result.image : null
}

export const deleteUserImage = async (id) => {
  const db = await dbPromise
  await db.delete('userImages', id)
}

export const getAllUserImages = async () => {
  const db = await dbPromise
  return await db.getAll('userImages')
}
