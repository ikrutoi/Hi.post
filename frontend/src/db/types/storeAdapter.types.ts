export interface StoreAdapter<T> {
  getAll(): Promise<T[]>
  getByLocalId(localId: IDBValidKey): Promise<T | null>
  put(record: T & { localId: IDBValidKey }): Promise<void>
  deleteByLocalId(localId: IDBValidKey): Promise<void>
  getMaxLocalId(): Promise<number>
  addAutoLocalIdRecord(payload: Omit<T, 'localId'>): Promise<void>
  addRecordWithLocalId(
    localId: IDBValidKey,
    payload: Omit<T, 'localId'>
  ): Promise<void>
  count(): Promise<number>
}
