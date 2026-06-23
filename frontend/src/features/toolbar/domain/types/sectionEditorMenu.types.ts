import { flattenIcons } from '../helpers'
import type { BaseSectionConfig, ToolbarConfig } from './toolbar.types'

export const SECTION_EDITOR_MENU_ICON_KEYS = [
  'cardphoto',
  'cardtext',
  'envelope',
  'aroma',
  'date',
] as const

export const SECTION_EDITOR_MENU_KEYS = [
  'cardPie',
  ...SECTION_EDITOR_MENU_ICON_KEYS,
  'history',
] as const

export const SECTION_EDITOR_MENU_CARD_PIE_TOOLBAR_GROUP = {
  group: 'cardPie',
  icons: [{ key: 'cardPie' as const, state: 'enabled' as const }],
  status: 'enabled' as const,
} as const

export type SectionEditorMenuKey = (typeof SECTION_EDITOR_MENU_KEYS)[number]

export interface SectionEditorMenuToolbarState extends Record<string, any> {
  [key: string]: any
  config: ToolbarConfig
}

export const SECTION_EDITOR_MENU_TOOLBAR: ToolbarConfig = [
  SECTION_EDITOR_MENU_CARD_PIE_TOOLBAR_GROUP,
  {
    group: 'menu',
    icons: SECTION_EDITOR_MENU_ICON_KEYS.map((key) => ({
      key: key as SectionEditorMenuKey,
      state: 'enabled',
    })),
    status: 'enabled',
  },
]

export const initialSectionEditorMenuToolbarState: SectionEditorMenuToolbarState =
  {
    ...Object.fromEntries(flattenIcons(SECTION_EDITOR_MENU_TOOLBAR)),
    config: [...SECTION_EDITOR_MENU_TOOLBAR],
  }

export interface SectionEditorMenuConfig extends BaseSectionConfig<
  SectionEditorMenuToolbarState,
  SectionEditorMenuKey,
  'sectionEditorMenu'
> {}
