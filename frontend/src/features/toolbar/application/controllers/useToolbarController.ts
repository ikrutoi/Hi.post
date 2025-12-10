import { toolbarActions } from '../../infrastructure/state'
import type { AppDispatch } from '@app/state'
import type { ToolbarState } from '../../domain/types'

import {
  toggleItalic,
  toggleBold,
  toggleUnderline,
} from '@features/cardtext/application/commands'
import { Editor } from 'slate'

export const useToolbarController = (dispatch: AppDispatch) => {
  const updateToolbar = (payload: Partial<ToolbarState>) =>
    dispatch(toolbarActions.updateToolbar(payload))

  return {
    update: updateToolbar,

    updateSection: <K extends keyof ToolbarState>(
      section: K,
      payload: Partial<ToolbarState[K]>
    ) => {
      updateToolbar({ [section]: payload })
    },

    updateKey: <
      K extends keyof ToolbarState,
      Key extends keyof ToolbarState[K],
    >(
      section: K,
      key: Key,
      value: ToolbarState[K][Key]
    ) => {
      updateToolbar({ [section]: { [key]: value } })
    },

    reset: () => dispatch(toolbarActions.resetToolbar()),

    toggleItalic: (editor: Editor) => {
      toggleItalic(editor)
      dispatch(
        toolbarActions.updateToolbar({
          cardtext: { italic: 'active' },
        })
      )
    },

    toggleBold: (editor: Editor) => {
      toggleBold(editor)
      dispatch(
        toolbarActions.updateToolbar({
          cardtext: { bold: 'active' },
        })
      )
    },

    toggleUnderline: (editor: Editor) => {
      toggleUnderline(editor)
      dispatch(
        toolbarActions.updateToolbar({
          cardtext: { underline: 'active' },
        })
      )
    },

    setAlign: (value: 'left' | 'center' | 'right' | 'justify') => {
      dispatch(
        toolbarActions.updateToolbar({
          cardtext: {
            left: value === 'left' ? 'active' : 'enabled',
            center: value === 'center' ? 'active' : 'enabled',
            right: value === 'right' ? 'active' : 'enabled',
            justify: value === 'justify' ? 'active' : 'enabled',
          },
        })
      )
    },
  }
}
