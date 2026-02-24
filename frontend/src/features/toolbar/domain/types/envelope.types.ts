import { flattenIcons } from '../helpers'
import type { IconKey } from '@shared/config/constants'
import type { BaseSectionConfig, ToolbarConfig } from './toolbar.types'

export const ENVELOPE_KEYS = [
  // 'favorite',
  // 'empty',
  'close',
  'addressPlus',
  'addressList',
  'apply',
  // 'deleteList',
] as const satisfies readonly IconKey[]

export type EnvelopeKey = (typeof ENVELOPE_KEYS)[number]

export interface EnvelopeToolbarState extends Record<string, any> {
  [key: string]: any
  config: ToolbarConfig
}

export const RECIPIENT_TOOLBAR: ToolbarConfig = [
  {
    group: 'address',
    icons: [
      { key: 'addressList', state: 'disabled' },
      { key: 'apply', state: 'disabled' },
      { key: 'addressPlus', state: 'disabled' },
      { key: 'close', state: 'disabled' },
      // { key: 'empty', state: 'disabled' },
      // { key: 'favorite', state: 'enabled' },
    ],
    status: 'enabled',
  },
]

export const SENDER_TOOLBAR: ToolbarConfig = [
  {
    group: 'address',
    icons: [
      { key: 'close', state: 'disabled' },
      { key: 'addressPlus', state: 'disabled' },
      { key: 'apply', state: 'disabled' },
      { key: 'addressList', state: 'disabled' },
      // { key: 'empty', state: 'disabled' },
      // { key: 'favorite', state: 'enabled' },
    ],
    status: 'enabled',
  },
]

export const initialSenderToolbarState: EnvelopeToolbarState = {
  ...Object.fromEntries(flattenIcons(SENDER_TOOLBAR)),
  config: [...SENDER_TOOLBAR],
}

export const initialRecipientToolbarState: EnvelopeToolbarState = {
  ...Object.fromEntries(flattenIcons(RECIPIENT_TOOLBAR)),
  config: [...RECIPIENT_TOOLBAR],
}

export interface EnvelopeSectionConfig extends BaseSectionConfig<
  EnvelopeToolbarState,
  EnvelopeKey,
  'sender' | 'recipient'
> {}
