import { Editor, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'

export const toggleBold = (editor: Editor) => {
  const { selection } = editor
  if (!selection) return

  const isActive = Editor.marks(editor)?.bold === true
  if (isActive) {
    Editor.removeMark(editor, 'bold')
  } else {
    Editor.addMark(editor, 'bold', true)
  }

  Transforms.select(editor, selection)
  ReactEditor.focus(editor)
}
