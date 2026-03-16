import { useEffect } from 'react'
import { Editor, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'

/** Sets selection to end of editor. Does not focus (caller may focus when needed). */
export function useInitSelection(editor: ReactEditor) {
  useEffect(() => {
    try {
      const end = Editor.end(editor, [])
      if (end) {
        Transforms.select(editor, { anchor: end, focus: end })
      }
    } catch {
      // Editor has no text nodes yet; skip initializing selection.
    }
  }, [editor])
}
