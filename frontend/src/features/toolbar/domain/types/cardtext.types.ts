import { flattenIcons } from '../helpers'
import type { BaseSectionConfig, ToolbarConfig } from './toolbar.types'

export const CARDTEXT_KEYS = [
  'italic',
  'bold',
  'underline',
  'fontSize',
  'color',
  'left',
  'center',
  'right',
  'justify',
  'close',
  'save',
  'textTemplates',
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
    group: 'text',
    icons: [
      'italic',
      'bold',
      'underline',
      'fontSize',
      'color',
      'left',
      'center',
      'right',
      'justify',
    ].map((key) => ({ key: key as CardtextKey, state: 'disabled' })),
    status: 'enabled',
  },
  {
    group: 'ui',
    icons: ['close', 'save', 'textTemplates'].map((key) => ({
      key: key as CardtextKey,
      state: 'disabled',
    })),
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
