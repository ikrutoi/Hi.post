import { useCallback } from 'react'
import { Element } from 'slate'
import { cardtextTemplatesAdapter } from '@db/adapters/templateAdapters'
import { cardtextAdapter } from '@db/adapters/storeAdapters'
import type { Node as SlateNode } from 'slate'
import type { CardtextBlock } from '../../domain/types'

export const useCardtextStore = () => {
  const loadFromTemplate = useCallback(
    async (id: string): Promise<SlateNode[] | null> => {
      const record = await cardtextTemplatesAdapter.getByLocalId(id)
      return record?.state.text ?? null
    },
    []
  )

  const slateToCardtext = (nodes: SlateNode[]): CardtextBlock[] => {
    return nodes
      .filter((node): node is Element => 'type' in node && 'children' in node)
      .map((node) => ({
        type: 'paragraph',
        children: node.children.map((child) => ({
          text: 'text' in child ? child.text : '',
        })),
      }))
  }

  const saveToTemplate = useCallback(
    async (id: string, value: SlateNode[]): Promise<void> => {
      const record = await cardtextTemplatesAdapter.getByLocalId(id)
      if (record) {
        const converted = slateToCardtext(value)
        await cardtextTemplatesAdapter.put({
          ...record,
          state: {
            ...record.state,
            text: converted,
          },
        })
      }
    },
    []
  )

  const addToTemplate = useCallback(
    async (value: SlateNode[]): Promise<void> => {
      await cardtextAdapter.addUniqueRecord(value)
    },
    []
  )

  const getTemplateStats = useCallback(async (): Promise<{ count: number }> => {
    const count = await cardtextTemplatesAdapter.count()
    return { count }
  }, [])

  return {
    loadFromTemplate,
    saveToTemplate,
    addToTemplate,
    getTemplateStats,
  }
}
