import { openDB } from 'idb'

const dbPromise = openDB('images-database', 1, {
  upgrade(db) {
    db.createObjectStore('images', { keyPath: 'id' })
  },
})

export const addImage = async (id, file) => {
  const db = await dbPromise
  await db.put('images', { id, image: file })
}

export const getImage = async (id) => {
  const db = await dbPromise
  return await db.get('images', id)
}

export const deleteImage = async (id) => {
  const db = await dbPromise
  await db.delete('images', id)
}

export const getAllImages = async () => {
  const db = await dbPromise
  return await db.getAll('images')
}
