import { Transforms, Editor, Node } from 'slate'
import { db } from '@db/publicApi'

export const useCardtextStorage = (editor: Editor) => {
  const loadFromMemory = async (id: number) => {
    const record = await db.card.cardtext.getById(id)
    if (!record) return null

    clearEditor()
    Transforms.insertNodes(editor, record.text)
    return record.text
  }

  const saveToMemory = async (nodes: Node[]) => {
    await db.card.cardtext.addUniqueRecord(nodes)
  }

  const getMemoryStats = async () => {
    const count = await db.card.cardtext.count()
    const list = count ? await db.card.cardtext.getAll() : []
    return { count, list }
  }

  const clearEditor = () => {
    const clearNode = () => {
      Transforms.removeNodes(editor, { at: [0] })
      if (editor.children.length > 0) clearNode()
    }
    if (editor.children.length > 0) clearNode()
  }

  return {
    loadFromMemory,
    saveToMemory,
    getMemoryStats,
  }
}
