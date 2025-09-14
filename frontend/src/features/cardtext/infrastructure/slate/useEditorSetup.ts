import { useMemo } from 'react'
import { createEditor } from 'slate'
import { withReact } from 'slate-react'

export const useEditorSetup = () => {
  const editor = useMemo(() => withReact(createEditor()), [])

  return editor
}
