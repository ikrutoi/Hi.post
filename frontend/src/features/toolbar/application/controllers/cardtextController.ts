import { Editor, Transforms, Range } from 'slate'
import { Element as SlateElement } from 'slate'
import type { ReactEditor } from 'slate-react'
import { updateToolbar } from '../../infrastructure/state'
import type { AppDispatch } from '@app/state'

export const cardtextController = {
  toggleBold: (editor: ReactEditor, dispatch: AppDispatch) => {
    if (!editor.selection) return

    const marks = Editor.marks(editor) || {}
    const isActive = marks.bold === true

    if (isActive) {
      Editor.removeMark(editor, 'bold')
      dispatch(updateToolbar({ cardtext: { bold: 'enabled' } }))
    } else {
      Editor.addMark(editor, 'bold', true)
      dispatch(updateToolbar({ cardtext: { bold: 'active' } }))
    }
  },

  toggleItalic: (editor: ReactEditor, dispatch: AppDispatch) => {
    if (!editor.selection) return

    const marks = Editor.marks(editor) || {}
    const isActive = marks.italic === true

    if (isActive) {
      Editor.removeMark(editor, 'italic')
      dispatch(updateToolbar({ cardtext: { italic: 'enabled' } }))
    } else {
      Editor.addMark(editor, 'italic', true)
      dispatch(updateToolbar({ cardtext: { italic: 'active' } }))
    }
  },

  toggleUnderline: (editor: ReactEditor, dispatch: AppDispatch) => {
    if (!editor.selection) return

    const marks = Editor.marks(editor) || {}
    const isActive = marks.underline === true

    if (isActive) {
      Editor.removeMark(editor, 'underline')
      dispatch(updateToolbar({ cardtext: { underline: 'enabled' } }))
    } else {
      Editor.addMark(editor, 'underline', true)
      dispatch(updateToolbar({ cardtext: { underline: 'active' } }))
    }
  },

  setAlign: (
    editor: ReactEditor,
    dispatch: AppDispatch,
    value: 'left' | 'center' | 'right' | 'justify'
  ) => {
    if (!editor.selection) return

    Transforms.setNodes(
      editor,
      { align: value },
      {
        match: (n) =>
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          ['paragraph', 'heading', 'quote'].includes((n as any).type),
      }
    )

    dispatch(
      updateToolbar({
        cardtext: {
          left: value === 'left' ? 'active' : 'enabled',
          center: value === 'center' ? 'active' : 'enabled',
          right: value === 'right' ? 'active' : 'enabled',
          justify: value === 'justify' ? 'active' : 'enabled',
        },
      })
    )
  },
}
