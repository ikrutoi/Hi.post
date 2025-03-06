import { openDB } from 'idb'

export const dbPromise = openDB('images-database', 6, {
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
  const transaction = db.transaction('hiPostImages', 'readwrite')
  const store = transaction.objectStore('hiPostImages')
  await store.put({ id, image: file })
  await transaction.done
}

export const getHiPostImage = async (id) => {
  const db = await dbPromise
  const transaction = db.transaction('hiPostImages', 'readonly')
  const store = transaction.objectStore('hiPostImages')
  const result = await store.get(id)
  await transaction.done
  return result ? result.image : null
}

export const deleteHiPostImage = async (id) => {
  const db = await dbPromise
  const transaction = db.transaction('hiPostImage', 'readwrite')
  const store = transaction.objectStore('hiPostImage')
  await store.delete(id)
  await transaction.done
}

export const getAllHiPostImages = async () => {
  const db = await dbPromise
  const transaction = db.transaction('hiPostImages', 'readonly')
  const store = transaction.objectStore('hiPostImages')
  const allRecords = await store.getAll()
  await transaction.done
  return allRecords
}

export const addUserImage = async (id, file) => {
  const db = await dbPromise
  const transaction = db.transaction('userImages', 'readwrite')
  const store = transaction.objectStore('userImages')
  await store.put({ id, image: file })
  await transaction.done
}

export const getUserImage = async (id) => {
  const db = await dbPromise
  const transaction = db.transaction('userImages', 'readonly')
  const store = transaction.objectStore('userImages')
  const result = await store.get(id)
  await transaction.done
  return result ? result.image : null
}

export const deleteUserImage = async (id) => {
  const db = await dbPromise
  const transaction = db.transaction('userImage', 'readwrite')
  const store = transaction.objectStore('userImage')
  await store.delete(id)
  await transaction.done
}

export const getAllUserImages = async () => {
  const db = await dbPromise
  const transaction = db.transaction('userImages', 'readonly')
  const store = transaction.objectStore('userImages')
  const allRecords = await store.getAll()
  await transaction.done
  return allRecords
}

// export const addMyAddress = async (id, file) => {
//   const db = await dbPromise
//   const transaction = db.transaction('myAddress', 'readwrite')
//   const store = transaction.objectStore('myAddress')
//   await store.put({ id, address: file })
//   await transaction.done
// }

// export const getMyAddress = async (id) => {
//   const db = await dbPromise
//   const transaction = db.transaction('myAddress', 'readonly')
//   const store = transaction.objectStore('myAddress')
//   const result = await store.get(id)
//   await transaction.done
//   return result ? result.address : null
// }

export const deleteMyAddress = async (id) => {
  const db = await dbPromise
  const transaction = db.transaction('myAddress', 'readwrite')
  const store = transaction.objectStore('myAddress')
  await store.delete(id)
  await transaction.done
}

// export const getAllMyAddress = async () => {
//   const db = await dbPromise
//   const transaction = db.transaction('myAddress', 'readonly')
//   const store = transaction.objectStore('myAddress')
//   const allRecords = await store.getAll()
//   await transaction.done
//   return allRecords
// }

// export const addToAddress = async (id, file) => {
//   const db = await dbPromise
//   const transaction = db.transaction('toAddress', 'readwrite')
//   const store = transaction.objectStore('toAddress')
//   await store.put({ id, address: file })
//   await transaction.done
// }

// export const getToAddress = async (id) => {
//   const db = await dbPromise
//   const transaction = db.transaction('toAddress', 'readonly')
//   const store = transaction.objectStore('toAddress')
//   const result = await store.get(id)
//   await transaction.done
//   return result ? result.address : null
// }

export const deleteToAddress = async (id) => {
  const db = await dbPromise
  const transaction = db.transaction('toAddress', 'readwrite')
  const store = transaction.objectStore('toAddress')
  // const count = await store.count()
  await store.delete(id)
  await transaction.done
}

// export const getAllToAddress = async () => {
//   const db = await dbPromise
//   const transaction = db.transaction('toAddress', 'readonly')
//   const store = transaction.objectStore('toAddress')
//   const allRecords = await store.getAll()
//   await transaction.done
//   return allRecords
// }

export const getAllRecordsAddresses = async (storeName) => {
  const db = await dbPromise
  const transaction = db.transaction(storeName, 'readonly')
  const store = transaction.objectStore(storeName)
  const allRecords = await store.getAll()
  await transaction.done
  return allRecords || []
}

export const getCountRecordsAddresses = async (storeName) => {
  const db = await dbPromise
  const transaction = db.transaction(storeName, 'readonly')
  const store = transaction.objectStore(storeName)
  const count = await store.count()
  await transaction.done
  return count
}

export const getRecordAddressById = async (storeName, id) => {
  const db = await dbPromise
  const transaction = db.transaction(storeName, 'readonly')
  const store = transaction.objectStore(storeName)
  const result = await store.get(id)
  await transaction.done
  return result || null
}

export const addRecordAddress = async (storeName, record) => {
  const db = await dbPromise
  const transaction = db.transaction(storeName, 'readwrite')
  const store = transaction.objectStore(storeName)
  await store.put(record)
  await transaction.done
}

export const deleteRecordAddress = async (storeName, id) => {
  const db = await dbPromise
  const transaction = db.transaction(storeName, 'readwrite')
  const store = transaction.objectStore(storeName)
  await store.delete(id)
  await transaction.done
}

export const getMaxIdAddress = async (storeName) => {
  const db = await dbPromise
  const transaction = db.transaction(storeName, 'readonly')
  const store = transaction.objectStore(storeName)
  const allRecords = await store.getAll()
  await transaction.done

  const ids = allRecords.map((record) => record.id)
  return ids.length ? Math.max(...ids) : 0
}

export const addUniqueRecordAddress = async (storeName, data) => {
  const db = await dbPromise
  const maxId = await getMaxIdAddress(storeName)
  const newId = maxId + 1

  const transaction = db.transaction(storeName, 'readwrite')
  const store = transaction.objectStore(storeName)
  await store.put({ id: newId, address: { ...data } })
  await transaction.done
}
