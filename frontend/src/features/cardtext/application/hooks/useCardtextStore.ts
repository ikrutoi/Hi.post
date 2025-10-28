import { useCallback } from 'react'
import type { Node as SlateNode } from 'slate'
import { cardtextAdapter } from '@db/adapters/card'

export const useCardtextStore = () => {
  const loadFromMemory = useCallback(
    async (id: string): Promise<SlateNode[] | null> => {
      const record = await cardtextAdapter.getById(id)
      return record?.text ?? null
    },
    []
  )

  const saveToMemory = useCallback(
    async (id: number, value: SlateNode[]): Promise<void> => {
      await cardtextAdapter.put({ id, text: value })
    },
    []
  )

  const addToMemory = useCallback(async (value: SlateNode[]): Promise<void> => {
    await cardtextAdapter.addUniqueRecord(value)
  }, [])

  const getMemoryStats = useCallback(async (): Promise<{ count: number }> => {
    const count = await cardtextAdapter.count()
    return { count }
  }, [])

  return {
    loadFromMemory,
    saveToMemory,
    addToMemory,
    getMemoryStats,
  }
}
