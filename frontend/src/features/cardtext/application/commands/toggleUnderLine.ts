import { Editor, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'

export const toggleUnderline = (editor: Editor) => {
  const { selection } = editor
  if (!selection) return

  const isActive = Editor.marks(editor)?.underline === true
  if (isActive) {
    Editor.removeMark(editor, 'underline')
  } else {
    Editor.addMark(editor, 'underline', true)
  }

  Transforms.select(editor, selection)
  ReactEditor.focus(editor)
}
