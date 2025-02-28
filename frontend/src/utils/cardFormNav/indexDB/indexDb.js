import { openDB } from 'idb'

const dbPromise = openDB('images-database', 6, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('hiPostImages')) {
      db.createObjectStore('hiPostImages', { keyPath: 'id' })
    }
    if (!db.objectStoreNames.contains('userImages')) {
      db.createObjectStore('userImages', { keyPath: 'id' })
    }
    if (!db.objectStoreNames.contains('myAddress')) {
      db.createObjectStore('myAddress', { keyPath: 'id' })
    }
    if (!db.objectStoreNames.contains('toAddress')) {
      db.createObjectStore('toAddress', { keyPath: 'id' })
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

export const addMyAddress = async (id, file) => {
  const db = await dbPromise
  await db.put('myAddress', { id, image: file })
}

export const getMyAddress = async (id) => {
  const db = await dbPromise
  const result = await db.get('myAddress', id)
  return result ? result.image : null
}

export const deleteMyAddress = async (id) => {
  const db = await dbPromise
  await db.delete('myAddress', id)
}

export const addToAddress = async (id, file) => {
  const db = await dbPromise
  await db.put('toAddress', { id, image: file })
}

export const getToAddress = async (id) => {
  const db = await dbPromise
  const result = await db.get('toAddress', id)
  return result ? result.image : null
}

export const deleteToAddress = async (id) => {
  const db = await dbPromise
  await db.delete('toAddress', id)
}

// export const getAllUserImages = async () => {
//   const db = await dbPromise
//   return await db.getAll('userImages')
// }
