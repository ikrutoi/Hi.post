import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { StoreMap, CardtextAdapter } from '@db/types'
import type { Node as SlateNode } from 'slate'

const base = createStoreAdapter<StoreMap['cardtext']>('cardtext')

export const cardtextAdapter: CardtextAdapter = {
  ...base,
  addUniqueRecord: async (text: SlateNode[]) => {
    const localId = (await base.getMaxLocalId()) + 1
    await base.put({ localId, text })
  },
}
