import { flattenIcons } from '../helpers'
import type { ToolbarConfig, BaseSectionConfig } from './toolbar.types'

export const CARDPHOTO_KEYS = [
  'cardOrientation',
  'imageRotateLeft',
  'imageRotateRight',
  'imageReset',
  'crop',
  'cropFull',
  'cropCheck',
  // 'cropDelete',
  'apply',
  'download',
  'close',
  // 'save',
  // 'photoTemplates',
  'cropHistory',
  'listDelete',
  'listApply',
] as const

export type CardphotoKey = (typeof CARDPHOTO_KEYS)[number]

export interface CardphotoToolbarState extends Record<string, any> {
  [key: string]: any
  config: ToolbarConfig
}

export interface BaseToolbarState extends Record<string, any> {
  config: ToolbarConfig
}

export const CARDPHOTO_TOOLBAR: ToolbarConfig = [
  {
    group: 'cardphoto',
    icons: [
      { key: 'apply', state: 'enabled' },
      { key: 'cardphotoAdd', state: 'enabled' },
      { key: 'listCardphoto', state: 'enabled' },
    ],
    status: 'enabled',
  },
  // {
  //   group: 'edit',
  //   icons: [
  //     // {
  //     //   key: 'cardOrientation',
  //     //   state: 'disabled',
  //     //   options: { orientation: 'landscape' },
  //     // },
  //     // { key: 'imageRotateLeft', state: 'disabled' },
  //     { key: 'imageRotateRight', state: 'disabled' },
  //     { key: 'crop', state: 'disabled' },
  //     { key: 'cropFull', state: 'disabled' },
  //     { key: 'cropCheck', state: 'disabled' },
  //     { key: 'imageReset', state: 'disabled' },
  //   ],
  //   status: 'enabled',
  // },
  // {
  //   group: 'ui',
  //   icons: [
  //     { key: 'apply', state: 'enabled' },
  //     { key: 'download', state: 'enabled' },
  //     { key: 'close', state: 'disabled' },
  //   ],
  //   status: 'enabled',
  // },
  // {
  //   group: 'processed',
  //   icons: [
  //     { key: 'listApply', state: 'disabled' },
  //     { key: 'listDelete', state: 'disabled' },
  //   ],
  //   status: 'enabled',
  // },
]

export const CARDPHOTO_CREATE_TOOLBAR: ToolbarConfig = [
  {
    group: 'create',
    icons: [{ key: 'listAdd', state: 'disabled' }],
    status: 'enabled',
  },
  {
    group: 'font',
    icons: [
      { key: 'imageRotateLeft', state: 'disabled' },
      { key: 'imageRotateRight', state: 'disabled' },
      { key: 'crop', state: 'disabled' },
      { key: 'cropFull', state: 'disabled' },
      { key: 'cropCheck', state: 'disabled' },
      { key: 'imageReset', state: 'disabled' },
    ],
    status: 'enabled',
  },
]

export const CARDPHOTO_EDITOR_TOOLBAR: ToolbarConfig = [
  {
    group: 'editor',
    icons: [
      // {
      //   key: 'cardOrientation',
      //   state: 'disabled',
      //   options: { orientation: 'landscape' },
      // },
      { key: 'imageRotateLeft', state: 'disabled' },
      { key: 'imageRotateRight', state: 'disabled' },
      { key: 'crop', state: 'disabled' },
      { key: 'cropFull', state: 'disabled' },
      { key: 'cropCheck', state: 'disabled' },
      { key: 'imageReset', state: 'disabled' },
    ],
    status: 'enabled',
  },
  // {
  //   group: 'view',
  //   icons: [{ key: 'delete', state: 'disabled' }],
  //   status: 'enabled',
  // },
]

export const CARDPHOTO_VIEW_TOOLBAR: ToolbarConfig = [
  {
    group: 'editor',
    icons: [
      { key: 'edit', state: 'enabled' },
      { key: 'favorite', state: 'enabled' },
    ],
    status: 'enabled',
  },

  {
    group: 'view',
    icons: [{ key: 'delete', state: 'enabled' }],
    status: 'enabled',
  },
]

export const initialCardphotoToolbarState: CardphotoToolbarState = {
  ...Object.fromEntries(flattenIcons(CARDPHOTO_TOOLBAR)),
  config: [...CARDPHOTO_TOOLBAR],
}

export const initialCardphotoCreateToolbarState: CardphotoToolbarState = {
  ...Object.fromEntries(flattenIcons(CARDPHOTO_CREATE_TOOLBAR)),
  config: [...CARDPHOTO_CREATE_TOOLBAR],
}

export const initialCardphotoViewToolbarState: CardphotoToolbarState = {
  ...Object.fromEntries(flattenIcons(CARDPHOTO_VIEW_TOOLBAR)),
  config: [...CARDPHOTO_VIEW_TOOLBAR],
}

export const initialCardphotoEditorToolbarState: CardphotoToolbarState = {
  ...Object.fromEntries(flattenIcons(CARDPHOTO_EDITOR_TOOLBAR)),
  config: [...CARDPHOTO_EDITOR_TOOLBAR],
}

export interface CardphotoSectionConfig extends BaseSectionConfig<
  CardphotoToolbarState,
  CardphotoKey,
  'cardphoto' | 'cardphotoEditor' | 'cardphotoView' | 'cardphotoCreate'
> {}
