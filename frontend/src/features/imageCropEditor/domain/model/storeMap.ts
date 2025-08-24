export interface StoreMap {
  stockImages: BlobStore
  userImages: BlobStore
}

export interface BlobStore {
  add: (id: string, blob: Blob) => Promise<void>
  deleteById: (id: string) => Promise<void>
  getAll: () => Promise<{ id: string; blob: Blob }[]>
}
