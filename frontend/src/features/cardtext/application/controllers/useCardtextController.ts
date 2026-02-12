import React from 'react'
import { Transforms, Editor, Element as SlateElement } from 'slate'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { setValue, clearText, setTextStyle } from '../../infrastructure/state'
import { initialCardtextValue } from '../../domain/types'
import type {
  CardtextValue,
  CardtextStyle,
  TextAlign,
} from '../../domain/types'
import { selectFontSizeStep } from '../../infrastructure/selectors'

export const useCardtextController = (editor: Editor) => {
  const dispatch = useAppDispatch()
  const fontSizeStep = useAppSelector(selectFontSizeStep)
  const maxStep = 6

  const decreaseFontSize = React.useCallback(() => {
    if (fontSizeStep > 1) {
      dispatch(setTextStyle({ fontSizeStep: fontSizeStep - 1 }))
    }
  }, [dispatch, fontSizeStep])

  const changeFontSize = React.useCallback(
    (direction: 'more' | 'less') => {
      let nextStep = fontSizeStep

      if (direction === 'more' && fontSizeStep < maxStep) nextStep++
      if (direction === 'less' && fontSizeStep > 1) nextStep--

      if (nextStep !== fontSizeStep) {
        dispatch(setTextStyle({ fontSizeStep: nextStep }))
      }
    },
    [dispatch, fontSizeStep],
  )

  const handleSlateChange = React.useCallback(
    (newValue: CardtextValue) => {
      dispatch(setValue(newValue))
    },
    [dispatch],
  )

  const clearCardtext = React.useCallback(() => {
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
          match: (n) => SlateElement.isElement(n) && Editor.isBlock(editor, n),
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

  return {
    handleSlateChange,
    clearCardtext,
    applyAlign,
    updateStyle,
    changeFontSize,
    decreaseFontSize,
  }
}
