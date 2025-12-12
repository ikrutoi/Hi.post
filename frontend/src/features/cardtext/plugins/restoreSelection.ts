import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'

let lastSelection: any = null

export const saveSelection = (editor: ReactEditor) => {
  if (editor.selection) {
    lastSelection = editor.selection
  }
}

export const restoreSelection = (editor: ReactEditor) => {
  if (lastSelection) {
    Transforms.select(editor, lastSelection)
    ReactEditor.focus(editor)
  }
}
