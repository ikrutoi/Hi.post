import { Editor } from 'slate'

export const toggleItalic = (editor: Editor) => {
  const isActive = Editor.marks(editor)?.italic === true
  if (isActive) {
    Editor.removeMark(editor, 'italic')
  } else {
    Editor.addMark(editor, 'italic', true)
  }
}
