import { Editor, Transforms, Element as SlateElement } from 'slate'
import type { ReactEditor } from 'slate-react'

export const withAlign = (editor: ReactEditor) => {
  const { insertBreak } = editor

  editor.insertBreak = () => {
    if (editor.selection) {
      const [match] = Editor.nodes(editor, {
        match: (n) => SlateElement.isElement(n),
      })

      let currentAlign: 'left' | 'center' | 'right' | 'justify' | undefined

      if (match) {
        const [node] = match
        currentAlign = (node as any).align
      }

      Transforms.insertNodes(editor, {
        type: 'paragraph',
        align: currentAlign || 'left',
        children: [{ text: '' }],
      })
    } else {
      insertBreak()
    }
  }

  return editor
}
