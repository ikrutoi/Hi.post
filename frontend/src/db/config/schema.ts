const storeSpecs = [
  { name: 'stockImages', keyPath: 'id' as const },
  { name: 'userImages', keyPath: 'id' as const },
  { name: 'cardphotoImages', keyPath: 'id' as const },
  { name: 'applyImage', keyPath: 'id' as const },
  { name: 'cardtext', keyPath: 'id' as const },
  { name: 'sender', keyPath: 'id' as const },
  { name: 'recipient', keyPath: 'id' as const },
  { name: 'postcards', keyPath: 'id' as const },
  { name: 'cardPieFavorites', keyPath: 'localId' as const },
  { name: 'session', keyPath: 'id' as const },
  { name: 'workingCard', keyPath: 'id' as const },
  { name: 'uiPreferences', keyPath: 'id' as const },
]

export const storesSchema = storeSpecs
