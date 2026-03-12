import { flattenIcons } from '../helpers'
import type { BaseSectionConfig, ToolbarConfig } from './toolbar.types'

export const CARDTEXT_KEYS = [
  // 'italic',
  // 'bold',
  // 'underline',
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
  'cardtextPlus',
  'empty',
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
    group: 'ui',
    icons: [
      { key: 'apply', state: 'enabled' },
      { key: 'cardtextPlus', state: 'enabled' },
      { key: 'listCardtext', state: 'enabled' },
      { key: 'empty', state: 'disabled' },
      { key: 'favorite', state: 'disabled' },
      { key: 'close', state: 'disabled' },
      { key: 'listAdd', state: 'disabled' },
    ],
    status: 'enabled',
  },
  {
    group: 'text',
    icons: [
      // {
      //   key: 'cardOrientation',
      //   state: 'disabled',
      //   options: { orientation: 'landscape' },
      // },
      { key: 'fontFamily', state: 'enabled' },
      { key: 'fontSizeMore', state: 'enabled' },
      { key: 'fontSizeIndicator', state: 'enabled' },
      { key: 'fontSizeLess', state: 'enabled' },
      { key: 'left', state: 'enabled' },
      { key: 'center', state: 'enabled' },
      { key: 'right', state: 'enabled' },
      { key: 'justify', state: 'enabled' },
    ],
    status: 'enabled',
  },
]

export const initialCardtextToolbarState: CardtextToolbarState = {
  ...Object.fromEntries(flattenIcons(CARDTEXT_TOOLBAR)),
  config: [...CARDTEXT_TOOLBAR],
}

export interface CardtextSectionConfig extends BaseSectionConfig<
  CardtextToolbarState,
  CardtextKey,
  'cardtext'
> {}
