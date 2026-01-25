import type { StoreMap } from '@/db/types/storeMap.types'

const storeNames: (keyof StoreMap)[] = [
  'stockImages',
  'userImages',
  'cropImages',
  'cardtext',
  'sender',
  'recipient',
  'cart',
  'drafts',
  'sent',
]

export const storesSchema = storeNames.map((name) => ({
  name,
  keyPath: 'id' as const,
}))
