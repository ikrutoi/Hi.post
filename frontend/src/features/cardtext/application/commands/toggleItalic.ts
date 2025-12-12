import { Editor, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'

export const toggleItalic = (editor: Editor) => {
  const { selection } = editor
  if (!selection) return

  const isActive = Editor.marks(editor)?.italic === true
  if (isActive) {
    Editor.removeMark(editor, 'italic')
  } else {
    Editor.addMark(editor, 'italic', true)
  }

  Transforms.select(editor, selection)
  ReactEditor.focus(editor)
}
