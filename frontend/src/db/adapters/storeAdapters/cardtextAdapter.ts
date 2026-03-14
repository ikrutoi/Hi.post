import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { StoreMap, CardtextAdapter } from '@db/types'
import type { CardtextTemplateItem } from '@cardtext/domain/types'
import type { Node as SlateNode } from 'slate'

const base = createStoreAdapter<StoreMap['cardtext']>('cardtext')

function nodesToPlainText(nodes: SlateNode[]): string {
  return (nodes as any[])
    .map((block) =>
      (block.children || [])
        .map((c: any) => (typeof c?.text === 'string' ? c.text : '')).join(' ')
    )
    .join('\n')
}

const defaultStyle = {
  fontFamily: 'Roboto',
  fontSizeStep: 3,
  color: 'deepBlack',
  align: 'left',
} as const

export const cardtextAdapter: CardtextAdapter = {
  ...base,
  addUniqueRecord: async (nodes: SlateNode[]) => {
    const maxId = await base.getMaxLocalId()
    const id = String(maxId + 1)
    const value = nodes as any
    const plainText = nodesToPlainText(nodes)
    const item: CardtextTemplateItem = {
      id,
      state: {
        value,
        title: '',
        style: defaultStyle,
        plainText,
        cardtextLines: 15,
        applied: null,
        favorite: null,
      },
    }
    await base.put(item)
  },
}
