const storeNames: string[] = [
  'stockImages',
  'userImages',
  'cardphotoImages',
  'applyImage',
  'cardtext',
  'sender',
  'recipient',
  'postcards',
  'session',
  'workingCard',
  'uiPreferences',
]

export const storesSchema = storeNames.map((name) => ({
  name,
  keyPath: 'id' as const,
}))
