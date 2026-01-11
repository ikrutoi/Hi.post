import { flattenIcons } from '../helpers'
import type { IconState, IconStateGroup } from '@shared/config/constants'
import type { BaseSectionConfig, ToolbarConfig } from './toolbar.types'

export const SECTION_EDITOR_MENU_KEYS = [
  'cardphoto',
  'cardtext',
  'envelope',
  'aroma',
  'date',
] as const

export type SectionEditorMenuKey = (typeof SECTION_EDITOR_MENU_KEYS)[number]

export interface SectionEditorMenuToolbarState extends Record<string, any> {
  [key: string]: any
  config: ToolbarConfig
}

export const SECTION_EDITOR_MENU_TOOLBAR: ToolbarConfig = [
  {
    group: 'menu',
    icons: ['cardphoto', 'cardtext', 'envelope', 'aroma', 'date'].map(
      (key) => ({ key: key as SectionEditorMenuKey, state: 'enabled' })
    ),
    status: 'enabled',
  },
]

export const initialSectionEditorMenuToolbarState: SectionEditorMenuToolbarState =
  {
    ...(Object.fromEntries(flattenIcons(SECTION_EDITOR_MENU_TOOLBAR)) as Record<
      SectionEditorMenuKey,
      IconState
    >),
    config: [...SECTION_EDITOR_MENU_TOOLBAR],
  }

export interface SectionEditorMenuConfig extends BaseSectionConfig<
  SectionEditorMenuToolbarState,
  SectionEditorMenuKey,
  'sectionEditorMenu'
> {}
