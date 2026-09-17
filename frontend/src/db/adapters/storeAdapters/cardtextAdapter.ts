import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { StoreMap, CardtextAdapter } from '@db/types'
import type { CardtextContent } from '@cardtext/domain/types'
import type { Node as SlateNode } from 'slate'
import { withLibraryRemoteSync } from '@features/sync/infrastructure/withLibraryRemoteSync'

const base = createStoreAdapter<StoreMap['cardtext']>('cardtext')
const synced = withLibraryRemoteSync(base, 'cardtexts')

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

export const cardtextAdapter: CardtextAdapter & { putLocal: typeof base.put } = {
  ...synced,
  addUniqueRecord: async (nodes: SlateNode[]) => {
    const now = Date.now()
    const id = String(now)
    const value = nodes as any
    const plainText = nodesToPlainText(nodes)
    const item: CardtextContent = {
      id,
      value,
      title: '',
      style: defaultStyle,
      plainText,
      cardtextLines: 15,
      status: 'inLine',
      favorite: null,
      timestamp: now,
    }
    await synced.put(item as CardtextContent & { id: string })
  },
}
