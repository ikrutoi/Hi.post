import { openDB } from 'idb'

const dbPromise = openDB('images-database', 5, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('hiPostImages')) {
      db.createObjectStore('hiPostImages', { keyPath: 'id' })
    }
    if (!db.objectStoreNames.contains('userImages')) {
      db.createObjectStore('userImages', { keyPath: 'id' })
    }
  },
})

export const addHiPostImage = async (id, file) => {
  const db = await dbPromise
  await db.put('hiPostImages', { id, image: file })
}

export const getHiPostImage = async (id) => {
  const db = await dbPromise
  const result = await db.get('hiPostImages', id)
  return result ? result.image : null
}

export const deleteHiPostImage = async (id) => {
  const db = await dbPromise
  await db.delete('hiPostImages', id)
}

export const getAllHiPostImages = async () => {
  const db = await dbPromise
  return await db.getAll('hiPostImages')
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
