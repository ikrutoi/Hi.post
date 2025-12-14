import { flattenIcons } from '../helpers'
import type { IconState } from '@shared/config/constants'
import type { ToolbarConfig, BaseSectionConfig } from './toolbar.types'

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
  'save',
  'remove',
  'textTemplates',
] as const

export type CardtextKey = (typeof CARDTEXT_KEYS)[number]

export type CardtextToolbarState = Record<CardtextKey, IconState>

export const TEXT_ALIGN_KEYS = ['left', 'center', 'right', 'justify'] as const

export type TextAlignKey = (typeof TEXT_ALIGN_KEYS)[number]

export const CARDTEXT_TOOLBAR: ToolbarConfig = [
  {
    group: 'text',
    icons: [
      { key: 'italic', state: 'enabled' },
      { key: 'bold', state: 'enabled' },
      { key: 'underline', state: 'enabled' },
      { key: 'fontSize', state: 'enabled' },
      { key: 'color', state: 'enabled' },
      { key: 'left', state: 'active' },
      { key: 'center', state: 'enabled' },
      { key: 'right', state: 'enabled' },
      { key: 'justify', state: 'enabled' },
    ],
  },
  {
    group: 'ui',
    icons: [
      { key: 'save', state: 'disabled' },
      { key: 'remove', state: 'disabled' },
      { key: 'textTemplates', state: 'disabled' },
    ],
  },
]

export const initialCardtextToolbarState: CardtextToolbarState =
  Object.fromEntries(flattenIcons(CARDTEXT_TOOLBAR)) as CardtextToolbarState

export interface CardtextSectionConfig extends BaseSectionConfig<
  CardtextToolbarState,
  CardtextKey,
  'cardtext'
> {}
