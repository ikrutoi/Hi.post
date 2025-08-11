export interface StoreAdapter<T> {
  getAll(): Promise<T[]>
  getById(id: IDBValidKey): Promise<T | null>
  put(record: T & { id: IDBValidKey }): Promise<void>
  deleteById(id: IDBValidKey): Promise<void>
  getMaxId(): Promise<number>
  addUniqueRecord(payload: Record<string, unknown>): Promise<void>
  count(): Promise<number>
}
