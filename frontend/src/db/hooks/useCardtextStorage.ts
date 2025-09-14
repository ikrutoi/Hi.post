import { Transforms, Editor } from 'slate'
import {
  getRecordCardtextById,
  addUniqueRecordCardtext,
  getCountRecordsCardtext,
  getAllRecordCardtext,
} from './cardtextDb'

export const useCardtextStorage = (editor: Editor) => {
  const loadFromMemory = async (id: string) => {
    const valueFromMemory = await getRecordCardtextById(id)
    if (!valueFromMemory) return null

    const nodes = Object.values(valueFromMemory.text)
    clearEditor()
    Transforms.insertNodes(editor, nodes)
    return nodes
  }

  const saveToMemory = async (value: any) => {
    await addUniqueRecordCardtext(value)
  }

  const getMemoryStats = async () => {
    const count = await getCountRecordsCardtext()
    const list = count ? await getAllRecordCardtext() : []
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
