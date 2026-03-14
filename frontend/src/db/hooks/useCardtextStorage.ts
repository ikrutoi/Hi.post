import { Transforms, Editor, Node } from 'slate'
import { cardtextAdapter } from '../adapters/storeAdapters'

export const useCardtextStorage = (editor: Editor) => {
  const loadTemplateById = async (id: number) => {
    const record = await cardtextAdapter.getById(String(id))
    if (!record?.state?.value) return null

    clearEditor()
    Transforms.insertNodes(editor, record.state.value)
    return record.state.value
  }

  const saveTemplate = async (nodes: Node[]) => {
    await cardtextAdapter.addUniqueRecord(nodes)
  }

  const getTemplateStats = async () => {
    const count = await cardtextAdapter.count()
    const list = count ? await cardtextAdapter.getAll() : []
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
    loadTemplateById,
    saveTemplate,
    getTemplateStats,
    clearEditor,
  }
}
