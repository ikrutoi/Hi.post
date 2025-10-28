import type { IconKey, IconState } from '@shared/config/constants'

export const CARDTEXT_KEYS = [
  'italic',
  'fontSize',
  'color',
  'left',
  'center',
  'right',
  'justify',
  'save',
  'delete',
  'savedTemplates',
  // 'savedTemplatesCount',
] as const satisfies readonly IconKey[]

export type CardtextToolbarKey = (typeof CARDTEXT_KEYS)[number]

export type CardtextToolbarState = Record<CardtextToolbarKey, IconState>

export const CARDTEXT_TEXT_ALIGN_KEYS = [
  'left',
  'center',
  'right',
  'justify',
] as const

export type CardtextTextAlignKey = (typeof CARDTEXT_TEXT_ALIGN_KEYS)[number]

const DISABLED_KEYS: CardtextToolbarKey[] = ['save', 'delete', 'savedTemplates']

export const initialCardtextToolbarState: CardtextToolbarState =
  CARDTEXT_KEYS.reduce((acc, key) => {
    acc[key] = DISABLED_KEYS.includes(key) ? 'disabled' : 'enabled'
    return acc
  }, {} as CardtextToolbarState)
