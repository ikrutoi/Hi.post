import { useCardtextController } from '../controllers'
import {
  selectCardtextState,
  selectCardtextValue,
  selectCardtextPlainText,
  selectCardtextIsComplete,
  selectCardtextLines,
} from '../../infrastructure/selectors'

export const useCardtextFacade = () => {
  const controller = useCardtextController()

  return {
    state: {
      editor: controller.state.editor,
      value: controller.state.value,
      plainText: controller.state.plainText,
      isComplete: controller.state.isComplete,
      editorRef: controller.state.editorRef,
      editableRef: controller.state.editableRef,
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
    },

    selectors: {
      selectCardtextState,
      selectCardtextValue,
      selectCardtextPlainText,
      selectCardtextIsComplete,
      selectCardtextLines,
    },
  }
}
