import { Editor, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'

export const focusAtEnd = (editor: ReactEditor) => {
  const endPoint = Editor.end(editor, [])
  if (endPoint) {
    Transforms.select(editor, { anchor: endPoint, focus: endPoint })
    ReactEditor.focus(editor)
  }
}
