import { flattenIcons } from '../helpers'
import type { BaseSectionConfig, ToolbarConfig } from './toolbar.types'

export const RIGHT_SIDEBAR_KEYS = ['userLogin', 'cart', 'favorite'] as const

export type RightSidebarKey = (typeof RIGHT_SIDEBAR_KEYS)[number]

export interface RightSidebarToolbarState extends Record<string, any> {
  [key: string]: any
  config: ToolbarConfig
}

export const RIGHT_SIDEBAR_TOOLBAR: ToolbarConfig = [
  {
    group: 'rightSidebar',
    icons: [
      { key: 'userLogin', state: 'enabled' },
      { key: 'cart', state: 'enabled' },
      { key: 'favorite', state: 'enabled' },
    ],
    status: 'enabled',
  },
]

export const initialRightSidebarToolbarState: RightSidebarToolbarState = {
  ...Object.fromEntries(flattenIcons(RIGHT_SIDEBAR_TOOLBAR)),
  config: [...RIGHT_SIDEBAR_TOOLBAR],
}

export interface RightSidebarSectionConfig extends BaseSectionConfig<
  RightSidebarToolbarState,
  RightSidebarKey,
  'rightSidebar'
> {}
