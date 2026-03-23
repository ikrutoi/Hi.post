// Object store names in IndexedDB are not always identical to keys in `StoreMap` types.
// Keep this as `string[]` to avoid type-level coupling to those internal names.
const storeNames: string[] = [
  'stockImages',
  'userImages',
  'cardphotoImages',
  'applyImage',
  'cardtext',
  'sender',
  'recipient',
  'cart',
  'drafts',
  'sent',
  'session',
  'workingCard',
  'uiPreferences',
]

export const storesSchema = storeNames.map((name) => ({
  name,
  keyPath: 'id' as const,
}))
