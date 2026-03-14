import { Editor, Transforms } from 'slate'
import { Element as SlateElement } from 'slate'
import type { ReactEditor } from 'slate-react'
import type { AppDispatch } from '@app/state'
import { setAlign } from '../../infrastructure/state'

export const cardtextToolbarController = {
  setAlign(
    editor: ReactEditor,
    dispatch: AppDispatch,
    value: 'left' | 'center' | 'right' | 'justify',
  ) {
    if (!editor.selection) return

    Transforms.setNodes(
      editor,
      { align: value },
      {
        match: (n) =>
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          ['paragraph', 'heading', 'quote'].includes((n as any).type),
      },
    )

    dispatch(setAlign(value))
  },
}
