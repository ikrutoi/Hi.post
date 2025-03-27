import { openDB } from 'idb'

export const dbPromise = openDB('images-database', 8, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('hiPostImages')) {
      db.createObjectStore('hiPostImages', { keyPath: 'id' })
    }
    if (!db.objectStoreNames.contains('userImages')) {
      db.createObjectStore('userImages', { keyPath: 'id' })
    }
    if (!db.objectStoreNames.contains('cardtext')) {
      db.createObjectStore('cardtext', { keyPath: 'id' })
    }
    if (!db.objectStoreNames.contains('myAddress')) {
      db.createObjectStore('myAddress', { keyPath: 'id' })
    }
    if (!db.objectStoreNames.contains('toAddress')) {
      db.createObjectStore('toAddress', { keyPath: 'id' })
    }
    if (!db.objectStoreNames.contains('cards')) {
      db.createObjectStore('cards', { keyPath: 'id' })
    }
  },
})

let dbInstance
const getDatabase = async () => {
  if (!dbInstance) {
    dbInstance = await dbPromise
  }
  return dbInstance
}

// const initializeDatabase = async () => {
//   try {
//     const db = await getDatabase()
//     console.log('Database initialized:', db.name);
//   } catch (error) {
//     console.error('Failed to initialize database:', error);
//   }
// };

export const addHiPostImage = async (id, file) => {
  try {
    const db = await dbPromise
    const transaction = db.transaction('hiPostImages', 'readwrite')
    const store = transaction.objectStore('hiPostImages')
    await store.put({ id, image: file })
    await transaction.done
  } catch (error) {
    console.log('Error adding hiPost image:', error)
  }
}

export const getHiPostImage = async (id) => {
  try {
    const db = await dbPromise
    const transaction = db.transaction('hiPostImages', 'readonly')
    const store = transaction.objectStore('hiPostImages')
    const result = await store.get(id)
    await transaction.done
    return result ? result.image : null
  } catch (error) {
    console.log('Error getting hiPost image:', error)
    return null
  }
}

export const deleteHiPostImage = async (id) => {
  try {
    const db = await dbPromise
    const transaction = db.transaction('hiPostImages', 'readwrite')
    const store = transaction.objectStore('hiPostImages')
    await store.delete(id)
    await transaction.done
  } catch (error) {
    console.log('Error deleting hiPost image:', error)
  }
}

export const getAllHiPostImages = async () => {
  try {
    const db = await dbPromise
    const transaction = db.transaction('hiPostImages', 'readonly')
    const store = transaction.objectStore('hiPostImages')
    const allRecords = await store.getAll()
    await transaction.done
    return allRecords
  } catch (error) {
    console.log('Error getting all hiPost images:', error)
    return []
  }
}

export const addUserImage = async (id, file) => {
  try {
    const db = await dbPromise
    const transaction = db.transaction('userImages', 'readwrite')
    const store = transaction.objectStore('userImages')
    await store.put({ id, image: file })
    await transaction.done
  } catch (error) {
    console.log('Error adding user image:', error)
  }
}

export const getUserImage = async (id) => {
  try {
    const db = await dbPromise
    const transaction = db.transaction('userImages', 'readonly')
    const store = transaction.objectStore('userImages')
    const result = await store.get(id)
    await transaction.done
    return result ? result.image : null
  } catch (error) {
    console.log('Error getting user image:', error)
    return null
  }
}

export const deleteUserImage = async (id) => {
  try {
    const db = await dbPromise
    const transaction = db.transaction('userImages', 'readwrite')
    const store = transaction.objectStore('userImages')
    await store.delete(id)
    await transaction.done
  } catch (error) {
    console.log('Error deleting user image:', error)
  }
}

export const getAllUserImages = async () => {
  try {
    const db = await dbPromise
    const transaction = db.transaction('userImages', 'readonly')
    const store = transaction.objectStore('userImages')
    const allRecords = await store.getAll()
    await transaction.done
    return allRecords
  } catch (error) {
    console.log('Error getting all user images:', error)
    return []
  }
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

const handleTransactionPromise = (transaction) => {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onerror = (event) => reject(event.target.error)
  })
}

export const getAllRecordCardtext = async () => {
  try {
    const db = await getDatabase()
    const transaction = db.transaction('cardtext', 'readonly')
    const store = transaction.objectStore('cardtext')
    const allRecords = await store.getAll()
    await handleTransactionPromise(transaction)
    return allRecords || []
  } catch (error) {
    console.error(`[getAllCardtext] Failed to fetch all cardtext:`, error)
    throw error
  }
}

export const getCountRecordsCardtext = async () => {
  try {
    const db = await getDatabase()
    const transaction = db.transaction('cardtext', 'readonly')
    const store = transaction.objectStore('cardtext')
    const count = await store.count()
    await handleTransactionPromise(transaction)
    return count
  } catch (error) {
    console.error('[getCountRecordsCardtext] Failed to count record:', error)
    throw error
  }
}

export const getRecordCardtextById = async (id) => {
  if (!id) {
    throw new Error('[getRecordCardtextById] Invalid ID provided.')
  }
  try {
    const db = await getDatabase()
    const transaction = db.transaction('cardtext', 'readonly')
    const store = transaction.objectStore('cardtext')
    const result = await store.get(id)
    await handleTransactionPromise(transaction)
    return result || null
  } catch (error) {
    console.error(
      '[getRecordCardtextById] Failed to get cardtext by ID:',
      error
    )
    throw error
  }
}

export const addRecordCardtext = async (record) => {
  if (!record || typeof record.id === 'undefined') {
    throw new Error(
      '[addRecordCardtext] Invalid record format. "id" is required.'
    )
  }
  try {
    const db = await getDatabase()
    const transaction = db.transaction('cardtext', 'readwrite')
    const store = transaction.objectStore('cardtext')
    await store.put(record)
    return await handleTransactionPromise(transaction)
  } catch (error) {
    console.error('[addRecordCardtext] Failed to add record:', error)
    throw error
  }
}

export const deleteRecordCardtext = async (id) => {
  try {
    const db = await getDatabase()
    const transaction = db.transaction('cardtext', 'readwrite')
    const store = transaction.objectStore('cardtext')
    await store.delete(id)
    return await handleTransactionPromise(transaction)
  } catch (error) {
    console.error('[deleteRecordCardtext] Failed to delete cardtext', error)
    throw error
  }
}

export const getMaxIdCardtext = async () => {
  const db = await dbPromise
  const transaction = db.transaction('cardtext', 'readonly')
  const store = transaction.objectStore('cardtext')
  const allRecords = await store.getAll()

  const ids = allRecords.map((record) => record.id)
  return ids.length ? Math.max(...ids) : 0
}

export const addUniqueRecordCardtext = async (data) => {
  if (!data || typeof data !== 'object') {
    throw new Error('[addUniqueRecordCardtext] Invalid data provided.')
  }
  try {
    const db = await getDatabase()
    const maxId = await getMaxIdCardtext()
    const newId = maxId + 1

    const transaction = db.transaction('cardtext', 'readwrite')
    const store = transaction.objectStore('cardtext')
    await store.put({ id: newId, text: { ...data } })
    return await handleTransactionPromise(transaction)
  } catch (error) {
    console.error(
      '[addUniqueRecordCardtext] Failed to add unique cardtext:',
      error
    )
    throw error
  }
}

export const getAllCards = async () => {
  try {
    const db = await getDatabase()
    const transaction = db.transaction('cards', 'readonly')
    const store = transaction.objectStore('cards')
    const allRecords = await store.getAll()
    await handleTransactionPromise(transaction)
    return allRecords || []
  } catch (error) {
    console.error(`[getAllCards] Failed to fetch all cards:`, error)
    throw error
  }
}

export const getCountCards = async () => {
  try {
    const db = await getDatabase()
    const transaction = db.transaction('cards', 'readonly')
    const store = transaction.objectStore('cards')
    const count = await store.count()
    await handleTransactionPromise(transaction)
    return count
  } catch (error) {
    console.error('[getCountCards] Failed to count cards:', error)
    throw error
  }
}

export const getCardsById = async (id) => {
  if (!id) {
    throw new Error('[getCarsById] Invalid ID provided.')
  }
  try {
    const db = await getDatabase()
    const transaction = db.transaction('cards', 'readonly')
    const store = transaction.objectStore('cards')
    const result = await store.get(id)
    await handleTransactionPromise(transaction)
    return result || null
  } catch (error) {
    console.error('[getCardsById] Failed to get cards by ID:', error)
    throw error
  }
}

// export const addRecordCardtext = async (record) => {
//   if (!record || typeof record.id === 'undefined') {
//     throw new Error(
//       '[addRecordCardtext] Invalid record format. "id" is required.'
//     )
//   }
//   try {
//     const db = await getDatabase()
//     const transaction = db.transaction('cardtext', 'readwrite')
//     const store = transaction.objectStore('cardtext')
//     await store.put(record)
//     return await handleTransactionPromise(transaction)
//   } catch (error) {
//     console.error('[addRecordCardtext] Failed to add record:', error)
//     throw error
//   }
// }

export const deleteCards = async (id) => {
  try {
    const db = await getDatabase()
    const transaction = db.transaction('cards', 'readwrite')
    const store = transaction.objectStore('cards')
    await store.delete(id)
    return await handleTransactionPromise(transaction)
  } catch (error) {
    console.error('[deleteCards] Failed to delete cards', error)
    throw error
  }
}

export const getMaxIdCards = async () => {
  const db = await dbPromise
  const transaction = db.transaction('cards', 'readonly')
  const store = transaction.objectStore('cards')
  const allRecords = await store.getAll()

  const ids = allRecords.map((record) => record.id)
  return ids.length ? Math.max(...ids) : 0
}

export const addUniqueCards = async (data) => {
  if (!data || typeof data !== 'object') {
    throw new Error('[addUniqueCards] Invalid data provided.')
  }
  try {
    const db = await getDatabase()
    const maxId = await getMaxIdCardtext()
    const newId = maxId + 1

    const transaction = db.transaction('cards', 'readwrite')
    const store = transaction.objectStore('cards')
    await store.put({ id: newId, text: { ...data } })
    return await handleTransactionPromise(transaction)
  } catch (error) {
    console.error('[addUniqueCards] Failed to add unique cards:', error)
    throw error
  }
}
