import { flattenIcons } from '../helpers'
import type { BaseSectionConfig, ToolbarConfig } from './toolbar.types'

export const USER_PANEL_KEYS = [
  'applyLight',
  'return',
  // 'postcardFavorite',
  'editLight',
  'cardphotoAdd',
  'userLoginAdd',
] as const

export type UserPanelKey = (typeof USER_PANEL_KEYS)[number]

export interface UserPanelToolbarState extends Record<string, any> {
  [key: string]: any
  config: ToolbarConfig
}

export const USER_PANEL_CHOICE_PHOTO_TOOLBAR: ToolbarConfig = [
  {
    group: 'userPanel',
    icons: [
      // { key: 'applyLight', state: 'disabled' },
      { key: 'userLoginAdd', state: 'enabled' },
    ],
    status: 'enabled',
  },
  {
    group: 'actions',
    icons: [{ key: 'return', state: 'enabled' }],
    status: 'enabled',
  },
]

export const USER_PANEL_TOOLBAR: ToolbarConfig = [
  {
    group: 'userPanel',
    icons: [
      // { key: 'applyLight', state: 'disabled' },
      { key: 'userLoginEdit', state: 'enabled' },
    ],
    status: 'enabled',
  },
  // {
  //   group: 'actions',
  //   icons: [{ key: 'return', state: 'enabled' }],
  //   status: 'enabled',
  // },
]

export const initialUserPanelChoicePhotoToolbarState: UserPanelToolbarState = {
  ...Object.fromEntries(flattenIcons(USER_PANEL_CHOICE_PHOTO_TOOLBAR)),
  config: [...USER_PANEL_CHOICE_PHOTO_TOOLBAR],
}

export const initialUserPanelToolbarState: UserPanelToolbarState = {
  ...Object.fromEntries(flattenIcons(USER_PANEL_TOOLBAR)),
  config: [...USER_PANEL_TOOLBAR],
}

export interface UserPanelSectionConfig extends BaseSectionConfig<
  UserPanelToolbarState,
  UserPanelKey,
  'userPanel' | 'userPanelChoicePhoto'
> {}
