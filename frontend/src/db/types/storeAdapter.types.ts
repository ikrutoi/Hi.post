export interface StoreAdapter<T> {
  getAll(): Promise<T[]>
  getById(id: IDBValidKey): Promise<T | null>
  put(record: T & { id: IDBValidKey }): Promise<void>
  deleteById(id: IDBValidKey): Promise<void>
  addRecordWithId(id: IDBValidKey, payload: Omit<T, 'id'>): Promise<void>
  count(): Promise<number>
  clear(): Promise<void>
}
