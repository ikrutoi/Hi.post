import type { IconState } from '@shared/config/constants'
import type { BaseSectionConfig } from './toolbar.types'

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

export const CARDTEXT_TOOLBAR: {
  group: string
  icons: { key: CardtextKey; state: IconState }[]
}[] = [
  {
    group: 'text',
    icons: CARDTEXT_KEYS.filter((k) =>
      [
        'italic',
        'bold',
        'underline',
        'fontSize',
        'color',
        'left',
        'center',
        'right',
        'justify',
      ].includes(k)
    ).map((key) => ({ key, state: 'disabled' })),
  },
  {
    group: 'ui',
    icons: CARDTEXT_KEYS.filter((k) =>
      ['save', 'remove', 'textTemplates'].includes(k)
    ).map((key) => ({ key, state: 'disabled' })),
  },
]

export interface CardtextSectionConfig extends BaseSectionConfig<
  CardtextToolbarState,
  CardtextKey,
  'cardtext'
> {}
