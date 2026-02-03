import React from 'react'
import { createEditor } from 'slate'
import { withReact } from 'slate-react'
import { useAppSelector } from '@app/hooks'
import { useCardtextController } from '../controllers'
import { useForceUpdateCardtextToolbar } from '../commands'
import {
  selectCardtextState,
  selectCardtextValue,
  selectCardtextPlainText,
  selectCardtextIsComplete,
  selectCardtextLines,
  selectFontSizeStep,
} from '../../infrastructure/selectors'
import type { CardtextValue } from '../../domain/types'

export const useCardtextFacade = () => {
  const controller = useCardtextController()

  const editor = React.useMemo(() => withReact(createEditor()), [])
  const { forceUpdateToolbar } = useForceUpdateCardtextToolbar(editor)

  const reduxValue = useAppSelector(selectCardtextValue)
  const plainText = useAppSelector(selectCardtextPlainText)
  const isComplete = useAppSelector(selectCardtextIsComplete)
  const fontSizeStep = useAppSelector(selectFontSizeStep)
  const resetToken = useAppSelector((state) => state.cardtext.resetToken)
  const editorRef = React.useRef<HTMLDivElement>(null)
  const editableRef = React.useRef<HTMLDivElement>(null)

  const [value, setLocalValue] = React.useState<CardtextValue>(reduxValue)

  React.useEffect(() => {
    setLocalValue(reduxValue)
  }, [reduxValue])

  return {
    state: {
      editor,
      value,
      plainText,
      isComplete,
      editorRef,
      editableRef,
      fontSizeStep,
    },

    actions: {
      setValue: controller.actions.handleSlateChange,
      reset: controller.actions.clearCardtext,
      applyAlign: controller.actions.applyAlign,

      toggleBold: controller.actions.toggleBold,
      toggleItalic: controller.actions.toggleItalic,
      toggleUnderline: controller.actions.toggleUnderline,

      isBoldActive: controller.actions.isBoldActive,
      isItalicActive: controller.actions.isItalicActive,
      isUnderlineActive: controller.actions.isUnderlineActive,

      setFontSizeStep: controller.actions.setFontSizeStep,
    },

    selectors: {
      selectCardtextState,
      selectCardtextValue,
      selectCardtextPlainText,
      selectCardtextIsComplete,
      selectCardtextLines,
      selectFontSizeStep,
    },
  }
}
