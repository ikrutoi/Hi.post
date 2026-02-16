import { flattenIcons } from '../helpers'
import type { ToolbarConfig, BaseSectionConfig } from './toolbar.types'

export const EDITOR_PIE_KEYS = ['addDrafts', 'delete'] as const

export type EditorPieKey = (typeof EDITOR_PIE_KEYS)[number]

export const EDITOR_PIE_TOOLBAR: ToolbarConfig = [
  {
    group: 'main',
    icons: [
      { key: 'addDrafts', state: 'enabled' },
      { key: 'delete', state: 'enabled' },
    ],
    status: 'enabled',
  },
]

export interface EditorPieToolbarState extends Record<string, any> {
  [key: string]: any
  config: ToolbarConfig
}

export const initialEditorPieToolbarState: EditorPieToolbarState = {
  ...Object.fromEntries(flattenIcons(EDITOR_PIE_TOOLBAR)),
  config: [...EDITOR_PIE_TOOLBAR],
}

export interface EditorPieSectionConfig extends BaseSectionConfig<
  EditorPieToolbarState,
  EditorPieKey,
  'editorPie'
> {}
