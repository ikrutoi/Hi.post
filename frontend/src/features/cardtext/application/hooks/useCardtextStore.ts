import { useCallback } from 'react'
import { cardtextTemplatesAdapter } from '@db/adapters/templateAdapters'
import type { Node as SlateNode } from 'slate'

export const useCardtextStore = () => {
  const loadFromTemplate = useCallback(
    async (id: string): Promise<SlateNode[] | null> => {
      const record = await cardtextTemplatesAdapter.getById(id)
      return record?.state.value ?? null
    },
    [],
  )

  const getTemplateStats = useCallback(async (): Promise<{ count: number }> => {
    const count = await cardtextTemplatesAdapter.count()
    return { count }
  }, [])

  return {
    loadFromTemplate,
    getTemplateStats,
  }
}
