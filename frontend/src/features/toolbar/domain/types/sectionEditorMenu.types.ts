import { flattenIcons } from '../helpers'
import type { IconState } from '@shared/config/constants'
import type { BaseSectionConfig } from './toolbar.types'

export const SECTION_EDITOR_MENU_KEYS = [
  'cardphoto',
  'cardtext',
  'envelope',
  'aroma',
  'date',
] as const

export type SectionEditorMenuKey = (typeof SECTION_EDITOR_MENU_KEYS)[number]
export type SectionEditorMenuToolbarState = Record<
  SectionEditorMenuKey,
  IconState
>

export const SECTION_EDITOR_MENU_TOOLBAR: {
  group: string
  icons: { key: SectionEditorMenuKey; state: IconState }[]
}[] = [
  {
    group: 'menu',
    icons: SECTION_EDITOR_MENU_KEYS.filter((k) =>
      ['cardphoto', 'cardtext', 'envelope', 'aroma', 'date'].includes(k)
    ).map((key) => ({ key, state: 'enabled' })),
  },
]

export const initialSectionEditorMenuToolbarState: SectionEditorMenuToolbarState =
  Object.fromEntries(
    flattenIcons(SECTION_EDITOR_MENU_TOOLBAR)
  ) as SectionEditorMenuToolbarState

export interface SectionEditorMenuConfig extends BaseSectionConfig<
  SectionEditorMenuToolbarState,
  SectionEditorMenuKey,
  'sectionEditorMenu'
> {}
