import { flattenIcons } from '../helpers'
import type { IconKey } from '@shared/config/constants'
import type { BaseSectionConfig, ToolbarConfig } from './toolbar.types'

export const ENVELOPE_KEYS = [
  // 'favorite',
  // 'empty',
  'close',
  'addressPlus',
  'addressList',
  // 'deleteList',
] as const satisfies readonly IconKey[]

export type EnvelopeKey = (typeof ENVELOPE_KEYS)[number]

export interface EnvelopeToolbarState extends Record<string, any> {
  [key: string]: any
  config: ToolbarConfig
}

export const ENVELOPE_TOOLBAR: ToolbarConfig = [
  {
    group: 'address',
    icons: [
      { key: 'close', state: 'disabled' },
      { key: 'addressPlus', state: 'disabled' },
      { key: 'addressList', state: 'disabled' },
      // { key: 'empty', state: 'disabled' },
      // { key: 'favorite', state: 'enabled' },
    ],
    status: 'enabled',
  },
  // {
  //   group: 'favorite',
  //   icons: [{ key: 'favorite', state: 'enabled' }],
  //   status: 'enabled',
  // },
]

export const initialSenderToolbarState: EnvelopeToolbarState = {
  ...Object.fromEntries(flattenIcons(ENVELOPE_TOOLBAR)),
  config: [...ENVELOPE_TOOLBAR],
}

export const initialRecipientToolbarState: EnvelopeToolbarState = {
  ...Object.fromEntries(flattenIcons(ENVELOPE_TOOLBAR)),
  config: [...ENVELOPE_TOOLBAR],
}

export interface EnvelopeSectionConfig extends BaseSectionConfig<
  EnvelopeToolbarState,
  EnvelopeKey,
  'sender' | 'recipient'
> {}
