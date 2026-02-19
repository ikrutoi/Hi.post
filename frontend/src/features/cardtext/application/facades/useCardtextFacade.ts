import React from 'react'
import { Transforms, Editor, Element as SlateElement } from 'slate'
import { createEditor } from 'slate'
import { withReact } from 'slate-react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { setValue, clearText, setTextStyle } from '../../infrastructure/state'
import { initialCardtextValue } from '../../domain/types'
import type {
  CardtextValue,
  CardtextStyle,
  TextAlign,
} from '../../domain/types'
import {
  selectCardtextValue,
  selectFontSizeStep,
} from '../../infrastructure/selectors'

const MAX_FONT_STEP = 6

export const useCardtextFacade = () => {
  const dispatch = useAppDispatch()
  const editor = React.useMemo(() => withReact(createEditor()), [])

  const value = useAppSelector(selectCardtextValue)
  const fontSizeStep = useAppSelector(selectFontSizeStep)
  const resetToken = useAppSelector((state) => state.cardtext.resetToken)

  const setValueHandler = React.useCallback(
    (newValue: CardtextValue) => {
      dispatch(setValue(newValue))
    },
    [dispatch],
  )

  const reset = React.useCallback(() => {
    dispatch(clearText())
    const pointStart = Editor.start(editor, [])
    const pointEnd = Editor.end(editor, [])
    Transforms.delete(editor, {
      at: { anchor: pointStart, focus: pointEnd },
    })
    Transforms.insertNodes(editor, initialCardtextValue, { at: [0] })
  }, [dispatch, editor])

  const applyAlign = React.useCallback(
    (align: TextAlign) => {
      Transforms.setNodes(
        editor,
        { align },
        {
          match: (n) =>
            SlateElement.isElement(n) && Editor.isBlock(editor, n),
        },
      )
      dispatch(setTextStyle({ align }))
    },
    [dispatch, editor],
  )

  const updateStyle = React.useCallback(
    (newStyle: Partial<CardtextStyle>) => {
      dispatch(setTextStyle(newStyle))
    },
    [dispatch],
  )

  const changeFontSize = React.useCallback(
    (direction: 'more' | 'less') => {
      let nextStep = fontSizeStep
      if (direction === 'more' && fontSizeStep < MAX_FONT_STEP) nextStep++
      if (direction === 'less' && fontSizeStep > 1) nextStep--
      if (nextStep !== fontSizeStep) {
        dispatch(setTextStyle({ fontSizeStep: nextStep }))
      }
    },
    [dispatch, fontSizeStep],
  )

  const decreaseFontSize = React.useCallback(() => {
    if (fontSizeStep > 1) {
      dispatch(setTextStyle({ fontSizeStep: fontSizeStep - 1 }))
    }
  }, [dispatch, fontSizeStep])

  return {
    editor,
    value,
    resetToken,
    fontSizeStep,
    editorRef: React.useRef<HTMLDivElement>(null),
    editableRef: React.useRef<HTMLDivElement>(null),
    setValue: setValueHandler,
    reset,
    applyAlign,
    updateStyle,
    changeFontSize,
    decreaseFontSize,
  }
}
