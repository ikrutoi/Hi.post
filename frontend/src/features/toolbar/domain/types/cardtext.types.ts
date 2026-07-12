import { flattenIcons } from '../helpers'
import type { BaseSectionConfig, ToolbarConfig } from './toolbar.types'

export const CARDTEXT_KEYS = [
  // 'cardOrientation',
  'fontFamily',
  'fontSizeLess',
  'fontSizeIndicator',
  'fontSizeMore',
  'left',
  'center',
  'right',
  'justify',
  'apply',
  'close',
  'save',
  'listAdd',
  'listCardtext',
  'cardtextAdd',
  'empty',
  'edit',
  'colorPicker',
  'cardtextCheck',
  'addList',
  'delete',
  'applyLight',
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

export const CARDTEXT_COMPOSER_TOOLBAR: ToolbarConfig = [
  {
    group: 'create',
    icons: [{ key: 'applyMedium', state: 'disabled' }],
    status: 'enabled',
  },
  {
    group: 'font',
    icons: [
      { key: 'fontSizeLess', state: 'enabled' },
      { key: 'fontSizeIndicator', state: 'enabled' },
      { key: 'fontSizeMore', state: 'enabled' },
      { key: 'fontFamily', state: 'enabled' },
      { key: 'colorPicker', state: 'enabled' },
      { key: 'left', state: 'enabled' },
    ],
    status: 'enabled',
  },
]

/** Mobile/desktop factory: return справа в верхнем toolbar формы редактирования. */
export const CARDTEXT_EDITOR_UPPER_RETURN_TOOLBAR: ToolbarConfig = [
  {
    group: 'close',
    icons: [{ key: 'return', state: 'enabled' }],
    status: 'enabled',
  },
]

export const CARDTEXT_VIEW_TOOLBAR: ToolbarConfig = [
  {
    group: 'font',
    icons: [
      { key: 'addList', state: 'enabled' },
      { key: 'edit', state: 'enabled' },
    ],
    status: 'enabled',
  },
  {
    group: 'close',
    icons: [{ key: 'close', state: 'enabled' }],
    status: 'enabled',
  },
]

export const initialCardtextToolbarState: CardtextToolbarState = {
  ...Object.fromEntries(flattenIcons(CARDTEXT_TOOLBAR)),
  config: [...CARDTEXT_TOOLBAR],
}

export const initialCardtextComposerToolbarState: CardtextToolbarState = {
  ...Object.fromEntries(flattenIcons(CARDTEXT_COMPOSER_TOOLBAR)),
  config: [...CARDTEXT_COMPOSER_TOOLBAR],
}

export const initialCardtextViewToolbarState: CardtextToolbarState = {
  ...Object.fromEntries(flattenIcons(CARDTEXT_VIEW_TOOLBAR)),
  config: [...CARDTEXT_VIEW_TOOLBAR],
}

export interface CardtextSectionConfig extends BaseSectionConfig<
  CardtextToolbarState,
  CardtextKey,
  'cardtext' | 'cardtextEditor' | 'cardtextView' | 'cardtextCreate'
> {}
