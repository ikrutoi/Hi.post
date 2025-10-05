import type { Node as SlateNode } from 'slate'
import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { CardtextAdapter } from '@db/types'

const base = createStoreAdapter<{ id: number; text: SlateNode[] }>('cardtext')

export const cardtextAdapter: CardtextAdapter = {
  ...base,
  addUniqueRecord: async (text) => {
    const newId = (await base.getMaxId()) + 1
    await base.put({ id: newId, text })
  },
}
