import React from 'react'
import { createEditor, Transforms, Editor } from 'slate'
import { withReact } from 'slate-react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { setValue, clear } from '../../infrastructure/state'
import {
  selectCardtextValue,
  selectCardtextPlainText,
  selectCardtextIsComplete,
} from '../../infrastructure/selectors'
import { EMPTY_PARAGRAPH } from '../../domain/types'
import { toggleBold, toggleItalic, toggleUnderline } from '../commands'
import type { CardtextValue } from '../../domain/types'

export const useCardtextController = () => {
  const dispatch = useAppDispatch()
  const editor = React.useMemo(() => withReact(createEditor()), [])

  const reduxValue = useAppSelector(selectCardtextValue)
  const plainText = useAppSelector(selectCardtextPlainText)
  const isComplete = useAppSelector(selectCardtextIsComplete)

  const [value, setLocalValue] = React.useState<CardtextValue>(EMPTY_PARAGRAPH)

  React.useEffect(() => {
    setLocalValue(reduxValue)
  }, [reduxValue])

  const editorRef = React.useRef<HTMLDivElement>(null)
  const editableRef = React.useRef<HTMLDivElement>(null)

  const handleSlateChange = (newValue: CardtextValue) => {
    setLocalValue(newValue)
    dispatch(setValue(newValue))
  }

  const clearCardtext = () => {
    dispatch(clear())
    setLocalValue([])
    Transforms.delete(editor, { at: [] })
  }

  const isBoldActive = () => Editor.marks(editor)?.bold === true
  const isItalicActive = () => Editor.marks(editor)?.italic === true
  const isUnderlineActive = () => Editor.marks(editor)?.underline === true

  const applyMark = (
    format: 'bold' | 'italic' | 'underline' | 'color' | 'fontSize',
    value?: any
  ) => {
    if (Editor.marks(editor)?.[format]) {
      Editor.removeMark(editor, format)
    } else {
      Editor.addMark(editor, format, value ?? true)
    }
  }

  const applyAlign = (align: 'left' | 'center' | 'right' | 'justify') => {
    Transforms.setNodes(
      editor,
      { align },
      { match: (n) => Editor.isBlock(editor, n as any) }
    )
  }

  return {
    state: {
      editor,
      value,
      plainText,
      isComplete,
      editorRef,
      editableRef,
    },
    actions: {
      handleSlateChange,
      clearCardtext,
      toggleBold: () => toggleBold(editor),
      toggleItalic: () => toggleItalic(editor),
      toggleUnderline: () => toggleUnderline(editor),
      isBoldActive,
      isItalicActive,
      isUnderlineActive,
      applyMark,
      applyAlign,
    },
  }
}
