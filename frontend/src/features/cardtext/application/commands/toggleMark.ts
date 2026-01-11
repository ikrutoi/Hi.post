import { Editor, Text, Range, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import { useToolbarFacade } from '@toolbar/application/facades'
import type {
  CardtextTextNode,
  MarkFormat,
  CardtextBlock,
} from '../../domain/types'
import type { CardtextToolbarState, CardtextKey } from '@toolbar/domain/types'

export const toggleMark = (editor: Editor, format: MarkFormat) => {
  const isActive = isMarkActive(editor, format)
  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
  ReactEditor.focus(editor as ReactEditor)
}

export const isMarkActive = (editor: Editor, format: MarkFormat): boolean => {
  const marks = Editor.marks(editor) as Record<string, any> | null
  return marks ? marks[format] === true : false
}

export const setAlign = (editor: Editor, align: CardtextBlock['align']) => {
  Transforms.setNodes(
    editor,
    { align },
    {
      match: (n) =>
        !Editor.isEditor(n) &&
        ['paragraph', 'heading', 'quote'].includes((n as any).type),
    }
  )
  ReactEditor.focus(editor as ReactEditor)
}

export const getActiveAlign = (editor: Editor): CardtextBlock['align'] => {
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      ['paragraph', 'heading', 'quote'].includes((n as any).type),
    mode: 'lowest',
  })

  if (!match) return 'left'
  const node = match[0] as CardtextBlock
  return node.align || 'left'
}

export const setFontSize = (editor: Editor, fontSize: number) => {
  Editor.addMark(editor, 'fontSize', fontSize)
  ReactEditor.focus(editor as ReactEditor)
}

export const setTextColor = (editor: Editor, color: string) => {
  Editor.addMark(editor, 'color', color)
  ReactEditor.focus(editor as ReactEditor)
}

export const useForceUpdateCardtextToolbar = (editor: Editor) => {
  const { state: toolbarState, actions: toolbarActions } =
    useToolbarFacade('cardtext')
  const { groups } = toolbarState

  const forceUpdateToolbar = () => {
    const hasSelection = !!editor.selection
    const textGroupStatus = groups.find((g) => g.group === 'text')?.status

    if (hasSelection && textGroupStatus === 'disabled') {
      toolbarActions.setGroupStatus('text', 'enabled')
    } else if (!hasSelection && textGroupStatus === 'enabled') {
      toolbarActions.setGroupStatus('text', 'disabled')
      return
    }

    if (!hasSelection) return

    const updatedState: Record<string, any> = {}

    ;(['bold', 'italic', 'underline'] as const).forEach((key) => {
      updatedState[key] = isMarkActive(editor, key) ? 'active' : 'enabled'
    })

    const currentAlign = getActiveAlign(editor)
    ;(['left', 'center', 'right', 'justify'] as const).forEach((key) => {
      updatedState[key] = currentAlign === key ? 'active' : 'enabled'
    })

    toolbarActions.updateSection(updatedState)
  }

  return { forceUpdateToolbar }
}

// export const getActiveAlign = (
//   editor: Editor
// ): CardtextBlock['align'] | null => {
//   if (!editor.selection) return null
//   const [match] = Editor.nodes(editor, {
//     match: (n) =>
//       !Editor.isEditor(n) &&
//       ['paragraph', 'heading', 'quote'].includes((n as any).type),
//     mode: 'lowest',
//   })

//   if (!match) return null
//   const element = match[0] as CardtextBlock
//   return element.align ?? null
// }

export const toggleBold = (editor: Editor) => toggleMark(editor, 'bold')
export const toggleItalic = (editor: Editor) => toggleMark(editor, 'italic')
export const toggleUnderline = (editor: Editor) =>
  toggleMark(editor, 'underline')
