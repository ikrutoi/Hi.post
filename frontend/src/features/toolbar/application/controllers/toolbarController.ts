import type { ReactEditor } from 'slate-react'
import type { AppDispatch } from '@app/state'
import type { ToolbarSection, ToolbarKeyFor } from '../../domain/types'
import { TOOLBAR_CONFIG } from '../../domain/config'

export const toolbarController = {
  onAction<S extends ToolbarSection>(
    section: S,
    key: ToolbarKeyFor<S>,
    editor: ReactEditor,
    dispatch: AppDispatch
  ) {
    const config = TOOLBAR_CONFIG[section] as any
    if (config?.onAction) {
      config.onAction(key, section, editor, dispatch)
    }
  },
}
