import React from 'react'
import {
  createEditor,
  Transforms,
  Editor,
  Element as SlateElement,
} from 'slate'
import { withReact } from 'slate-react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { setValue, clear, setTextStyle } from '../../infrastructure/state'
import { useForceUpdateCardtextToolbar } from '../commands'
import {
  selectCardtextValue,
  selectCardtextPlainText,
  selectCardtextIsComplete,
  selectFontSizeStep,
  selectCardtextStyle,
} from '../../infrastructure/selectors'
import { EMPTY_PARAGRAPH } from '../../domain/types'
import { toggleBold, toggleItalic, toggleUnderline } from '../commands'
import type {
  CardtextValue,
  CardtextStyle,
  TextAlign,
} from '../../domain/types'

export const useCardtextController = () => {
  const dispatch = useAppDispatch()
  // const { setValue, clear, setTextStyle } = cardtextSlice.actions

  const editor = React.useMemo(() => withReact(createEditor()), [])
  const { forceUpdateToolbar } = useForceUpdateCardtextToolbar(editor)

  const reduxValue = useAppSelector(selectCardtextValue)
  const plainText = useAppSelector(selectCardtextPlainText)
  const isComplete = useAppSelector(selectCardtextIsComplete)
  const resetToken = useAppSelector((state) => state.cardtext.resetToken)

  const style = useAppSelector(selectCardtextStyle)
  // const { fontSizeStep, fontFamily, color } = style

  const [value, setLocalValue] = React.useState<CardtextValue>(reduxValue)

  React.useEffect(() => {
    setLocalValue(reduxValue)
  }, [reduxValue])

  React.useEffect(() => {
    dispatch({ type: 'cardtext/init' })
    forceUpdateToolbar()
  }, [dispatch])

  React.useEffect(() => {
    editor.children = reduxValue
    if (editor.children.length > 0) {
      const start = Editor.start(editor, [])
      editor.selection = { anchor: start, focus: start }
    }
    editor.onChange()
    forceUpdateToolbar()
  }, [resetToken, editor, reduxValue])

  const editorRef = React.useRef<HTMLDivElement>(null)
  const editableRef = React.useRef<HTMLDivElement>(null)

  const handleSlateChange = (newValue: CardtextValue) => {
    setLocalValue(newValue)
    dispatch(setValue(newValue))
  }

  const clearCardtext = () => {
    dispatch(clear())
    setLocalValue(EMPTY_PARAGRAPH)
    Transforms.delete(editor, { at: [] })
    Transforms.insertNodes(editor, EMPTY_PARAGRAPH, { at: [0] })
  }

  const applyAlign = (align: TextAlign) => {
    Transforms.setNodes(
      editor,
      { align },
      {
        match: (n) => SlateElement.isElement(n) && Editor.isBlock(editor, n),
      },
    )
    dispatch(setTextStyle({ align }))
  }

  return {
    state: {
      editor,
      value,
      plainText,
      isComplete,
      editorRef,
      editableRef,
      style,
    },
    actions: {
      handleSlateChange,
      clearCardtext,
      applyAlign,
      updateStyle: (newStyle: Partial<CardtextStyle>) =>
        dispatch(setTextStyle(newStyle)),
    },
  }
}
