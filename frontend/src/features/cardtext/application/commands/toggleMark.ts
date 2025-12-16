import { Editor, Text, Range } from 'slate'
import { ReactEditor } from 'slate-react'
import { useToolbarFacade } from '@toolbar/application/facades'
import type {
  CardtextTextNode,
  MarkFormat,
  CardtextBlock,
} from '../../domain/types'
import type { CardtextToolbarState, CardtextKey } from '@toolbar/domain/types'

export const isMarkActive = (editor: Editor, format: MarkFormat): boolean => {
  if (!editor.selection) return false

  if (Range.isCollapsed(editor.selection)) {
    const [node] = Editor.nodes(editor, {
      match: (n) => Text.isText(n),
      mode: 'lowest',
    })
    if (!node) return false
    const textNode = node[0] as CardtextTextNode
    return !!textNode[format]
  }

  const marks = Editor.marks(editor) as Partial<CardtextTextNode> | null
  return marks ? marks[format] === true : false
}

export const toggleMark = (editor: Editor, format: MarkFormat) => {
  if (!editor.selection) return

  const isActive = isMarkActive(editor, format)
  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }

  ReactEditor.focus(editor)
}

export const useForceUpdateCardtextToolbar = (editor: Editor) => {
  const { actions } = useToolbarFacade('cardtext')

  const forceUpdateToolbar = () => {
    const updatedState: Partial<CardtextToolbarState> = {}

    ;(['bold', 'italic', 'underline'] as const).forEach((key) => {
      updatedState[key] = isMarkActive(editor, key) ? 'active' : 'enabled'
    })

    const align = getActiveAlign(editor)
    ;(['left', 'center', 'right', 'justify'] as const).forEach((key) => {
      updatedState[key] = align === key ? 'active' : 'enabled'
    })

    actions.updateCurrent(updatedState)
  }

  return { forceUpdateToolbar }
}

export const getActiveAlign = (
  editor: Editor
): CardtextBlock['align'] | null => {
  if (!editor.selection) return null
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      ['paragraph', 'heading', 'quote'].includes((n as any).type),
    mode: 'lowest',
  })

  if (!match) return null
  const element = match[0] as CardtextBlock
  return element.align ?? null
}

export const toggleBold = (editor: Editor) => toggleMark(editor, 'bold')
export const toggleItalic = (editor: Editor) => toggleMark(editor, 'italic')
export const toggleUnderline = (editor: Editor) =>
  toggleMark(editor, 'underline')
