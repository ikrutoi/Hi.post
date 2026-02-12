import React from 'react'
import { createEditor } from 'slate'
import { withReact } from 'slate-react'
import { useAppSelector } from '@app/hooks'
import { useCardtextController } from '../controllers'
import {
  selectCardtextValue,
  selectFontSizeStep,
} from '../../infrastructure/selectors'

export const useCardtextFacade = () => {
  const editor = React.useMemo(() => withReact(createEditor()), [])
  const controller = useCardtextController(editor)

  const value = useAppSelector(selectCardtextValue)
  const fontSizeStep = useAppSelector(selectFontSizeStep)
  const resetToken = useAppSelector((state) => state.cardtext.resetToken)

  return {
    editor,
    value,
    resetToken,
    fontSizeStep,
    setValue: controller.handleSlateChange,
    reset: controller.clearCardtext,
    applyAlign: controller.applyAlign,
    updateStyle: controller.updateStyle,
    changeFontSize: controller.changeFontSize,
    decreaseFontSize: controller.decreaseFontSize,
    editorRef: React.useRef<HTMLDivElement>(null),
    editableRef: React.useRef<HTMLDivElement>(null),
  }
}
