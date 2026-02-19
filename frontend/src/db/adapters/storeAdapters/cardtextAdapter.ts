import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { StoreMap, CardtextAdapter } from '@db/types'
import type { Node as SlateNode } from 'slate'

const base = createStoreAdapter<StoreMap['cardtext']>('cardtext')

export const cardtextAdapter: CardtextAdapter = {
  ...base,
  addUniqueRecord: async (text: SlateNode[]) => {
    const maxId = await base.getMaxLocalId()
    const id = String(maxId + 1)
    await base.put({ id, text } as StoreMap['cardtext'] & { id: string })
  },
}
