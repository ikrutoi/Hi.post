import { Editor } from 'slate'

export const toggleBold = (editor: Editor) => {
  const isActive = Editor.marks(editor)?.bold === true
  if (isActive) {
    Editor.removeMark(editor, 'bold')
  } else {
    Editor.addMark(editor, 'bold', true)
  }
}
