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
  'session',
  'workingCard',
  'uiPreferences',
]

export const storesSchema = storeNames.map((name) => ({
  name,
  keyPath: 'id' as const,
}))
