import { Editor } from 'slate'

export const toggleUnderline = (editor: Editor) => {
  const isActive = Editor.marks(editor)?.underline === true
  if (isActive) {
    Editor.removeMark(editor, 'underline')
  } else {
    Editor.addMark(editor, 'underline', true)
  }
}
