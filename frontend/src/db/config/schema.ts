import type { StoreMap } from '@/db/types/storeMap.types'

const storeNames: (keyof StoreMap)[] = [
  'stockImages',
  'userImages',
  'cropImages',
  'applyImage',
  'cardtext',
  'sender',
  'recipient',
  'cart',
  'drafts',
  'sent',
  'session',
  'workingCard',
]

export const storesSchema = storeNames.map((name) => ({
  name,
  keyPath: 'id' as const,
}))
