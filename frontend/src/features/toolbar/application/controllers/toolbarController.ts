import type { ReactEditor } from 'slate-react'
import type { AppDispatch } from '@app/state'
import type { ToolbarSection, ToolbarKeyFor } from '../../domain/types'
import { cardtextToolbarController } from '@cardtext/application/controllers'

export const toolbarController = {
  onAction: (
    section: ToolbarSection,
    key: ToolbarKeyFor<typeof section>,
    editor: ReactEditor | undefined,
    dispatch: AppDispatch
  ) => {
    switch (section) {
      case 'cardtext':
        if (!editor) return
        switch (key) {
          case 'bold':
            cardtextToolbarController.toggleBold(editor, dispatch)
            break
          case 'italic':
            cardtextToolbarController.toggleItalic(editor, dispatch)
            break
          case 'underline':
            cardtextToolbarController.toggleUnderline(editor, dispatch)
            break
          case 'left':
          case 'center':
          case 'right':
          case 'justify':
            cardtextToolbarController.setAlign(editor, dispatch, key as any)
            break
        }
        break

      case 'cardphoto':
        switch (key) {
          case 'crop':
            console.log('Crop action')
            break
          case 'turn':
            console.log('Turn photo')
            break
          case 'fillFrame':
            console.log('Fill frame')
            break
          // и т.д.
        }
        break

      case 'sender':
      case 'recipient':
        if (key === 'remove') {
          console.log('Remove address field')
        }
        break

      case 'cardPanel':
      case 'cardPanelOverlay':
        console.log('Panel action', key)
        break
    }
  },
}
