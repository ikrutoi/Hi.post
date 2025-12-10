import { useState, useRef } from 'react'
import { Descendant, Editor } from 'slate'
import { useEditorSetup } from '@cardtext/infrastructure/slate/useEditorSetup'
import {
  toggleBold,
  toggleUnderline,
  toggleItalic,
} from '../../application/commands'

export const useCardEditorController = () => {
  const editor = useEditorSetup()

  const initialValue: Descendant[] = [
    { type: 'paragraph', children: [{ text: '' }] } as Descendant,
  ]

  const [value, setValue] = useState<Descendant[]>(initialValue)

  const editorRef = useRef<HTMLDivElement>(null)
  const editableRef = useRef<HTMLDivElement>(null)

  const handleSlateChange = (newValue: Descendant[]) => {
    setValue(newValue)
  }
  const handleToggleItalic = () => toggleItalic(editor)
  const handleToggleBold = () => toggleBold(editor)
  const handleToggleUnderline = () => toggleUnderline(editor)

  const isItalicActive = () => Editor.marks(editor)?.italic === true
  const isBoldActive = () => Editor.marks(editor)?.bold === true
  const isUnderlineActive = () => Editor.marks(editor)?.underline === true

  const state = {
    editor,
    value,
    editorRef,
    editableRef,
  }

  const actions = {
    setValue,
    handleSlateChange,
    handleToggleBold,
    handleToggleItalic,
    handleToggleUnderline,
    isItalicActive,
    isBoldActive,
    isUnderlineActive,
  }

  return { state, actions }
}
