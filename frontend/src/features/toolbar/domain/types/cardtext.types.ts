import { flattenIcons } from '../helpers'
import type { BaseSectionConfig, ToolbarConfig } from './toolbar.types'

export const CARDTEXT_KEYS = [
  // 'cardOrientation',
  'fontFamily',
  'fontSizeLess',
  'fontSizeIndicator',
  'fontSizeMore',
  // 'color',
  'left',
  'center',
  'right',
  'justify',
  'apply',
  'close',
  'save',
  'listAdd',
  'favorite',
  'listCardtext',
  'cardtextAdd',
  'empty',
  'edit',
  // 'delete',
] as const

export type CardtextKey = (typeof CARDTEXT_KEYS)[number]

export interface CardtextToolbarState extends Record<string, any> {
  [key: string]: any
  config: ToolbarConfig
}

export const TEXT_ALIGN_KEYS = ['left', 'center', 'right', 'justify'] as const
export type TextAlignKey = (typeof TEXT_ALIGN_KEYS)[number]

export const CARDTEXT_TOOLBAR: ToolbarConfig = [
  {
    group: 'cardtext',
    icons: [
      { key: 'apply', state: 'enabled' },
      { key: 'cardtextAdd', state: 'enabled' },
      { key: 'listCardtext', state: 'enabled' },
    ],
    status: 'enabled',
  },
]

export const CARDTEXT_EDITOR_TOOLBAR: ToolbarConfig = [
  // {
  //   group: 'editor',
  //   icons: [
  //     { key: 'apply', state: 'enabled' },
  //     { key: 'listAdd', state: 'enabled' },
  //     { key: 'close', state: 'enabled' },
  //   ],
  //   status: 'enabled',
  // },
  {
    group: 'font',
    icons: [
      { key: 'edit', state: 'enabled' },
      { key: 'fontSizeLess', state: 'enabled' },
      { key: 'fontSizeIndicator', state: 'enabled' },
      { key: 'fontSizeMore', state: 'enabled' },
      { key: 'fontFamily', state: 'enabled' },
      { key: 'left', state: 'enabled' },
    ],
    status: 'enabled',
  },
]

export const CARDTEXT_VIEW_TOOLBAR: ToolbarConfig = [
  {
    group: 'view',
    icons: [
      { key: 'edit', state: 'enabled' },
      { key: 'favorite', state: 'enabled' },
    ],
    status: 'enabled',
  },
  // {
  //   group: 'view',
  //   icons: [
  //     { key: 'apply', state: 'enabled' },
  //     { key: 'cardtextAdd', state: 'enabled' },
  //     { key: 'listCardtext', state: 'enabled' },
  //   ],
  //   status: 'enabled',
  // },
  {
    group: 'view',
    icons: [
      // { key: 'edit', state: 'enabled' },
      // { key: 'favorite', state: 'enabled' },
      // { key: 'empty', state: 'enabled' },
      { key: 'delete', state: 'enabled' },
    ],
    status: 'enabled',
  },
]

export const initialCardtextToolbarState: CardtextToolbarState = {
  ...Object.fromEntries(flattenIcons(CARDTEXT_TOOLBAR)),
  config: [...CARDTEXT_TOOLBAR],
}

export const initialCardtextEditorToolbarState: CardtextToolbarState = {
  ...Object.fromEntries(flattenIcons(CARDTEXT_EDITOR_TOOLBAR)),
  config: [...CARDTEXT_EDITOR_TOOLBAR],
}

export const initialCardtextViewToolbarState: CardtextToolbarState = {
  ...Object.fromEntries(flattenIcons(CARDTEXT_VIEW_TOOLBAR)),
  config: [...CARDTEXT_VIEW_TOOLBAR],
}

export interface CardtextSectionConfig extends BaseSectionConfig<
  CardtextToolbarState,
  CardtextKey,
  'cardtext' | 'cardtextEditor' | 'cardtextView'
> {}
