import type { StoreMap } from '@/db/types/storeMap.types'

export const storesSchema: { name: keyof StoreMap; keyPath: 'id' }[] =
  Object.keys({} as StoreMap).map((key) => ({
    name: key as keyof StoreMap,
    keyPath: 'id',
  }))
