import { useEffect } from 'react'
import { Editor, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'

export function useInitSelection(editor: ReactEditor) {
  useEffect(() => {
    const end = Editor.end(editor, [])
    if (end) {
      Transforms.select(editor, { anchor: end, focus: end })
      ReactEditor.focus(editor)
    }
  }, [editor])
}
